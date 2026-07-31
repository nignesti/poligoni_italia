import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRange } from "@/api/rangesApi";
import { createBookingRequest } from "@/api/requestsApi";
import { ArrowLeft, Loader2, Send, CheckCircle2 } from "lucide-react";

export default function RequestAvailabilityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [range, setRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    requested_date: "",
    requested_time: "",
    message: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getRange(id);
        setRange(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, [id]);

  const handleSend = async () => {
    setSending(true);
    try {
      await createBookingRequest({
        rangeId: range.id,
        name: form.name,
        email: form.email,
        requestedFor: new Date(`${form.requested_date}T12:00:00`).toISOString(),
        message: [form.requested_time && `Orario preferito: ${form.requested_time}.`, form.message]
          .filter(Boolean)
          .join(" "),
      });
      setSent(true);
    } catch (e) {
      console.error(e);
      alert("Errore nell'invio della richiesta. Riprova.");
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!range) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-slate-500">Struttura non trovata</p>
        <button onClick={() => navigate("/")} className="mt-4 text-orange-600 font-medium">
          Torna alla ricerca
        </button>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Richiesta inviata!</h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          Abbiamo inoltrato la tua richiesta a {range.name}. Riceverai una risposta via email.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-slate-900 text-white font-semibold py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
        >
          Torna alla ricerca
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-slate-900 text-sm">Richiedi disponibilità</h1>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <h3 className="font-semibold text-slate-900 text-sm">{range.name}</h3>
          <p className="text-xs text-slate-500">{range.comune}, {range.provincia}</p>
          <p className="text-xs text-slate-400 mt-1">
            Questa struttura non è ancora partner per la prenotazione online. Invia una richiesta di disponibilità.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500">Nome e cognome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Data desiderata</label>
            <input
              type="date"
              value={form.requested_date}
              onChange={(e) => setForm({ ...form, requested_date: e.target.value })}
              className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Orario preferito</label>
            <input
              type="text"
              value={form.requested_time}
              onChange={(e) => setForm({ ...form, requested_time: e.target.value })}
              placeholder="Es. sabato mattina"
              className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Messaggio</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Es. vorrei prenotare una linea per 9x21, sono disponibile anche in altri giorni..."
              className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!form.requested_date || !form.name || !form.email || sending}
            className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? "Invio…" : "Invia richiesta"}
          </button>
        </div>
      </div>
    </div>
  );
}
