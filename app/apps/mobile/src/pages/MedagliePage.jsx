import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listSessions, listSessionShots } from "@/api/sessionsApi";
import { ArrowLeft, Loader2, Award, Target, Flame, Calendar, Layers, Lock } from "lucide-react";
import { evaluateBadges } from "@/lib/domain";

const ICONS = { target: Target, flame: Flame, calendar: Calendar, layers: Layers };

export default function MedagliePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [sessions, shots] = await Promise.all([listSessions(), listSessionShots()]);
        const totalRounds = shots.reduce((sum, s) => sum + (s.rounds_fired || 0), 0);
        const distinctCalibers = new Set(shots.map((s) => s.caliber).filter(Boolean)).size;
        setBadges(evaluateBadges({ totalRounds, sessionCount: sessions.length, distinctCalibers }));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-slate-900 dark:text-white text-sm">Medaglie</h1>
      </div>

      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 mb-4 text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Sbloccate</p>
            <p className="text-3xl font-bold">
              {unlockedCount}
              <span className="text-base text-slate-400 dark:text-slate-500 font-normal"> / {badges.length}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => {
            const Icon = ICONS[b.icon] || Award;
            return (
              <div
                key={b.id}
                className={`rounded-2xl p-4 border ${
                  b.unlocked ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm" : "bg-slate-100 dark:bg-slate-800 border-slate-100 dark:border-slate-800"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    b.unlocked ? "bg-orange-100 dark:bg-orange-900" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  {b.unlocked ? (
                    <Icon className="w-5 h-5 text-orange-600" strokeWidth={2.2} />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  )}
                </div>
                <p className={`text-sm font-semibold ${b.unlocked ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{b.label}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">{b.description}</p>
                {!b.unlocked && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${b.progress}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      {b.value} / {b.threshold}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
