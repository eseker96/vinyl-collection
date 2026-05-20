'use client';

import { useState } from 'react';
import type { VinylRecord } from '@/lib/db';
import RecordGrid from './RecordGrid';
import AddRecordForm from './AddRecordForm';

export default function WishlistTabs({
  eceRecords,
  renkeRecords,
}: {
  eceRecords: VinylRecord[];
  renkeRecords: VinylRecord[];
}) {
  const [tab, setTab] = useState<'Ece' | 'Renke'>('Ece');
  const records = tab === 'Ece' ? eceRecords : renkeRecords;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Wishlist</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {records.length} record{records.length !== 1 ? 's' : ''}
          </p>
        </div>
        <AddRecordForm defaultType="wishlist" defaultOwner={tab} />
      </div>

      <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-xl w-fit">
        {(['Ece', 'Renke'] as const).map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`px-5 py-1.5 rounded-lg font-medium text-sm transition-colors ${
              tab === name
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <RecordGrid records={records} type="wishlist" />
    </div>
  );
}
