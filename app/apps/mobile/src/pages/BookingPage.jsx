import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRange } from "@/api/rangesApi";
import { createBookingRequest } from "@/api/requestsApi";
import { ArrowLeft, Clock, Check, Loader2, CheckCircle2 } from "lucide-react";

// Nessuna struttura ha ancora linee/orari popolati in range_lines (Piano
// §4.1): senza quei dati non esiste uno slot reale da prenotare. Questo
// flusso raccoglie data/ora/durata desiderate e le inoltra come richiesta
// di disponibilità (booking_requests), non come prenotazione confermata.
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30",
];

const DURATIONS = [
  { min: 60, label: "1 ora" },
  { min: 90, label: "1.5 ore" },
  { min: 120, label: "2 ore" },
];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [range, setRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: date/time, 2: contatti, 3: riepilogo
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [duration, setDuration] = useState(60);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRange(id);
        setRange(data);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split("T")[0]);
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
        name,
        email,
        requestedFor: new Date(`${selectedDate}T${selectedSlot}:00`).toISOString(),
        message: `Durata desiderata: ${duration} min.${notes ? ` Note: ${notes}` : ""}`,
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

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      value: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("it-IT", { weekday: "short" }),
      num: d.getDate(),
      month: d.toLocaleDateString("it-IT", { month: "short" }),
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-slate-900 text-sm">Richiedi disponibilità</h1>
          <p className="text-xs text-slate-500">{range.name}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 px-4 py-3">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full ${s <= step ? "bg-orange-500" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <div className="px-4 space-y-4">
        {step === 1 && (
          <>
            {/* Date selector */}
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Data desiderata</h3>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={`flex-shrink-0 w-16 py-2 rounded-xl border-2 transition-colors ${
                      selectedDate === d.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="text-xs text-slate-500 capitalize">{d.day}</p>
                    <p className="text-lg font-bold text-slate-900">{d.num}</p>
                    <p className="text-xs text-slate-400 capitalize">{d.month}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Orario preferito
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedSlot === slot
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Durata</h3>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.min}
                    onClick={() => setDuration(d.min)}
                    className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                      duration === d.min
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(2)}
              className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform"
            >
              Continua
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">I tuoi contatti</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome e cognome"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Note (opzionale)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Es. primo accesso, noleggio arma..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px]"
              />
            </div>

            <button
              disabled={!name || !email}
              onClick={() => setStep(3)}
              className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform"
            >
              Continua
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">Riepilogo richiesta</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Struttura</span>
                  <span className="font-medium text-slate-900">{range.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Data</span>
                  <span className="font-medium text-slate-900">
                    {new Date(selectedDate).toLocaleDateString("it-IT", { day: "numeric", month: "long" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Orario</span>
                  <span className="font-medium text-slate-900">{selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Durata</span>
                  <span className="font-medium text-slate-900">{duration} min</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-xs text-orange-800">
                Questa struttura non ha ancora la prenotazione online attiva: la tua richiesta viene inoltrata al gestore, che ti risponderà via email.
              </p>
            </div>

            <button
              disabled={sending}
              onClick={handleSend}
              className="w-full bg-orange-600 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {sending ? "Invio…" : "Invia richiesta"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
