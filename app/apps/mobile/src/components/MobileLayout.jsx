import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Search, Calendar, Crosshair, Boxes, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", icon: Search, label: "Cerca" },
  { to: "/prenotazioni", icon: Calendar, label: "Prenotazioni" },
  { to: "/diario", icon: Crosshair, label: "Diario" },
  { to: "/munizioni", icon: Boxes, label: "Munizioni" },
  { to: "/profilo", icon: User, label: "Profilo" },
];

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 pb-20 max-w-md w-full mx-auto">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 max-w-md mx-auto">
        <div className="flex items-center justify-around h-16">
          {TABS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                  isActive ? "text-orange-600" : "text-slate-400 hover:text-slate-600"
                )
              }
            >
              <Icon className="w-5 h-5" strokeWidth={2.2} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}