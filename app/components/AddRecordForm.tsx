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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
      >
        + Add Record
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4">Add a Record</h2>
            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
              <input type="hidden" name="type" value={defaultType} />
              <input type="hidden" name="owner" value={defaultOwner} />

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  name="title"
                  placeholder="e.g. Kind of Blue"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Artist <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  name="artist"
                  placeholder="e.g. Miles Davis"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-stone-700 block mb-1">
                    Genre
                  </label>
                  <input
                    name="genre"
                    placeholder="e.g. Jazz"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="w-28">
                  <label className="text-sm font-medium text-stone-700 block mb-1">
                    Year
                  </label>
                  <input
                    name="year"
                    placeholder="1959"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  placeholder="e.g. Original pressing, great condition"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-stone-200 font-medium hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
