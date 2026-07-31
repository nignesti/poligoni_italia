import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appClient } from "@/api/appClient";
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
      await appClient.entities.Firearm.create(form);
      navigate("/diario");
    } catch (e) {
      console.error(e);
      alert("Errore nel salvataggio");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-slate-900 text-sm">Aggiungi arma</h1>
      </div>

      <div className="px-4 py-4">
        {/* Privacy note */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-800 leading-relaxed">
            L'arma si registra per tipo e calibro, senza numeri di matricola né documenti di detenzione. I tuoi dati sono privati e mai usati per targeting pubblicitario.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500">Soprannome</label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              placeholder="La 92 di papà"
              className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Tipo</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["pistola", "revolver", "carabina", "fucile", "avancarica"].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    form.type === t ? "bg-orange-600 text-white" : "bg-white border border-slate-200 text-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Calibro</label>
            <input
              type="text"
              value={form.caliber}
              onChange={(e) => setForm({ ...form, caliber: e.target.value })}
              placeholder="9x21"
              className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-500">Marca</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="Beretta"
                className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Modello</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="92FS"
                className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Note</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Note opzionali..."
              className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[60px]"
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