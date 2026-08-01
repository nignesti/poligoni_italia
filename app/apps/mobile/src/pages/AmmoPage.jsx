import React, { useState, useEffect } from "react";
import { listAmmoMovements, createAmmoMovement } from "@/api/ammoApi";
import { Boxes, Plus, Loader2, AlertTriangle, ShieldCheck, X, ArrowDown, ArrowUp } from "lucide-react";
import {
  evaluateAmmoLimits,
  computeInventoryByCategory,
  AMMO_DISCLAIMER,
  LOCAL_ONLY_DISCLAIMER,
  LEGAL_AMMO_LIMITS,
} from "@/lib/domain";
import { AmmoLevelBadge, ProgressBar } from "@/components/Badges";

export default function AmmoPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await listAmmoMovements();
      setMovements(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const inventoryByCategory = computeInventoryByCategory(
    movements.map((m) => ({ category: m.category, delta: m.delta }))
  );
  const statuses = evaluateAmmoLimits(inventoryByCategory);

  const [newMovement, setNewMovement] = useState({
    caliber: "",
    category: "arma_corta",
    delta: 50,
    reason: "acquisto",
  });

  const handleAddMovement = async () => {
    setSaving(true);
    try {
      await createAmmoMovement({
        caliber: newMovement.caliber,
        category: newMovement.category,
        delta: Number(newMovement.delta),
        reason: newMovement.reason,
      });
      setNewMovement({ caliber: "", category: "arma_corta", delta: 50, reason: "acquisto" });
      setShowAdd(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Errore nel salvataggio");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-2 mb-1">
          <Boxes className="w-6 h-6 text-orange-500" />
          <h1 className="text-xl font-bold">Munizioni</h1>
        </div>
        <p className="text-sm text-slate-300">Limiti di detenzione — art. 97 TULPS</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Disclaimer legale */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{AMMO_DISCLAIMER}</p>
        </div>

        {/* Disclaimer privacy */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-800 leading-relaxed">{LOCAL_ONLY_DISCLAIMER}</p>
        </div>

        {/* Status cards */}
        <div className="space-y-3">
          {statuses.map((s) => (
            <div key={s.category} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{s.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {s.quantity} / {s.limit} {s.unit}
                  </p>
                </div>
                <AmmoLevelBadge level={s.level} />
              </div>

              <ProgressBar value={s.quantity} max={s.limit} level={s.level} />

              <p className={`text-xs mt-2 ${s.level === "oltre" ? "text-red-600 font-medium" : "text-slate-500"}`}>
                {s.message}
              </p>
              <p className="text-[10px] text-slate-300 mt-1">{s.legalReference}</p>
            </div>
          ))}
        </div>

        {/* Add movement button */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" /> Registra movimento
        </button>

        {/* Recent movements */}
        {movements.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Movimenti recenti</h2>
            <div className="space-y-2">
              {movements.slice(0, 15).map((m) => (
                <div key={m.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      m.delta > 0 ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    {m.delta > 0 ? (
                      <ArrowDown className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUp className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {m.caliber} · {m.delta > 0 ? "+" : ""}
                      {m.delta}
                    </p>
                    <p className="text-xs text-slate-400">
                      {m.reason} · {new Date(m.occurred_at).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add movement modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="bg-white rounded-t-3xl p-5 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Movimento munizioni</h3>
              <button onClick={() => setShowAdd(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500">Categoria</label>
                <select
                  value={newMovement.category}
                  onChange={(e) => setNewMovement({ ...newMovement, category: e.target.value })}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {LEGAL_AMMO_LIMITS.map((l) => (
                    <option key={l.category} value={l.category}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">Calibro</label>
                <input
                  type="text"
                  value={newMovement.caliber}
                  onChange={(e) => setNewMovement({ ...newMovement, caliber: e.target.value })}
                  placeholder="9x21, 22LR, 12 gauge..."
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-500">Quantità</label>
                  <input
                    type="number"
                    value={newMovement.delta}
                    onChange={(e) => setNewMovement({ ...newMovement, delta: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Negativo per consumo</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Motivo</label>
                  <select
                    value={newMovement.reason}
                    onChange={(e) => setNewMovement({ ...newMovement, reason: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="acquisto">Acquisto</option>
                    <option value="consumo_sessione">Consumo sessione</option>
                    <option value="ricarica">Ricarica</option>
                    <option value="correzione">Correzione</option>
                    <option value="cessione">Cessione</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddMovement}
                disabled={!newMovement.caliber || !newMovement.delta || saving}
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform"
              >
                {saving ? "Salvataggio…" : "Salva movimento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
