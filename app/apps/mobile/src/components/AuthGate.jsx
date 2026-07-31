import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

/** Ricerca e scheda struttura restano pubbliche; solo le sezioni con dati
 * personali (Prenotazioni, Diario, Munizioni, Profilo) richiedono accesso. */
export default function AuthGate() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/accedi" state={{ next: location.pathname }} replace />;
  }

  return <Outlet />;
}
