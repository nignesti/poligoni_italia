import { getManagedRange } from '@/lib/gestore-auth';
import { GestoreShell } from './GestoreShell';

export default async function GestoreLayout({ children }: { children: React.ReactNode }) {
  const range = await getManagedRange();
  return <GestoreShell rangeName={range?.name ?? null}>{children}</GestoreShell>;
}
