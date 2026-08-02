import { getManagedRange, listManagedRanges } from '@/lib/gestore-auth';
import { switchManagedRangeAction } from './gestore/actions';
import { GestoreShell } from './GestoreShell';

export default async function GestoreLayout({ children }: { children: React.ReactNode }) {
  const [range, managedRanges] = await Promise.all([getManagedRange(), listManagedRanges()]);
  return (
    <GestoreShell
      rangeName={range?.name ?? null}
      activeRangeId={range?.id ?? null}
      managedRanges={managedRanges}
      switchRangeAction={switchManagedRangeAction}
    >
      {children}
    </GestoreShell>
  );
}
