import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listSessions, listSessionShots, createSession, deleteSession } from "@/api/sessionsApi";
import { listFirearms, deleteFirearm } from "@/api/firearmsApi";
import { createAmmoMovement } from "@/api/ammoApi";
import { Crosshair, Plus, Loader2, Calendar, Trash2, X, ShieldCheck, Timer, Award, ChevronRight } from "lucide-react";
import { formatDate, LOCAL_ONLY_DISCLAIMER, evaluateBadges } from "@/lib/domain";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

export default function DiaryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [firearms, setFirearms] = useState([]);
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState("sessions"); // sessions | firearms

  useBodyScrollLock(showAdd);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sess, arms, sh] = await Promise.all([listSessions(), listFirearms(), listSessionShots()]);
      setSessions(sess || []);
      setFirearms(arms || []);
      setShots(sh || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const roundsByFirearm = shots.reduce((acc, s) => {
    const key = s.firearm_label || s.caliber;
    acc[key] = (acc[key] || 0) + (s.rounds_fired || 0);
    return acc;
  }, {});

  const [newSession, setNewSession] = useState({
    range_name: "",
    started_at: new Date().toISOString().slice(0, 16),
    duration_min: 60,
    distance_m: 25,
    firearm_id: "",
    caliber: "",
    rounds_fired: 50,
    notes: "",
  });

  const ammoCategoryFor = (caliber, distanceM) => {
    if (caliber?.toLowerCase().includes("gauge") || caliber?.toLowerCase().includes("pallini")) return "spezzone";
    return distanceM <= 50 ? "arma_corta" : "arma_lunga_caccia";
  };

  const handleAddSession = async () => {
    try {
      const selectedFirearm = firearms.find((f) => f.id === newSession.firearm_id);
      const session = await createSession({
        rangeName: newSession.range_name,
        startedAt: new Date(newSession.started_at).toISOString(),
        durationMin: Number(newSession.duration_min),
        distanceM: Number(newSession.distance_m),
        firearmLabel: selectedFirearm?.nickname || null,
        caliber: newSession.caliber,
        roundsFired: Number(newSession.rounds_fired),
        notes: newSession.notes,
      });

      if (newSession.caliber && newSession.rounds_fired) {
        await createAmmoMovement({
          caliber: newSession.caliber,
          category: ammoCategoryFor(newSession.caliber, Number(newSession.distance_m)),
          delta: -Number(newSession.rounds_fired),
          reason: "consumo_sessione",
          sessionId: session.id,
        });
      }

      setNewSession({
        range_name: "",
        started_at: new Date().toISOString().slice(0, 16),
        duration_min: 60,
        distance_m: 25,
        firearm_id: "",
        caliber: "",
        rounds_fired: 50,
        notes: "",
      });
      setShowAdd(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Errore nel salvataggio");
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await deleteSession(id);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFirearm = async (id) => {
    try {
      await deleteFirearm(id);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  const totalRounds = shots.reduce((sum, s) => sum + (s.rounds_fired || 0), 0);
  const distinctCalibers = new Set(shots.map((s) => s.caliber).filter(Boolean)).size;
  const badges = evaluateBadges({ totalRounds, sessionCount: sessions.length, distinctCalibers });
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 px-4 pt-12 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Crosshair className="w-6 h-6 text-orange-500" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Il Mio Tiro</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("sessions")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === "sessions" ? "bg-slate-900 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            Sessioni
          </button>
          <button
            onClick={() => setView("firearms")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === "firearms" ? "bg-slate-900 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            Armi
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {view === "sessions" ? (
          <>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 mb-4 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Crosshair className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Colpi sparati (totale)</p>
                <p className="text-3xl font-bold">{totalRounds.toLocaleString("it-IT")}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 dark:text-slate-500">{sessions.length} sessioni</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {sessions.length > 0 ? `${Math.round(totalRounds / sessions.length)} colpi/sess.` : "—"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm mb-4 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" /> Nuova sessione
            </button>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => navigate("/cronografo")}
                className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-800 text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                    <Timer className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Pro
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Cronografo</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Tempi di reazione e split</p>
              </button>

              <button
                onClick={() => navigate("/medaglie")}
                className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-800 text-left active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Award className="w-4 h-4 text-orange-600" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Medaglie</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {unlockedBadges} / {badges.length} sbloccate
                </p>
              </button>
            </div>

            <button
              onClick={() => navigate("/bersagli")}
              className="w-full flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-800 text-left active:scale-95 transition-transform mb-4"
            >
              <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                <Crosshair className="w-4.5 h-4.5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Bersagli</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Marca i fori e vedi le statistiche del gruppo</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            </button>

            {sessions.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-800">
                <Crosshair className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Nessuna sessione registrata</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Registra le tue sessioni per tenere traccia dei progressi
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{s.range_name_manual}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(s.started_at)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(s.id)}
                        className="p-1 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
                      {s.distance_m && (
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{s.distance_m}m</span>
                      )}
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{s.duration_min} min</span>
                    </div>

                    {s.auto_generated && (
                      <span className="inline-block mt-2 text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                        Auto-generata da check-in
                      </span>
                    )}
                    {s.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{s.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/armi/aggiungi")}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm mb-4 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" /> Aggiungi arma
            </button>

            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-3 flex items-start gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-800 dark:text-green-200 leading-relaxed">{LOCAL_ONLY_DISCLAIMER}</p>
            </div>

            {firearms.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Nessun'arma registrata</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Le armi si registrano per tipo e calibro, senza matricole
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {firearms.map((f) => (
                  <div key={f.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{f.nickname}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg capitalize">
                            {f.type}
                          </span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                            {f.caliber}
                          </span>
                        </div>
                        {f.notes && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{f.notes}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteFirearm(f.id)}
                        className="p-1 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400 dark:text-slate-500">Colpi totali</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{roundsByFirearm[f.nickname] || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add session modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 pb-safe max-w-md w-full max-h-[85dvh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Nuova sessione</h3>
              <button onClick={() => setShowAdd(false)}>
                <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Poligono</label>
                <input
                  type="text"
                  value={newSession.range_name}
                  onChange={(e) => setNewSession({ ...newSession, range_name: e.target.value })}
                  placeholder="Nome poligono"
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Data e ora</label>
                <input
                  type="datetime-local"
                  value={newSession.started_at}
                  onChange={(e) => setNewSession({ ...newSession, started_at: e.target.value })}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Durata (min)</label>
                  <input
                    type="number"
                    value={newSession.duration_min}
                    onChange={(e) => setNewSession({ ...newSession, duration_min: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Distanza (m)</label>
                  <input
                    type="number"
                    value={newSession.distance_m}
                    onChange={(e) => setNewSession({ ...newSession, distance_m: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {firearms.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Arma</label>
                  <select
                    value={newSession.firearm_id}
                    onChange={(e) => {
                      const arm = firearms.find((f) => f.id === e.target.value);
                      setNewSession({
                        ...newSession,
                        firearm_id: e.target.value,
                        caliber: arm?.caliber || "",
                      });
                    }}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Seleziona</option>
                    {firearms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nickname} ({f.caliber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Calibro</label>
                  <input
                    type="text"
                    value={newSession.caliber}
                    onChange={(e) => setNewSession({ ...newSession, caliber: e.target.value })}
                    placeholder="9x21"
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Colpi sparati</label>
                  <input
                    type="number"
                    value={newSession.rounds_fired}
                    onChange={(e) => setNewSession({ ...newSession, rounds_fired: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Note</label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  placeholder="Note sulla sessione..."
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[60px]"
                />
              </div>

              <button
                onClick={handleAddSession}
                disabled={!newSession.range_name}
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform"
              >
                Salva sessione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
