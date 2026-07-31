import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appClient } from "@/api/appClient";
import { getRange } from "@/api/rangesApi";
import { ArrowLeft, Clock, Calendar, Check, Loader2 } from "lucide-react";

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
  const [step, setStep] = useState(1); // 1: date/time, 2: details, 3: confirm
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [duration, setDuration] = useState(60);
  const [line, setLine] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);

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

  const getEndDate = (startTime, durMin) => {
    const [h, m] = startTime.split(":").map(Number);
    const total = h * 60 + m + durMin;
    const eh = Math.floor(total / 60) % 24;
    const em = total % 60;
    return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
  };

  const handleConfirm = async () => {
    setBooking(true);
    try {
      const created = await appClient.entities.Booking.create({
        range_id: range.id,
        range_name: range.name,
        range_comune: range.comune,
        slot_date: selectedDate,
        slot_start: selectedSlot,
        slot_end: getEndDate(selectedSlot, duration),
        line_name: line || "Linea 25m",
        distance_m: range.distances_m?.[0] || 25,
        status: "confermata",
        price_cents: 800,
        notes,
        qr_token: Math.random().toString(36).substring(2, 10).toUpperCase(),
      });
      navigate("/prenotazioni");
    } catch (e) {
      console.error(e);
      alert("Errore nella prenotazione. Riprova.");
    }
    setBooking(false);
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
          <h1 className="font-semibold text-slate-900 text-sm">Prenota</h1>
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
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Seleziona data</h3>
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
                <Clock className="w-4 h-4" /> Orari disponibili
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
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Linea di tiro</h3>
              <div className="space-y-2">
                {(range.distances_m || [25, 50]).map((dist, i) => (
                  <button
                    key={dist}
                    onClick={() => setLine(`Linea ${dist}m`)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-colors text-left ${
                      line === `Linea ${dist}m`
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Linea {dist}m</p>
                      <p className="text-xs text-slate-500">{dist < 50 ? "Indoor" : "Outdoor"}</p>
                    </div>
                    {line === `Linea ${dist}m` && <Check className="w-5 h-5 text-orange-500" />}
                  </button>
                ))}
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
              disabled={!line}
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
              <h3 className="font-semibold text-slate-900 text-sm">Riepilogo prenotazione</h3>
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
                  <span className="font-medium text-slate-900">
                    {selectedSlot} - {getEndDate(selectedSlot, duration)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Linea</span>
                  <span className="font-medium text-slate-900">{line}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Durata</span>
                  <span className="font-medium text-slate-900">{duration} min</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between">
                  <span className="text-slate-500">Costo</span>
                  <span className="font-bold text-slate-900">8,00 €</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-xs text-orange-800">
                💡 Il check-in QR sarà disponibile nella sezione Prenotazioni. Presentati al banco con il QR.
              </p>
            </div>

            <button
              disabled={booking}
              onClick={handleConfirm}
              className="w-full bg-orange-600 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {booking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {booking ? "Prenotazione…" : "Conferma prenotazione"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}