import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appClient } from "@/api/appClient";
import { Crosshair, Plus, Loader2, MapPin, Calendar, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/domain";

export default function DiaryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [firearms, setFirearms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState("sessions"); // sessions | firearms

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sess, arms] = await Promise.all([
        appClient.entities.Session.filter({}, "-started_at", 50),
        appClient.entities.Firearm.filter({}, "-created_date", 50),
      ]);
      setSessions(sess || []);
      setFirearms(arms || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const [newSession, setNewSession] = useState({
    range_name: "",
    started_at: new Date().toISOString().slice(0, 16),
    duration_min: 60,
    distance_m: 25,
    firearm_nickname: "",
    caliber: "",
    rounds_fired: 50,
    notes: "",
  });

  const handleAddSession = async () => {
    try {
      await appClient.entities.Session.create({
        ...newSession,
        started_at: new Date(newSession.started_at).toISOString(),
        confirmed_by_user: true,
        auto_generated: false,
      });
      // Aggiorna colpi totali arma
      if (newSession.firearm_nickname) {
        const arm = firearms.find((f) => f.nickname === newSession.firearm_nickname);
        if (arm) {
          await appClient.entities.Firearm.update(arm.id, {
            total_rounds: (arm.total_rounds || 0) + Number(newSession.rounds_fired),
          });
        }
      }
      // Movimento munizioni consumo
      const category = newSession.caliber?.includes("gauge") || newSession.caliber?.includes("pallini")
        ? "spezzone"
        : newSession.distance_m <= 50
        ? "arma_corta"
        : "arma_lunga_caccia";
      await appClient.entities.AmmoMovement.create({
        caliber: newSession.caliber,
        category,
        delta: -Number(newSession.rounds_fired),
        reason: "consumo_sessione",
        occurred_at: new Date().toISOString(),
        note: `Sessione ${newSession.range_name}`,
      });
      setNewSession({
        range_name: "",
        started_at: new Date().toISOString().slice(0, 16),
        duration_min: 60,
        distance_m: 25,
        firearm_nickname: "",
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
      await appClient.entities.Session.delete(id);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFirearm = async (id) => {
    try {
      await appClient.entities.Firearm.delete(id);
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

  const totalRounds = sessions.reduce((sum, s) => sum + (s.rounds_fired || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Crosshair className="w-6 h-6 text-orange-500" />
          <h1 className="text-xl font-bold text-slate-900">Il Mio Tiro</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("sessions")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === "sessions" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Sessioni
          </button>
          <button
            onClick={() => setView("firearms")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === "firearms" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
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
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Colpi sparati (totale)</p>
                <p className="text-3xl font-bold">{totalRounds.toLocaleString("it-IT")}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{sessions.length} sessioni</p>
                <p className="text-xs text-slate-500 mt-0.5">
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

            {sessions.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
                <Crosshair className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Nessuna sessione registrata</p>
                <p className="text-xs text-slate-400 mt-1">
                  Registra le tue sessioni per tenere traccia dei progressi
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm">{s.range_name}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(s.started_at)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(s.id)}
                        className="p-1 text-slate-300 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                      {s.distance_m && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded-lg">{s.distance_m}m</span>
                      )}
                      {s.firearm_nickname && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded-lg">{s.firearm_nickname}</span>
                      )}
                      {s.caliber && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded-lg">{s.caliber}</span>
                      )}
                      {s.rounds_fired > 0 && (
                        <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-lg font-medium">
                          {s.rounds_fired} colpi
                        </span>
                      )}
                      <span className="bg-slate-100 px-2 py-0.5 rounded-lg">{s.duration_min} min</span>
                    </div>

                    {s.auto_generated && (
                      <span className="inline-block mt-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        Auto-generata da check-in
                      </span>
                    )}
                    {s.notes && <p className="text-xs text-slate-500 mt-2">{s.notes}</p>}
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

            {firearms.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
                <p className="text-sm text-slate-500">Nessun'arma registrata</p>
                <p className="text-xs text-slate-400 mt-1">
                  Le armi si registrano per tipo e calibro, senza matricole
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {firearms.map((f) => (
                  <div key={f.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-sm">{f.nickname}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg capitalize">
                            {f.type}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">
                            {f.caliber}
                          </span>
                        </div>
                        {(f.brand || f.model) && (
                          <p className="text-xs text-slate-400 mt-1">
                            {[f.brand, f.model].filter(Boolean).join(" ")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteFirearm(f.id)}
                        className="p-1 text-slate-300 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Colpi totali</span>
                      <span className="text-sm font-bold text-slate-900">{f.total_rounds || 0}</span>
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="bg-white rounded-t-3xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Nuova sessione</h3>
              <button onClick={() => setShowAdd(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500">Poligono</label>
                <input
                  type="text"
                  value={newSession.range_name}
                  onChange={(e) => setNewSession({ ...newSession, range_name: e.target.value })}
                  placeholder="Nome poligono"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">Data e ora</label>
                <input
                  type="datetime-local"
                  value={newSession.started_at}
                  onChange={(e) => setNewSession({ ...newSession, started_at: e.target.value })}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-500">Durata (min)</label>
                  <input
                    type="number"
                    value={newSession.duration_min}
                    onChange={(e) => setNewSession({ ...newSession, duration_min: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Distanza (m)</label>
                  <input
                    type="number"
                    value={newSession.distance_m}
                    onChange={(e) => setNewSession({ ...newSession, distance_m: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {firearms.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-500">Arma</label>
                  <select
                    value={newSession.firearm_nickname}
                    onChange={(e) => {
                      const arm = firearms.find((f) => f.nickname === e.target.value);
                      setNewSession({
                        ...newSession,
                        firearm_nickname: e.target.value,
                        caliber: arm?.caliber || "",
                      });
                    }}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Seleziona</option>
                    {firearms.map((f) => (
                      <option key={f.id} value={f.nickname}>
                        {f.nickname} ({f.caliber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-500">Calibro</label>
                  <input
                    type="text"
                    value={newSession.caliber}
                    onChange={(e) => setNewSession({ ...newSession, caliber: e.target.value })}
                    placeholder="9x21"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Colpi sparati</label>
                  <input
                    type="number"
                    value={newSession.rounds_fired}
                    onChange={(e) => setNewSession({ ...newSession, rounds_fired: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">Note</label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  placeholder="Note sulla sessione..."
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[60px]"
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