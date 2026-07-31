'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// Dashboard Gestore — Layout (Piano §7.3)
// Progettata per tablet e desktop, non per telefono.
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { href: '/gestore', label: 'Dashboard', icon: '📊' },
  { href: '/gestore/struttura', label: 'Scheda struttura', icon: '🏠' },
  { href: '/gestore/orari', label: 'Orari', icon: '🕐' },
  { href: '/gestore/listino', label: 'Listino e servizi', icon: '💰' },
  { href: '/gestore/chiusure', label: 'Chiusure e gare', icon: '🔒' },
  { href: '/gestore/richieste', label: 'Richieste', icon: '📨' },
  { href: '/gestore/premium', label: 'Piano Premium', icon: '⭐' },
];

export default function GestoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/gestore/login');
    router.refresh();
  };

    // Login e rivendicazione hanno layout minimal (no sidebar)
  const isMinimal = pathname === '/gestore/login' || pathname === '/gestore/rivendica';
  if (isMinimal) return <>{children}</>;

  return (
    <div className="gest-layout">
      {/* Sidebar */}
      <aside className={`gest-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="gest-sidebar-header">
          <Link href="/gestore" className="gest-logo">
            🎯 <span>Poligoni Italia</span>
          </Link>
          <button
            className="gest-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Chiudi menu"
          >
            ✕
          </button>
        </div>

        <nav className="gest-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`gest-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="gest-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="gest-sidebar-footer">
          <Link href="/" className="gest-nav-item">
            <span className="gest-nav-icon">🌐</span>
            <span>Vedi sito pubblico</span>
          </Link>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="gest-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="gest-main">
        <header className="gest-topbar">
          <button
            className="gest-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Apri menu"
          >
            ☰
          </button>
          <div className="gest-topbar-right">
            <span className="gest-range-name">TSN Milano</span>
            <button
              className="gest-avatar"
              onClick={handleLogout}
              title={userEmail ? `Esci (${userEmail})` : 'Esci'}
              aria-label="Esci"
            >
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'G'}
            </button>
          </div>
        </header>
        <div className="gest-content">{children}</div>
      </main>

      <style>{`
        .gest-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-gray-50);
        }

        /* Sidebar */
        .gest-sidebar {
          width: 260px;
          background: var(--color-gray-900);
          color: var(--color-gray-300);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 40;
          transition: transform 0.2s;
        }
        .gest-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-gray-700);
        }
        .gest-logo {
          font-weight: 700;
          font-size: 1rem;
          color: white;
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .gest-sidebar-close {
          display: none;
          background: none;
          border: none;
          color: var(--color-gray-400);
          font-size: 1.25rem;
        }
        .gest-nav {
          flex: 1;
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .gest-nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          color: var(--color-gray-300);
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .gest-nav-item:hover {
          background: var(--color-gray-700);
          color: white;
        }
        .gest-nav-item.active {
          background: var(--color-green-700);
          color: white;
        }
        .gest-nav-icon { font-size: 1.125rem; }
        .gest-sidebar-footer {
          padding: var(--space-4);
          border-top: 1px solid var(--color-gray-700);
        }

        /* Main */
        .gest-main {
          flex: 1;
          margin-left: 260px;
          min-height: 100vh;
        }
        .gest-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-8);
          background: white;
          border-bottom: 1px solid var(--color-gray-200);
          height: 64px;
        }
        .gest-hamburger {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--color-gray-600);
        }
        .gest-topbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .gest-range-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-gray-700);
        }
        .gest-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: var(--color-green-600);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.15s;
        }
        .gest-avatar:hover { background: var(--color-green-700); }
        .gest-content {
          padding: var(--space-8);
        }

        /* Overlay mobile */
        .gest-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 30;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .gest-sidebar {
            transform: translateX(-100%);
          }
          .gest-sidebar.open {
            transform: translateX(0);
          }
          .gest-sidebar-close { display: block; }
          .gest-hamburger { display: block; }
          .gest-main { margin-left: 0; }
          .gest-overlay { display: block; }
          .gest-overlay.hidden { display: none; }
        }
      `}</style>
    </div>
  );
}
