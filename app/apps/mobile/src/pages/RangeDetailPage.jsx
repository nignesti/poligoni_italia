import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRange } from "@/api/rangesApi";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Euro,
  Crosshair,
  Wrench,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { RangeTypeBadge } from "@/components/Badges";
import { Image } from "@/components/ui/image";

export default function RangeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [range, setRange] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!range) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-slate-500">Struttura non trovata</p>
        <button onClick={() => navigate("/")} className="mt-4 text-orange-600 font-medium">
          Torna alla ricerca
        </button>
      </div>
    );
  }

  const isBookable = range.status === "partner";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero image */}
      {range.image_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image src={range.image_url} alt={range.name} className="w-full h-full object-cover" fittingType="fill" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <RangeTypeBadge type={range.type} />
              {isBookable && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-green-500 text-white">
                  <CheckCircle2 className="w-3 h-3" /> Prenotabile
                </span>
              )}
            </div>
            <h1 className="text-white text-xl font-bold">{range.name}</h1>
          </div>
        </div>
      )}

      <div className="px-4 py-4 space-y-4">
        {!range.image_url && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <RangeTypeBadge type={range.type} />
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{range.address}</p>
              <p className="text-sm text-slate-500">
                {range.comune}, {range.provincia}
                {range.cap ? ` (${range.cap})` : ""}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{range.regione}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {range.description && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">{range.description}</p>
          </div>
        )}

        {/* Hours */}
        {range.hours_notes && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900 text-sm">Orari</h3>
            </div>
            <p className="text-sm text-slate-600 whitespace-pre-line">{range.hours_notes}</p>
          </div>
        )}

        {/* Pricing */}
        {range.pricing_notes && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900 text-sm">Listino</h3>
            </div>
            <p className="text-sm text-slate-600 whitespace-pre-line">{range.pricing_notes}</p>
          </div>
        )}

        {/* Technical info */}
        {(range.calibers?.length > 0 || range.distances_m?.length > 0 || range.disciplines?.length > 0) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Crosshair className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900 text-sm">Dati tecnici</h3>
            </div>

            {range.distances_m?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-slate-400 font-medium mb-1">Distanze</p>
                <div className="flex flex-wrap gap-1.5">
                  {range.distances_m.map((d) => (
                    <span key={d} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg font-medium">
                      {d}m
                    </span>
                  ))}
                </div>
              </div>
            )}

            {range.calibers?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-slate-400 font-medium mb-1">Calibri ammessi</p>
                <div className="flex flex-wrap gap-1.5">
                  {range.calibers.map((c) => (
                    <span key={c} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {range.disciplines?.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Discipline</p>
                <div className="flex flex-wrap gap-1.5">
                  {range.disciplines.map((d) => (
                    <span key={d} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-lg">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Services */}
        {range.services?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900 text-sm">Servizi</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {range.services.map((s) => (
                <div key={s} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-900 text-sm">Contatti</h3>
          {range.phone && (
            <a href={`tel:${range.phone}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-orange-600">
              <Phone className="w-4 h-4 text-slate-400" />
              {range.phone}
            </a>
          )}
          {range.email && (
            <a href={`mailto:${range.email}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-orange-600">
              <Mail className="w-4 h-4 text-slate-400" />
              {range.email}
            </a>
          )}
          {range.website && (
            <a
              href={range.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-slate-700 hover:text-orange-600"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              Sito web
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-3 flex gap-2">
          {isBookable ? (
            <button
              onClick={() => navigate(`/prenota/${range.id}`)}
              className="flex-1 bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform"
            >
              Prenota un slot
            </button>
          ) : (
            <button
              onClick={() => navigate(`/richiedi/${range.id}`)}
              className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform"
            >
              Richiedi disponibilità
            </button>
          )}
        </div>
      </div>
    </div>
  );
}