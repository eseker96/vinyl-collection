'use client';

import { useState } from 'react';
import type { VinylRecord } from '@/lib/db';
import RecordCard from './RecordCard';

export default function RecordGrid({
  records,
  type,
}: {
  records: VinylRecord[];
  type: 'owned' | 'wishlist';
}) {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  const genres = [...new Set(records.map((r) => r.genre).filter(Boolean))].sort();

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.artist.toLowerCase().includes(q);
    const matchesGenre = !genreFilter || r.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const emptyMessage =
    records.length === 0
      ? type === 'owned'
        ? 'No records yet. Add your first LP!'
        : 'Your wishlist is empty.'
      : 'No records match your search.';

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title or artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        />
        {genres.length > 0 && (
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone-400 text-center py-20">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}

      {records.length > 0 && (
        <p className="text-stone-400 text-sm mt-6 text-center">
          {filtered.length} of {records.length} record{records.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
