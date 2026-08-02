import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findRangeByIdForAdmin, listRangeHoursForAdmin } from '@poligoni/db/queries/admin-ranges';
import { RangeForm } from '../RangeForm';
import { HoursForm } from './HoursForm';
import { updateRangeAction, updateRangeHoursAction } from '../actions';

export default async function EditRangePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const [range, hours] = await Promise.all([findRangeByIdForAdmin(id), listRangeHoursForAdmin(id)]);
  if (!range) notFound();

  const boundAction = updateRangeAction.bind(null, id);
  const boundHoursAction = updateRangeHoursAction.bind(null, id);

  return (
    <div>
      <Link href="/admin" className="text-sm font-bold uppercase tracking-wide text-accent hover:text-accent-hover">
        ← Tutte le strutture
      </Link>
      <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-ink">{range.name}</h1>
      <p className="mt-1 text-sm text-ink-muted">{range.comune} ({range.provincia})</p>

      <div className="mt-8">
        <RangeForm mode="edit" initial={range} action={boundAction} />
      </div>

      <div className="mt-12">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Orari di apertura</h2>
        <div className="mt-3">
          <HoursForm initial={hours} action={boundHoursAction} />
        </div>
      </div>
    </div>
  );
}
