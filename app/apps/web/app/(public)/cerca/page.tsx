import { listRangeSummaries } from '@/lib/ranges';
import { SearchClient } from './SearchClient';

export default async function SearchPage() {
  const ranges = await listRangeSummaries();
  return <SearchClient ranges={ranges} />;
}
