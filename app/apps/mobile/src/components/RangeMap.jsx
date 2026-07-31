import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, MapPin, Loader2 } from "lucide-react";
import { RangeTypeBadge } from "@/components/Badges";

// Fix default marker icons for Leaflet in Vite
const orangeIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="width:18px;height:18px;background:#ea580c;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
});

const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.25);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RangeMap({ ranges, onSelect, userPos }) {
  const mapRef = useRef(null);
  const [locating, setLocating] = useState(false);
  const [localUserPos, setLocalUserPos] = useState(userPos);

  // Compute map center from ranges or user position
  const center = useMemo(() => {
    if (localUserPos) return [localUserPos.lat, localUserPos.lng];
    const valid = ranges.filter((r) => r.lat && r.lng);
    if (valid.length === 0) return [45.4642, 9.19]; // Milano fallback
    const avgLat = valid.reduce((s, r) => s + r.lat, 0) / valid.length;
    const avgLng = valid.reduce((s, r) => s + r.lng, 0) / valid.length;
    return [avgLat, avgLng];
  }, [ranges, localUserPos]);

  // Ranges with coordinates and optional distance
  const mapped = useMemo(
    () =>
      ranges
        .filter((r) => r.lat && r.lng)
        .map((r) => ({
          ...r,
          distance_km: localUserPos
            ? haversine(localUserPos.lat, localUserPos.lng, r.lat, r.lng)
            : null,
        })),
    [ranges, localUserPos]
  );

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocalUserPos(newPos);
        setLocating(false);
        if (mapRef.current) {
          mapRef.current.setView([newPos.lat, newPos.lng], 11);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-260px)] min-h-[400px] rounded-2xl overflow-hidden border border-slate-200">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={10}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapped.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={orangeIcon}>
            <Popup>
              <div className="min-w-[160px]">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <strong className="text-sm text-slate-900">{r.name}</strong>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
                  <MapPin className="w-3 h-3" />
                  {r.comune}, {r.provincia}
                </div>
                {r.distance_km != null && (
                  <div className="text-xs text-orange-600 font-medium mb-1.5">
                    ~{r.distance_km.toFixed(1)} km da te
                  </div>
                )}
                <div className="mb-2">
                  <RangeTypeBadge type={r.type} />
                </div>
                <button
                  onClick={() => onSelect(r)}
                  className="w-full bg-orange-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Vedi dettagli
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {localUserPos && (
          <>
            <Marker position={[localUserPos.lat, localUserPos.lng]} icon={userIcon} />
            <Circle
              center={[localUserPos.lat, localUserPos.lng]}
              radius={20000}
              pathOptions={{ color: "#2563eb", fillOpacity: 0.05, weight: 1 }}
            />
          </>
        )}
      </MapContainer>

      <button
        onClick={handleLocate}
        disabled={locating}
        className="absolute top-3 right-3 z-[1000] bg-white shadow-md rounded-lg p-2.5 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
        title="Trova la mia posizione"
      >
        {locating ? (
          <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
        ) : (
          <Locate className={`w-5 h-5 ${localUserPos ? "text-blue-600" : "text-slate-700"}`} />
        )}
      </button>

      {mapped.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-[1000] pointer-events-none">
          <p className="text-sm text-slate-400">Nessuna struttura mappabile</p>
        </div>
      )}
    </div>
  );
}