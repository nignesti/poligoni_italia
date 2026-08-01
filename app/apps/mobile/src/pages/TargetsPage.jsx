import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listSessions } from "@/api/sessionsApi";
import { listFirearms } from "@/api/firearmsApi";
import { listTargets, listHoles, createTarget, deleteTarget } from "@/api/targetsApi";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  RotateCcw,
  Crosshair as CrosshairIcon,
  Check,
} from "lucide-react";
import { TARGET_DISCLAIMER, TARGET_TYPES, TARGET_DIAGRAM_DIAMETER_MM, formatDate } from "@/lib/domain";
import { computeGroupStats } from "@/lib/domain";

const VIEWBOX = 300;
const CENTER = 150;
const RING_RADIUS_SVG = 130;
const MM_PER_SVG_UNIT = TARGET_DIAGRAM_DIAMETER_MM / 2 / RING_RADIUS_SVG;
const RING_COUNT = 5;

function mmToSvg(hole) {
  return {
    x: CENTER + hole.x / MM_PER_SVG_UNIT,
    y: CENTER - hole.y / MM_PER_SVG_UNIT,
  };
}

function TargetDiagram({ holes, onTap, readOnly }) {
  const svgRef = useRef(null);

  const handleClick = (e) => {
    if (readOnly || !onTap) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scale = VIEWBOX / rect.width;
    const svgX = (e.clientX - rect.left) * scale;
    const svgY = (e.clientY - rect.top) * scale;
    const mmX = (svgX - CENTER) * MM_PER_SVG_UNIT;
    const mmY = -(svgY - CENTER) * MM_PER_SVG_UNIT;
    onTap({ x: Math.round(mmX * 10) / 10, y: Math.round(mmY * 10) / 10 });
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      onClick={handleClick}
      className={`w-full aspect-square bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 ${
        readOnly ? "" : "cursor-crosshair"
      }`}
    >
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <circle
          key={i}
          cx={CENTER}
          cy={CENTER}
          r={(RING_RADIUS_SVG / RING_COUNT) * (i + 1)}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth={1}
        />
      ))}
      <line x1={CENTER - RING_RADIUS_SVG} y1={CENTER} x2={CENTER + RING_RADIUS_SVG} y2={CENTER} stroke="#cbd5e1" strokeWidth={1} />
      <line x1={CENTER} y1={CENTER - RING_RADIUS_SVG} x2={CENTER} y2={CENTER + RING_RADIUS_SVG} stroke="#cbd5e1" strokeWidth={1} />

      {holes.map((h, i) => {
        const p = mmToSvg(h);
        return <circle key={i} cx={p.x} cy={p.y} r={5} fill="#ea580c" stroke="white" strokeWidth={1.5} />;
      })}
    </svg>
  );
}

function StatsCard({ stats }) {
  if (!stats) return null;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Colpi</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.shots}</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Raggio medio</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.meanRadius} mm</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Extreme spread</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.extremeSpread} mm</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Deviazione std.</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.standardDeviation} mm</p>
      </div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Deriva / alzo</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {stats.windage} / {stats.elevation} mm
        </p>
      </div>
      {stats.groupSizeMOA !== undefined && (
        <div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gruppo</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{stats.groupSizeMOA} MOA</p>
        </div>
      )}
    </div>
  );
}

function Header({ navigate, title, onBack }) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
      <button onClick={onBack || (() => navigate(-1))} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h1>
    </div>
  );
}

