'use client';

import { useState, useEffect, useTransition } from 'react';
import type { VinylRecord } from '@/lib/db';
import RecordCard from './RecordCard';
import { deleteRecordAction, moveToOwnedAction } from '@/app/actions';

type View = 'grid' | 'table';
type SortKey = 'title' | 'artist' | 'year' | 'genre' | 'priority';

const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
const PRIORITY_STYLES: Record<string, { color: string; background: string; label: string }> = {
  High:   { color: '#e05555', background: 'rgba(224,85,85,0.12)',   label: '▲ High'   },
  Medium: { color: '#c9a227', background: 'rgba(201,162,39,0.12)',  label: '● Medium' },
  Low:    { color: '#6b7280', background: 'rgba(107,114,128,0.12)', label: '▼ Low'    },
};

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
      {record.type === 'wishlist' && (
        <td style={{ padding: '0.65rem 0.75rem' }}>
          {(() => {
            const s = PRIORITY_STYLES[record.priority] ?? PRIORITY_STYLES.Medium;
            return (
              <span style={{
                background: s.background, color: s.color,
                fontFamily: 'var(--font-space-mono)', fontSize: '0.6rem',
                letterSpacing: '0.04em', fontWeight: 700,
                padding: '0.2rem 0.5rem', borderRadius: '2px', whiteSpace: 'nowrap',
              }}>
                {s.label}
              </span>
            );
          })()}
        </td>
      )}
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
  const [priorityFilter, setPriorityFilter] = useState('');
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

  const genres = [
    ...new Set(
      records.flatMap((r) =>
        r.genre
          ? r.genre.split(',').map((g) => g.trim()).filter(Boolean)
          : []
      )
    ),
  ].sort();

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q || r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q);
    const matchesGenre =
      !genreFilter ||
      r.genre.split(',').map((g) => g.trim()).includes(genreFilter);
    const matchesPriority = !priorityFilter || r.priority === priorityFilter;
    return matchesSearch && matchesGenre && matchesPriority;
  });

  const displayed =
    view === 'table'
      ? [...filtered].sort((a, b) => {
          if (sortBy === 'priority') {
            const diff =
              (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
            return sortDir === 'asc' ? diff : -diff;
          }
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
        {type === 'wishlist' && (
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 rounded-sm"
            style={{ ...inputStyle, minWidth: '8rem' }}
          >
            <option value="">ALL PRIORITY</option>
            <option value="High">▲ HIGH</option>
            <option value="Medium">● MEDIUM</option>
            <option value="Low">▼ LOW</option>
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
                    ...(type === 'wishlist'
                      ? [{ key: 'priority' as SortKey, label: 'Priority' }]
                      : []),
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
