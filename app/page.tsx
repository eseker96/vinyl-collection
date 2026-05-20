import { getRecords } from '@/lib/db';
import RecordGrid from './components/RecordGrid';
import AddRecordForm from './components/AddRecordForm';

export default async function CollectionPage() {
  const records = await getRecords('owned');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Collection</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {records.length} LP{records.length !== 1 ? 's' : ''}
          </p>
        </div>
        <AddRecordForm defaultType="owned" />
      </div>
      <RecordGrid records={records} type="owned" />
    </div>
  );
}
