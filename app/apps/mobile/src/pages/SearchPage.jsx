import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listRanges } from "@/api/rangesApi";
import { Search, MapPin, Filter, ChevronRight, Target, Loader2, Map, List } from "lucide-react";
import { RangeTypeBadge } from "@/components/Badges";
import { RANGE_TYPE_LABELS } from "@/lib/domain";
import { Image } from "@/components/ui/image";
import RangeMap from "@/components/RangeMap";

export default function SearchPage() {
  const navigate = useNavigate();
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [filters, setFilters] = useState({
    type: "all",
    indoor: false,
    outdoor: false,
    caliber: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listRanges();
        setRanges(data || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return ranges.filter((r) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.name?.toLowerCase().includes(q) &&
          !r.comune?.toLowerCase().includes(q) &&
          !r.provincia?.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.type !== "all" && r.type !== filters.type) return false;
      if (filters.indoor && !r.is_indoor) return false;
      if (filters.outdoor && !r.is_outdoor) return false;
      if (filters.caliber && !(r.calibers || []).includes(filters.caliber)) return false;
      return true;
    });
  }, [ranges, query, filters]);

  const allCalibers = useMemo(() => {
    const set = new Set();
    ranges.forEach((r) => (r.calibers || []).forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [ranges]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
          <h1 className="text-xl font-bold tracking-tight">Poligoni Italia</h1>
        </div>
        <p className="text-slate-300 text-sm mb-4">Trova e prenota poligoni di tiro in Italia</p>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome, città o provincia..."
            className="w-full bg-white text-slate-900 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-3 flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtri
          {showFilters ? " ▲" : " ▼"}
        </button>

        {showFilters && (
          <div className="mt-3 space-y-3 bg-slate-800/50 rounded-xl p-3">
            <div>
              <label className="text-xs text-slate-400 font-medium">Tipo struttura</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {Object.entries(RANGE_TYPE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilters({ ...filters, type: key })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filters.type === key ? "bg-orange-600 text-white" : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => setFilters({ ...filters, type: "all" })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filters.type === "all" ? "bg-orange-600 text-white" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  Tutti
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, indoor: !filters.indoor })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.indoor ? "bg-orange-600 text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                Indoor
              </button>
              <button
                onClick={() => setFilters({ ...filters, outdoor: !filters.outdoor })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.outdoor ? "bg-orange-600 text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                Outdoor
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium">Calibro</label>
              <select
                value={filters.caliber}
                onChange={(e) => setFilters({ ...filters, caliber: e.target.value })}
                className="w-full mt-1 bg-slate-700 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none"
              >
                <option value="">Tutti i calibri</option>
                {allCalibers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-500">
            {loading ? "Caricamento…" : `${filtered.length} strutture trovate`}
          </p>
          {!loading && filtered.length > 0 && (
            <button
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
              className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              {viewMode === "list" ? (
                <>
                  <Map className="w-3.5 h-3.5" /> Mappa
                </>
              ) : (
                <>
                  <List className="w-3.5 h-3.5" /> Lista
                </>
              )}
            </button>
          )}
        </div>

        {!loading && viewMode === "map" && filtered.length > 0 && (
          <RangeMap ranges={filtered} onSelect={(r) => navigate(`/poligono/${r.id}`)} />
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {filtered.map((range) => (
              <button
                key={range.id}
                onClick={() => navigate(`/poligono/${range.id}`)}
                className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 text-left active:scale-[0.98] transition-transform"
              >
                {range.image_url && (
                  <div className="h-32 w-full overflow-hidden">
                    <Image
                      src={range.image_url}
                      alt={range.name}
                      className="w-full h-full object-cover"
                      fittingType="fill"
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">{range.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {range.comune}, {range.provincia}
                        </span>
                      </div>
                    </div>
                    <RangeTypeBadge type={range.type} />
                  </div>

                  {(range.calibers?.length || range.distances_m?.length) > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(range.calibers || []).slice(0, 3).map((c) => (
                        <span key={c} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                      {(range.distances_m || []).slice(0, 2).map((d) => (
                        <span key={d} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {d}m
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                    <span className="text-xs text-slate-400">
                      {range.status === "partner" ? (
                        <span className="text-green-600 font-medium">✓ Prenotabile</span>
                      ) : (
                        "Info disponibili"
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">Nessuna struttura trovata</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}