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
      !q || r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q);
    const matchesGenre = !genreFilter || r.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const emptyMessage =
    records.length === 0
      ? type === 'owned'
        ? 'No records yet. Add your first LP!'
        : 'Your wishlist is empty.'
      : 'No records match your search.';

  const inputStyle = {
    background: 'var(--sleeve-input)',
    border: '1px solid var(--groove)',
    color: 'var(--paper)',
    fontFamily: 'var(--font-space-mono)',
    fontSize: '0.75rem',
    letterSpacing: '0.02em',
    outline: 'none',
  };

  return (
    <div>
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="SEARCH TITLE OR ARTIST..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-sm"
          style={inputStyle}
        />
        {genres.length > 0 && (
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-4 py-2.5 rounded-sm"
            style={{ ...inputStyle, minWidth: '9rem' }}
          >
            <option value="">ALL GENRES</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g.toUpperCase()}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <p
          className="text-center py-20 tracking-widest uppercase text-xs"
          style={{ color: 'var(--paper-muted)', fontFamily: 'var(--font-space-mono)' }}
        >
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}

      {records.length > 0 && (
        <p
          className="text-center mt-8 tracking-widest uppercase text-xs"
          style={{ color: 'var(--paper-muted)', fontFamily: 'var(--font-space-mono)' }}
        >
          {filtered.length} / {records.length} records
        </p>
      )}
    </div>
  );
}
