'use client';

import { useTransition } from 'react';
import type { VinylRecord } from '@/lib/db';
import { deleteRecordAction, moveToOwnedAction } from '@/app/actions';

export default function RecordCard({ record }: { record: VinylRecord }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={`bg-white rounded-xl border border-stone-200 p-4 flex flex-col gap-2 transition-opacity ${
        isPending ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold truncate">{record.title}</p>
          <p className="text-stone-500 text-sm truncate">{record.artist}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          {record.type === 'wishlist' && (
            <button
              title="Mark as owned"
              onClick={() => startTransition(() => moveToOwnedAction(record.id))}
              className="text-green-600 hover:bg-green-50 rounded-lg p-1.5 transition-colors text-sm font-bold"
            >
              ✓
            </button>
          )}
          <button
            title="Delete"
            onClick={() => {
              if (confirm(`Delete "${record.title}"?`)) {
                startTransition(() => deleteRecordAction(record.id));
              }
            }}
            className="text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {record.genre && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            {record.genre}
          </span>
        )}
        {record.year && (
          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
            {record.year}
          </span>
        )}
      </div>

      {record.notes && (
        <p className="text-sm text-stone-400 line-clamp-2">{record.notes}</p>
      )}
    </div>
  );
}