export default function TargetsPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("list"); // list | setup | marking | result | detail
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const [sessions, setSessions] = useState([]);
  const [firearms, setFirearms] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [firearmLabel, setFirearmLabel] = useState("");
  const [targetType, setTargetType] = useState(TARGET_TYPES[0].value);
  const [distanceM, setDistanceM] = useState(25);

  const [holes, setHoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedStats, setSavedStats] = useState(null);

  const [detailTarget, setDetailTarget] = useState(null);
  const [detailHoles, setDetailHoles] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await listTargets();
      setHistory(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const startSetup = async () => {
    try {
      const [sess, arms] = await Promise.all([listSessions(), listFirearms()]);
      setSessions(sess || []);
      setFirearms(arms || []);
      if (sess?.length > 0) setSessionId(sess[0].id);
      setPhase("setup");
    } catch (e) {
      console.error(e);
    }
  };

  const startMarking = () => {
    setHoles([]);
    setPhase("marking");
  };

  const handleTap = (mm) => {
    setHoles((h) => [...h, { ...mm, score: "" }]);
  };

  const removeHole = (index) => {
    setHoles((h) => h.filter((_, i) => i !== index));
  };

  const updateScore = (index, value) => {
    setHoles((h) => h.map((hole, i) => (i === index ? { ...hole, score: value } : hole)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await createTarget({
        sessionId,
        firearmLabel: firearmLabel || null,
        targetType,
        distanceM: Number(distanceM),
        holes: holes.map((h) => ({
          x: h.x,
          y: h.y,
          score: h.score === "" ? null : Number(h.score),
        })),
      });
      setSavedStats(computeGroupStats(holes, Number(distanceM)));
      setPhase("result");
      loadHistory();
    } catch (e) {
      console.error(e);
      alert("Errore nel salvataggio");
    }
    setSaving(false);
  };

  const openDetail = async (target) => {
    setDetailTarget(target);
    setDetailLoading(true);
    setPhase("detail");
    try {
      const h = await listHoles(target.id);
      setDetailHoles(h.map((row) => ({ x: row.x_mm, y: row.y_mm, score: row.score })));
    } catch (e) {
      console.error(e);
    }
    setDetailLoading(false);
  };

  const handleDeleteDetail = async () => {
    if (!detailTarget) return;
    try {
      await deleteTarget(detailTarget.id);
      setPhase("list");
      loadHistory();
    } catch (e) {
      console.error(e);
    }
  };

  const reset = () => {
    setPhase("list");
    setHoles([]);
    setSavedStats(null);
  };

  if (loading && phase === "list") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (phase === "list") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header navigate={navigate} title="Bersagli" />
        <div className="px-4 py-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{TARGET_DISCLAIMER}</p>
          </div>

          <button
            onClick={startSetup}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" /> Nuovo bersaglio
          </button>

          {history.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-800">
              <CrosshairIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Nessun bersaglio marcato</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Marca i fori dopo una sessione per vedere le statistiche del gruppo</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openDetail(t)}
                  className="w-full text-left bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {TARGET_TYPES.find((tt) => tt.value === t.target_type)?.label || t.target_type || "Bersaglio"}
                    {t.distance_m ? ` · ${t.distance_m}m` : ""}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {t.session_range_name ? `${t.session_range_name} · ` : ""}
                    {formatDate(t.created_at)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header navigate={navigate} title="Nuovo bersaglio" onBack={() => setPhase("list")} />
        <div className="px-4 py-4 space-y-4">
          {sessions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Nessuna sessione registrata</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-3">Il bersaglio va collegato a una sessione del diario</p>
              <button
                onClick={() => navigate("/diario")}
                className="bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm"
              >
                Vai al Diario
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Sessione</label>
                <select
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.range_name_manual} · {formatDate(s.started_at)}
                    </option>
                  ))}
                </select>
              </div>

              {firearms.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Arma (opzionale)</label>
                  <select
                    value={firearmLabel}
                    onChange={(e) => setFirearmLabel(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Nessuna</option>
                    {firearms.map((f) => (
                      <option key={f.id} value={f.nickname}>
                        {f.nickname}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Tipo bersaglio</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {TARGET_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTargetType(t.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        targetType === t.value ? "bg-orange-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Distanza (m)</label>
                <input
                  type="number"
                  value={distanceM}
                  onChange={(e) => setDistanceM(e.target.value)}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={startMarking}
                className="w-full bg-orange-600 text-white font-semibold py-3.5 rounded-xl text-sm active:scale-95 transition-transform"
              >
                Inizia marcatura
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (phase === "marking") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
        <Header navigate={navigate} title="Marca i fori" onBack={() => setPhase("setup")} />
        <div className="px-4 py-4 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Tocca il bersaglio per segnare un foro. {holes.length} colpo/i registrato/i.</p>
          <TargetDiagram holes={holes} onTap={handleTap} />

          {holes.length > 0 && (
            <div className="space-y-2">
              {holes.map((h, i) => (
                <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-2.5 shadow-sm border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 dark:text-slate-500 w-16 flex-shrink-0">
                    {h.x}, {h.y} mm
                  </span>
                  <input
                    type="number"
                    value={h.score}
                    onChange={(e) => updateScore(i, e.target.value)}
                    placeholder="punteggio"
                    className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button onClick={() => removeHole(i)} className="p-1 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:text-red-400 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setHoles([])}
              disabled={holes.length === 0}
              className="flex items-center justify-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium py-3 px-4 rounded-xl text-sm disabled:opacity-30"
            >
              <RotateCcw className="w-4 h-4" /> Svuota
            </button>
            <button
              onClick={handleSave}
              disabled={holes.length === 0 || saving}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? "Salvataggio…" : "Salva bersaglio"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header navigate={navigate} title="Bersaglio salvato" onBack={reset} />
        <div className="px-4 py-4 space-y-4">
          <TargetDiagram holes={holes} readOnly />
          <StatsCard stats={savedStats} />
          <button
            onClick={reset}
            className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform"
          >
            Torna allo storico
          </button>
        </div>
      </div>
    );
  }

  if (phase === "detail") {
    const stats = detailHoles.length > 0 ? computeGroupStats(detailHoles, detailTarget?.distance_m) : null;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header navigate={navigate} title="Bersaglio" onBack={() => setPhase("list")} />
        <div className="px-4 py-4 space-y-4">
          {detailLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : (
            <>
              <TargetDiagram holes={detailHoles} readOnly />
              <StatsCard stats={stats} />
              <button
                onClick={handleDeleteDetail}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium py-3 rounded-xl text-sm"
              >
                <Trash2 className="w-4 h-4" /> Elimina bersaglio
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
