import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listBookings, cancelBooking } from "@/api/bookingsApi";
import { Calendar, QrCode, Loader2, MapPin, Clock, Plus, X } from "lucide-react";
import { StatusBadge } from "@/components/Badges";
import { formatDate } from "@/lib/domain";

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrBooking, setQrBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await listBookings();
      setBookings(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const upcoming = bookings.filter(
    (b) => b.status === "confermata" || b.status === "richiesta"
  );
  const past = bookings.filter(
    (b) => b.status === "completata" || b.status === "annullata" || b.status === "no_show"
  );

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      loadBookings();
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">Le mie prenotazioni</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gestisci i tuoi slot e check-in QR</p>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Upcoming */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Prossime</h2>
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Nessuna prenotazione attiva</p>
              <button
                onClick={() => navigate("/")}
                className="mt-3 text-orange-600 text-sm font-medium flex items-center gap-1 justify-center"
              >
                <Plus className="w-4 h-4" /> Trova un poligono
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">{b.range_name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {b.range_comune || "—"}
                      </div>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(b.slot_start)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(b.slot_start).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                      {" - "}
                      {new Date(b.slot_end).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQrBooking(b)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-semibold active:scale-95 transition-transform"
                    >
                      <QrCode className="w-4 h-4" /> Check-in QR
                    </button>
                    {b.status === "confermata" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold active:scale-95 transition-transform"
                      >
                        Annulla
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Storico</h2>
            <div className="space-y-2">
              {past.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 opacity-70">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 text-sm truncate">{b.range_name}</h3>
                      <p className="text-xs text-slate-500">
                        {formatDate(b.slot_start)} ·{" "}
                        {new Date(b.slot_start).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
          onClick={() => setQrBooking(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Check-in QR</h3>
              <button onClick={() => setQrBooking(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 flex items-center justify-center mb-4">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 49 }, (_, i) => {
                  const seed = qrBooking.qr_token?.charCodeAt(i % qrBooking.qr_token.length) || 0;
                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${(seed + i) % 3 === 0 ? "bg-white" : "bg-slate-900"}`}
                    />
                  );
                })}
              </div>
            </div>
            <p className="text-center font-mono text-sm font-bold text-slate-900 mb-1">{qrBooking.qr_token}</p>
            <p className="text-center text-sm text-slate-600">{qrBooking.range_name}</p>
            <p className="text-center text-xs text-slate-400">
              {formatDate(qrBooking.slot_start)} ·{" "}
              {new Date(qrBooking.slot_start).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-xs text-center text-slate-400 mt-3">
              Mostra questo codice al banco di segreteria
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
