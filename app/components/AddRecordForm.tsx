'use client';

import { useState, useRef, useTransition } from 'react';
import { addRecordAction } from '@/app/actions';

export default function AddRecordForm({
  defaultType,
  defaultOwner = '',
}: {
  defaultType: 'owned' | 'wishlist';
  defaultOwner?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addRecordAction(formData);
      setOpen(false);
      formRef.current?.reset();
    });
  }

  const inputClass = 'w-full px-3 py-2 rounded-sm text-sm';
  const inputStyle = {
    background: 'var(--sleeve-input)',
    border: '1px solid var(--groove-hi)',
    color: 'var(--paper)',
    outline: 'none',
  };
  const labelStyle = {
    color: 'var(--paper-dim)',
    fontFamily: 'var(--font-space-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 transition-opacity hover:opacity-85"
        style={{
          background: 'var(--ember)',
          color: '#fff',
          fontFamily: 'var(--font-space-mono)',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          padding: '0.55rem 1.25rem',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 10px rgba(0,0,0,0.4)',
        }}
      >
        ◈ Add Record
      </button>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-md p-6 rounded-sm shadow-2xl"
            style={{ background: 'var(--sleeve-hi)', border: '1px solid var(--groove)' }}
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-1"
              style={{ color: 'var(--ember)', fontFamily: 'var(--font-space-mono)' }}
            >
              ▸ New Entry
            </p>
            <h2
              className="text-xl font-bold italic mb-5"
              style={{ color: 'var(--paper)', fontFamily: 'var(--font-playfair)' }}
            >
              Add a Record
            </h2>

            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
              <input type="hidden" name="type" value={defaultType} />
              <input type="hidden" name="owner" value={defaultOwner} />

              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Title <span style={{ color: 'var(--ember)' }}>*</span>
                </label>
                <input
                  required
                  name="title"
                  placeholder="e.g. Kind of Blue"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Artist <span style={{ color: 'var(--ember)' }}>*</span>
                </label>
                <input
                  required
                  name="artist"
                  placeholder="e.g. Miles Davis"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block mb-1.5" style={labelStyle}>
                    Genre
                  </label>
                  <input
                    name="genre"
                    placeholder="e.g. Jazz"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="w-28">
                  <label className="block mb-1.5" style={labelStyle}>
                    Year
                  </label>
                  <input
                    name="year"
                    placeholder="1959"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5" style={labelStyle}>
                  Notes
                </label>
                <textarea
                  name="notes"
                  placeholder="e.g. Original pressing, great condition"
                  rows={2}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-sm text-sm transition-opacity hover:opacity-75"
                  style={{
                    border: '1px solid var(--groove-hi)',
                    color: 'var(--paper-dim)',
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 rounded-full transition-opacity hover:opacity-85 disabled:opacity-40"
                  style={{
                    background: 'var(--ember)',
                    color: '#fff',
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {isPending ? '◈ Adding...' : '◈ Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
