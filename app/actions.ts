'use server';

import { addRecord, deleteRecord, moveToOwned } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addRecordAction(formData: FormData) {
  const type = formData.get('type') as 'owned' | 'wishlist';
  await addRecord({
    title: (formData.get('title') as string).trim(),
    artist: (formData.get('artist') as string).trim(),
    genre: ((formData.get('genre') as string) || '').trim(),
    year: ((formData.get('year') as string) || '').trim(),
    notes: ((formData.get('notes') as string) || '').trim(),
    type,
    owner: ((formData.get('owner') as string) || '').trim(),
  });
  revalidatePath('/');
  revalidatePath('/wishlist');
}

export async function deleteRecordAction(id: number) {
  await deleteRecord(id);
  revalidatePath('/');
  revalidatePath('/wishlist');
}

export async function moveToOwnedAction(id: number) {
  await moveToOwned(id);
  revalidatePath('/');
  revalidatePath('/wishlist');
}
