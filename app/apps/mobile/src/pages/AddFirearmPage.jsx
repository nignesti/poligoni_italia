import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFirearm } from "@/api/firearmsApi";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function AddFirearmPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: "",
    type: "pistola",
    caliber: "",
    brand: "",
    model: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const notes = [
        [form.brand, form.model].filter(Boolean).join(" "),
        form.notes,
      ]
        .filter(Boolean)
        .join(" — ");
      await createFirearm({
        nickname: form.nickname,
        type: form.type,
        caliber: form.caliber,
        notes: notes || null,
      });
      navigate("/diario");
    } catch (e) {
      console.error(e);
      alert("Errore nel salvataggio");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-slate-900 dark:text-white text-sm">Aggiungi arma</h1>
      </div>

      <div className="px-4 py-4">
        {/* Privacy note */}
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-3 flex items-start gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-800 dark:text-green-200 leading-relaxed">
            L'arma si registra per tipo e calibro, senza numeri di matricola né documenti di detenzione. La tua armeria resta solo su questo dispositivo: non la inviamo né la conserviamo sui nostri server.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Soprannome</label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              placeholder="La 92 di papà"
              className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Tipo</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["pistola", "revolver", "carabina", "fucile", "avancarica"].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    form.type === t ? "bg-orange-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Calibro</label>
            <input
              type="text"
              value={form.caliber}
              onChange={(e) => setForm({ ...form, caliber: e.target.value })}
              placeholder="9x21"
              className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Marca</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="Beretta"
                className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Modello</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="92FS"
                className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Note</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Note opzionali..."
              className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[60px]"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.nickname || !form.caliber || saving}
            className="w-full bg-orange-600 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Salvataggio…" : "Aggiungi arma"}
          </button>
        </div>
      </div>
    </div>
  );
}
