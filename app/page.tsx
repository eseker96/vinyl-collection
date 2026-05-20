import { getRecords } from '@/lib/db';
import RecordGrid from './components/RecordGrid';
import AddRecordForm from './components/AddRecordForm';

export default async function CollectionPage() {
  const records = await getRecords('owned');

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-1"
            style={{ color: 'var(--ember)', fontFamily: 'var(--font-space-mono)' }}
          >
            ▸ Side A
          </p>
          <h1
            className="text-3xl font-bold italic leading-none"
            style={{ color: 'var(--paper)', fontFamily: 'var(--font-playfair)' }}
          >
            My Collection
          </h1>
          <p
            className="text-xs tracking-widest uppercase mt-2"
            style={{ color: 'var(--paper-dim)', fontFamily: 'var(--font-space-mono)' }}
          >
            {records.length} LP{records.length !== 1 ? 's' : ''}
          </p>
        </div>
        <AddRecordForm defaultType="owned" />
      </div>
      <RecordGrid records={records} type="owned" />
    </div>
  );
}
