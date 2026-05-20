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
      <div className="flex items-end justify-between mb-8">
        <div>
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-1"
            style={{ color: 'var(--ember)', fontFamily: 'var(--font-space-mono)' }}
          >
            ▸ Side B
          </p>
          <h1
            className="text-3xl font-bold italic leading-none"
            style={{ color: 'var(--paper)', fontFamily: 'var(--font-playfair)' }}
          >
            Wishlist
          </h1>
          <p
            className="text-xs tracking-widest uppercase mt-2"
            style={{ color: 'var(--paper-dim)', fontFamily: 'var(--font-space-mono)' }}
          >
            {records.length} record{records.length !== 1 ? 's' : ''}
          </p>
        </div>
        <AddRecordForm defaultType="wishlist" defaultOwner={tab} />
      </div>

      {/* Tabs */}
      <div className="flex gap-px mb-8" style={{ borderBottom: '1px solid var(--groove)' }}>
        {(['Ece', 'Renke'] as const).map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className="px-6 py-2 text-xs tracking-[0.2em] uppercase transition-colors"
            style={{
              fontFamily: 'var(--font-space-mono)',
              color: tab === name ? 'var(--ember)' : 'var(--paper-muted)',
              borderBottom: tab === name ? '2px solid var(--ember)' : '2px solid transparent',
              marginBottom: '-1px',
              background: 'transparent',
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <RecordGrid records={records} type="wishlist" />
    </div>
  );
}
