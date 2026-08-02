import { listAllRangesForAdmin } from '@poligoni/db/queries/admin-ranges';
import { AdminListClient } from './AdminListClient';

export default async function AdminPage() {
  const rows = await listAllRangesForAdmin();
  return <AdminListClient rows={rows} />;
}
