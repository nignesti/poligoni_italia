/**
 * Guard condiviso per /admin: usato sia dal layout (redirect) sia da ogni
 * Server Action di scrittura (throw) — il middleware da solo non basta come
 * unica barriera, va ripetuto a ogni punto che tocca il DB (vedi nota in
 * lib/supabase/middleware.ts).
 */
import { createClient } from '@/lib/supabase/server';

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export interface AdminUser {
  id: string;
  email: string;
}

/** null se non autenticato o non in whitelist. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = (user?.email ?? '').toLowerCase();
  if (!user || !email || !adminEmails().includes(email)) return null;
  return { id: user.id, email };
}

/** Da chiamare a inizio di ogni Server Action che scrive su /admin. */
export async function requireAdminUser(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) throw new Error('Non autorizzato.');
  return admin;
}
