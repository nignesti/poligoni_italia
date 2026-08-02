import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { LogoutButton } from './LogoutButton';

/**
 * Area privata, non linkata da nessuna nav pubblica. Il middleware
 * (lib/supabase/middleware.ts) già reindirizza chi non è autenticato o non è
 * in ADMIN_EMAILS prima ancora che questo layout venga eseguito — questo
 * controllo è una seconda barriera, non l'unica.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser();
  if (!admin) redirect('/');

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-hairline bg-surface-sunken">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold uppercase tracking-tight text-ink">
              Admin <span className="text-accent">Poligoni Italia</span>
            </Link>
            <Link href="/admin/utenti" className="text-sm font-bold uppercase tracking-wide text-ink-muted hover:text-ink">
              Utenti
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink-muted">
            <span>{admin.email}</span>
            <Link href="/" className="hover:text-ink">
              Vedi sito pubblico
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}
