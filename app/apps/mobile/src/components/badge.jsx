import React from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/domain";

export function AmmoLevelBadge({ level }) {
  const styles = {
    ok: "bg-green-100 text-green-700",
    attenzione: "bg-yellow-100 text-yellow-700",
    limite: "bg-orange-100 text-orange-700",
    oltre: "bg-red-100 text-red-700",
  };
  const labels = {
    ok: "Nei limiti",
    attenzione: "Attenzione",
    limite: "Al limite",
    oltre: "Oltre limite",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", styles[level])}>
      {labels[level]}
    </span>
  );
}

export function RangeTypeBadge({ type }) {
  const labels = {
    tsn: "TSN",
    privato: "Privato",
    tiro_a_volo: "Tiro a Volo",
    dinamico: "Dinamico",
    long_range: "Long Range",
  };
  const styles = {
    tsn: "bg-blue-100 text-blue-700",
    privato: "bg-purple-100 text-purple-700",
    tiro_a_volo: "bg-teal-100 text-teal-700",
    dinamico: "bg-orange-100 text-orange-700",
    long_range: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold", styles[type])}>
      {labels[type] || type}
    </span>
  );
}

export function StatusBadge({ status }) {
  const labels = {
    richiesta: "Richiesta",
    confermata: "Confermata",
    annullata: "Annullata",
    completata: "Completata",
    no_show: "No-show",
  };
  const styles = {
    richiesta: "bg-yellow-100 text-yellow-700",
    confermata: "bg-green-100 text-green-700",
    annullata: "bg-red-100 text-red-700",
    completata: "bg-slate-200 text-slate-600",
    no_show: "bg-red-100 text-red-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold", styles[status])}>
      {labels[status] || status}
    </span>
  );
}

export function ProgressBar({ value, max, level }) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const colors = {
    ok: "bg-green-500",
    attenzione: "bg-yellow-500",
    limite: "bg-orange-500",
    oltre: "bg-red-500",
  };
  return (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all", colors[level] || colors.ok)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function CategoryIcon({ category }) {
  return (
    <span className="text-2xl">
      {category === "polvere" ? "⚗️" : "🔫"}
    </span>
  );
}