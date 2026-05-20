'use client';

import { useState, useEffect, useTransition } from 'react';
import type { VinylRecord } from '@/lib/db';
import RecordCard from './RecordCard';
import { deleteRecordAction, moveToOwnedAction } from '@/app/actions';

type View = 'grid' | 'table';
type SortKey = 'title' | 'artist' | 'year' | 'genre';

function TableRow({ record }: { record: VinylRecord }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr
      style={{
        opacity: isPending ? 0.4 : 1,
        borderBottom: '1px solid var(--groove)',
        transition: 'opacity 0.15s',
      }}
    >
      <td
        style={{
          padding: '0.65rem 0.75rem',
          color: 'var(--paper)',
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: '1.3',
        }}
      >
        {record.title}
      </td>
      <td
        style={{
          padding: '0.65rem 0.75rem',
          color: 'var(--paper-dim)',
          fontSize: '0.8rem',
        }}
      >
        {record.artist}
      </td>
      <td
        style={{
          padding: '0.65rem 0.75rem',
          color: 'var(--paper-dim)',
          fontFamily: 'var(--font-space-mono)',
          fontSize: '0.7rem',
          whiteSpace: 'nowrap',
        }}
      >
        {record.year || '—'}
      </td>
      <td style={{ padding: '0.65rem 0.75rem' }}>
        {record.genre && (
          <span
            style={{
              background: 'rgba(212,101,26,0.14)',
              color: 'var(--ember)',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.04em',
              padding: '0.2rem 0.5rem',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            {record.genre}
          </span>
        )}
      </td>
      <td style={{ padding: '0.65rem 0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
          {record.type === 'wishlist' && (
            <button
              title="Mark as owned"
              onClick={() => startTransition(() => moveToOwnedAction(record.id))}
              className="transition-opacity hover:opacity-80"
              style={{
                color: '#6aaa55',
                background: 'rgba(106,170,85,0.12)',
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '3px',
              }}
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
            className="transition-opacity hover:opacity-80"
            style={{
              color: 'var(--paper-muted)',
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '3px',
            }}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function RecordGrid({
  records,
  type,
}: {
  records: VinylRecord[];
  type: 'owned' | 'wishlist';
}) {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [view, setView] = useState<View>('grid');
  const [sortBy, setSortBy] = useState<SortKey>('artist');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const saved = localStorage.getItem('vinyl-view') as View | null;
    if (saved === 'grid' || saved === 'table') setView(saved);
  }, []);

  function switchView(v: View) {
    setView(v);
    localStorage.setItem('vinyl-view', v);
  }

  function handleSort(col: SortKey) {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  }

  const genres = [...new Set(records.map((r) => r.genre).filter(Boolean))].sort();

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q || r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q);
    const matchesGenre = !genreFilter || r.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const displayed =
    view === 'table'
      ? [...filtered].sort((a, b) => {
          const av = (a[sortBy] ?? '').toLowerCase();
          const bv = (b[sortBy] ?? '').toLowerCase();
          return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        })
      : filtered;

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

  const viewBtnStyle = (active: boolean) => ({
    fontFamily: 'var(--font-space-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    padding: '0.45rem 0.75rem',
    borderRadius: '3px',
    border: '1px solid var(--groove-hi)',
    color: active ? 'var(--ember)' : 'var(--paper-muted)',
    background: active ? 'rgba(212,101,26,0.1)' : 'transparent',
    transition: 'color 0.15s, background 0.15s',
  });

  const thStyle = (col: SortKey) => ({
    padding: '0.6rem 0.75rem',
    textAlign: 'left' as const,
    fontFamily: 'var(--font-space-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: sortBy === col ? 'var(--ember)' : 'var(--paper-dim)',
    cursor: 'pointer',
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    borderBottom: '1px solid var(--groove-hi)',
  });

  return (
    <div>
      <div className="flex gap-3 mb-8 items-center">
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
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => switchView('grid')}
            title="Card view"
            style={viewBtnStyle(view === 'grid')}
          >
            ▦ GRID
          </button>
          <button
            onClick={() => switchView('table')}
            title="Table view"
            style={viewBtnStyle(view === 'table')}
          >
            ☰ LIST
          </button>
        </div>
      </div>

      {displayed.length === 0 ? (
        <p
          className="text-center py-20 tracking-widest uppercase text-xs"
          style={{ color: 'var(--paper-muted)', fontFamily: 'var(--font-space-mono)' }}
        >
          {emptyMessage}
        </p>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div
          style={{
            border: '1px solid var(--groove)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--sleeve-hi)' }}>
                {(
                  [
                    { key: 'title', label: 'Title' },
                    { key: 'artist', label: 'Artist' },
                    { key: 'year', label: 'Year' },
                    { key: 'genre', label: 'Genre' },
                  ] as { key: SortKey; label: string }[]
                ).map(({ key, label }) => (
                  <th key={key} style={thStyle(key)} onClick={() => handleSort(key)}>
                    {label}
                    {sortBy === key && (
                      <span style={{ marginLeft: '0.3rem' }}>
                        {sortDir === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                ))}
                <th
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderBottom: '1px solid var(--groove-hi)',
                    width: '4rem',
                  }}
                />
              </tr>
            </thead>
            <tbody>
              {displayed.map((record) => (
                <TableRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
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
