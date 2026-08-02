import { listAllRangeManagersForAdmin, type AdminRangeManagerRow } from '@poligoni/db/queries/admin-users';
import { listAllRangesForAdmin } from '@poligoni/db/queries/admin-ranges';
import { createAdminClient } from '@/lib/supabase/admin';
import { addRangeManagerAction, removeRangeManagerAction } from '../actions';
import { AddManagerForm } from './AddManagerForm';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default async function AdminUsersPage() {
  const supabaseAdmin = createAdminClient();
  const [{ data: authData, error }, managerRows, ranges] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    listAllRangeManagersForAdmin(),
    listAllRangesForAdmin(),
  ]);

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-ink">Utenti</h1>
        <p className="mt-4 rounded-control border border-state-error bg-state-error-wash px-4 py-3 text-sm text-state-error">
          Non sono riuscito a leggere gli utenti da Supabase: {error.message}
        </p>
      </div>
    );
  }

  const managedByUser = new Map<string, AdminRangeManagerRow[]>();
  for (const m of managerRows) {
    const list = managedByUser.get(m.userId) ?? [];
    list.push(m);
    managedByUser.set(m.userId, list);
  }

  const users = authData.users
    .map((u) => ({
      id: u.id,
      email: u.email ?? null,
      displayName: (u.user_metadata?.full_name ?? u.user_metadata?.name ?? null) as string | null,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      managedRanges: managedByUser.get(u.id) ?? [],
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-tight text-ink">Utenti</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {users.length} utenti registrati. Assegna o rimuovi l&apos;autorizzazione a gestire una struttura.
      </p>

      <div className="mt-8 flex flex-col divide-y divide-hairline border-t border-hairline">
        {users.map((u) => (
          <div key={u.id} className="flex flex-col gap-3 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div>
                <span className="font-bold text-ink">{u.email ?? '(email non impostata)'}</span>
                {u.displayName && <span className="ml-2 text-sm text-ink-muted">{u.displayName}</span>}
              </div>
              <span className="text-xs text-ink-faint">
                Registrato il {formatDate(u.createdAt)} · ultimo accesso {formatDate(u.lastSignInAt)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {u.managedRanges.length === 0 && (
                <span className="text-xs text-ink-faint">Nessuna struttura gestita</span>
              )}
              {u.managedRanges.map((m) => (
                <span
                  key={m.rangeId}
                  className="flex items-center gap-1.5 rounded-control border border-hairline-strong bg-surface-sunken px-2.5 py-1 text-xs text-ink"
                >
                  {m.rangeName}
                  <span className="text-ink-faint">({m.role})</span>
                  <form action={removeRangeManagerAction}>
                    <input type="hidden" name="rangeId" value={m.rangeId} />
                    <input type="hidden" name="userId" value={u.id} />
                    <button
                      type="submit"
                      aria-label={`Rimuovi ${u.email} da ${m.rangeName}`}
                      className="text-ink-faint hover:text-state-error"
                    >
                      ✕
                    </button>
                  </form>
                </span>
              ))}
            </div>

            <AddManagerForm userId={u.id} ranges={ranges} action={addRangeManagerAction} />
          </div>
        ))}
      </div>
    </div>
  );
}
