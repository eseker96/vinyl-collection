'use client';

import { useTransition } from 'react';
import type { VinylRecord } from '@/lib/db';
import { deleteRecordAction, moveToOwnedAction } from '@/app/actions';

const PRIORITY_STYLES = {
  High:   { color: '#e05555', background: 'rgba(224,85,85,0.12)',   label: '▲ High'   },
  Medium: { color: '#c9a227', background: 'rgba(201,162,39,0.12)',  label: '● Medium' },
  Low:    { color: '#6b7280', background: 'rgba(107,114,128,0.12)', label: '▼ Low'    },
};

function VinylArt() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      <rect width="200" height="200" fill="#100d09" />
      <circle cx="102" cy="102" r="86" fill="rgba(0,0,0,0.5)" />
      <circle cx="100" cy="100" r="86" fill="#0c0a07" />
      {[79, 71, 63, 55, 47, 39].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#1c1914" strokeWidth="1.5" />
      ))}
      <ellipse cx="68" cy="68" rx="22" ry="13" fill="white" opacity="0.025" transform="rotate(-35,68,68)" />
      <circle cx="100" cy="100" r="30" fill="#7a2e06" />
      <circle cx="100" cy="100" r="25" fill="#c85c15" />
      <rect x="79" y="93" width="42" height="2.5" rx="1" fill="rgba(0,0,0,0.28)" />
      <rect x="83" y="99" width="34" height="1.5" rx="1" fill="rgba(0,0,0,0.2)" />
      <rect x="79" y="105" width="42" height="2.5" rx="1" fill="rgba(0,0,0,0.28)" />
      <circle cx="100" cy="100" r="5" fill="#0c0a07" />
    </svg>
  );
}

export default function RecordCard({ record }: { record: VinylRecord }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={`flex flex-col rounded-sm overflow-hidden transition-opacity ${isPending ? 'opacity-40' : ''}`}
      style={{
        background: 'var(--sleeve)',
        border: '1px solid var(--groove)',
        boxShadow: '2px 4px 20px rgba(0,0,0,0.55)',
      }}
    >
      <div className="aspect-square w-full relative overflow-hidden">
        {record.cover_url ? (
          <img
            src={record.cover_url}
            alt={`${record.title} by ${record.artist}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
        ) : null}
        <div style={{ display: record.cover_url ? 'none' : 'block' }} className="w-full h-full">
          <VinylArt />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--groove)' }}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className="font-bold text-sm leading-snug line-clamp-2"
              style={{ color: 'var(--paper)', fontFamily: 'var(--font-playfair)' }}
            >
              {record.title}
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--paper-dim)' }}>
              {record.artist}
            </p>
          </div>

          <div className="flex gap-1 shrink-0 mt-0.5">
            {record.type === 'wishlist' && (
              <button
                title="Mark as owned"
                onClick={() => startTransition(() => moveToOwnedAction(record.id))}
                className="text-xs px-1.5 py-0.5 rounded transition-opacity hover:opacity-80"
                style={{ color: '#6aaa55', background: 'rgba(106,170,85,0.12)' }}
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
              className="text-xs px-1.5 py-0.5 rounded transition-opacity hover:opacity-80"
              style={{ color: 'var(--paper-muted)' }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {record.type === 'wishlist' && record.priority && (() => {
            const s = PRIORITY_STYLES[record.priority] ?? PRIORITY_STYLES.Medium;
            return (
              <span
                className="px-2 py-0.5 rounded-sm"
                style={{
                  background: s.background,
                  color: s.color,
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.04em',
                  fontWeight: 700,
                }}
              >
                {s.label}
              </span>
            );
          })()}
          {record.genre && (
            <span
              className="px-2 py-0.5 rounded-sm"
              style={{
                background: 'rgba(212,101,26,0.14)',
                color: 'var(--ember)',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.04em',
              }}
            >
              {record.genre}
            </span>
          )}
          {record.year && (
            <span
              className="px-2 py-0.5 rounded-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--paper-dim)',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.04em',
              }}
            >
              {record.year}
            </span>
          )}
        </div>

        {record.notes && (
          <p className="text-xs line-clamp-2" style={{ color: 'var(--paper-muted)' }}>
            {record.notes}
          </p>
        )}
      </div>
    </div>
  );
}
