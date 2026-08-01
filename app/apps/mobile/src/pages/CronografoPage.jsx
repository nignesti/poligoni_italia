import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mic, Play, Square, RotateCcw, Timer, Trophy } from "lucide-react";
import { isProUnlocked } from "@/lib/pro";
import { listLocal, insertLocal } from "@/lib/localStore";
import { CRONOGRAFO_DISCLAIMER } from "@/lib/domain";

const HISTORY_KEY = "cronografo_history";
const MIN_SHOT_INTERVAL_MS = 150; // refrattario tra un colpo e il successivo
const NOISE_SAMPLE_MS = 250; // finestra per stimare il rumore di fondo dopo il segnale
const TRIGGER_MULTIPLIER = 2.5;
const MIN_THRESHOLD = 20; // su una scala 0-128

function formatMs(ms) {
  return (ms / 1000).toFixed(2) + " s";
}

function Header({ navigate }) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
      <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="font-semibold text-slate-900 dark:text-white text-sm">Cronografo</h1>
    </div>
  );
}

function LockedScreen({ navigate }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header navigate={navigate} />
      <div className="px-4 py-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-orange-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Cronografo — funzione Pro</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          Segnale di partenza con ritardo configurabile e rilevamento del colpo tramite microfono, per allenare
          i tempi di reazione e gli split tra colpi.
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 mt-6 w-full max-w-xs">
          <p className="text-xs text-slate-400 dark:text-slate-500">Funzione Pro non ancora acquistabile. In arrivo negli abbonamenti Pro.</p>
        </div>
      </div>
    </div>
  );
}

export default function CronografoPage() {
  const navigate = useNavigate();
  const pro = isProUnlocked();

  const [phase, setPhase] = useState("idle"); // idle | arming | listening | finished | error
  const [delayMode, setDelayMode] = useState("random"); // fixed | random
  const [fixedDelay, setFixedDelay] = useState(2);
  const [minDelay, setMinDelay] = useState(1);
  const [maxDelay, setMaxDelay] = useState(5);
  const [shots, setShots] = useState([]);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => listLocal(HISTORY_KEY));

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const armTimeoutRef = useRef(null);
  const signalAtRef = useRef(0);
  const lastShotAtRef = useRef(0);
  const noiseFloorRef = useRef(10);
  const shotsRef = useRef([]);

  const cleanupAudio = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (armTimeoutRef.current) clearTimeout(armTimeoutRef.current);
    armTimeoutRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  useEffect(() => () => cleanupAudio(), [cleanupAudio]);

  const playBeep = (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1800;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  const startListeningLoop = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);

    const tick = () => {
      if (!analyserRef.current) return;
      analyser.getByteTimeDomainData(data);
      let peak = 0;
      for (let i = 0; i < data.length; i++) {
        const dev = Math.abs(data[i] - 128);
        if (dev > peak) peak = dev;
      }
      const now = performance.now();
      const sinceSignal = now - signalAtRef.current;

      if (sinceSignal < NOISE_SAMPLE_MS) {
        noiseFloorRef.current = Math.max(noiseFloorRef.current, peak);
      } else {
        const threshold = Math.max(MIN_THRESHOLD, noiseFloorRef.current * TRIGGER_MULTIPLIER);
        const sinceLastShot = now - (lastShotAtRef.current || signalAtRef.current);
        if (peak > threshold && sinceLastShot > MIN_SHOT_INTERVAL_MS) {
          lastShotAtRef.current = now;
          const t = Math.round(now - signalAtRef.current);
          shotsRef.current = [...shotsRef.current, t];
          setShots(shotsRef.current);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleStart = async () => {
    setError("");
    setShots([]);
    shotsRef.current = [];
    noiseFloorRef.current = 10;
    lastShotAtRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
    } catch (e) {
      console.error(e);
      setError("Accesso al microfono negato. Consenti l'uso del microfono per usare il cronografo.");
      setPhase("error");
      return;
    }

    setPhase("arming");
    const delaySec =
      delayMode === "fixed" ? fixedDelay : minDelay + Math.random() * Math.max(0, maxDelay - minDelay);

    armTimeoutRef.current = setTimeout(() => {
      if (!audioCtxRef.current) return;
      playBeep(audioCtxRef.current);
      signalAtRef.current = performance.now();
      setPhase("listening");
      startListeningLoop();
    }, delaySec * 1000);
  };

  const handleStop = () => {
    cleanupAudio();
    if (shotsRef.current.length > 0) {
      const run = insertLocal(HISTORY_KEY, { shots: shotsRef.current, recorded_at: new Date().toISOString() });
      setHistory((h) => [run, ...h]);
    }
    setPhase("finished");
  };

  const handleReset = () => {
    cleanupAudio();
    setPhase("idle");
    setShots([]);
    setError("");
  };

  if (!pro) {
    return <LockedScreen navigate={navigate} />;
  }

  const splits = shots.map((t, i) => (i === 0 ? t : t - shots[i - 1]));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header navigate={navigate} />

      <div className="px-4 py-4 space-y-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <Timer className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold">Tempo di reazione e split</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Segnale acustico, rilevamento colpo via microfono</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
          <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{CRONOGRAFO_DISCLAIMER}</p>
        </div>

        {phase === "idle" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ritardo del segnale</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDelayMode("random")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  delayMode === "random" ? "bg-slate-900 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                Casuale
              </button>
              <button
                onClick={() => setDelayMode("fixed")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  delayMode === "fixed" ? "bg-slate-900 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                Fisso
              </button>
            </div>

            {delayMode === "fixed" ? (
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Secondi</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={fixedDelay}
                  onChange={(e) => setFixedDelay(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Min secondi</label>
                  <input
                    type="number"
                    min={1}
                    max={maxDelay}
                    value={minDelay}
                    onChange={(e) => setMinDelay(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Max secondi</label>
                  <input
                    type="number"
                    min={minDelay}
                    max={20}
                    value={maxDelay}
                    onChange={(e) => setMaxDelay(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-3.5 rounded-xl text-sm active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4" /> Avvia
            </button>
          </div>
        )}

        {phase === "arming" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 animate-pulse">
              <Mic className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Preparati…</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Il segnale partirà a breve</p>
          </div>
        )}

        {phase === "listening" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
              <Mic className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">In ascolto…</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{shots.length} colpo/i rilevato/i</p>
            <button
              onClick={handleStop}
              className="mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl text-sm active:scale-95 transition-transform"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={handleReset}
              className="mt-3 flex items-center justify-center gap-2 mx-auto bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-medium py-2 px-4 rounded-xl text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Riprova
            </button>
          </div>
        )}

        {phase === "finished" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Risultati</h3>
            {shots.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Nessun colpo rilevato</p>
            ) : (
              <div className="space-y-2">
                {shots.map((t, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-xl px-3 py-2.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{i === 0 ? "Tempo di reazione" : `Colpo ${i + 1} — split`}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatMs(splits[i])}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm mt-4 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" /> Nuovo tiro
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Trophy className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cronologia</h2>
            </div>
            <div className="space-y-2">
              {history.slice(0, 10).map((run) => (
                <div key={run.id} className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {run.shots.length} colpo/i · reazione {formatMs(run.shots[0])}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(run.recorded_at).toLocaleString("it-IT")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
