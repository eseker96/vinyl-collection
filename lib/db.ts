import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export type VinylRecord = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: string;
  notes: string;
  type: 'owned' | 'wishlist';
  owner: string;
  created_at: string;
  cover_url: string;
};

export async function getRecords(type: 'owned' | 'wishlist'): Promise<VinylRecord[]> {
  const result = await client.execute({
    sql: 'SELECT * FROM records WHERE type = ? ORDER BY artist, title',
    args: [type],
  });
  return result.rows as unknown as VinylRecord[];
}

export async function getWishlistByOwner(owner: string): Promise<VinylRecord[]> {
  const result = await client.execute({
    sql: "SELECT * FROM records WHERE type = 'wishlist' AND owner = ? ORDER BY artist, title",
    args: [owner],
  });
  return result.rows as unknown as VinylRecord[];
}

export async function addRecord(data: Omit<VinylRecord, 'id' | 'created_at'>): Promise<void> {
  await client.execute({
    sql: 'INSERT INTO records (title, artist, genre, year, notes, type, owner) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [data.title, data.artist, data.genre, data.year, data.notes, data.type, data.owner],
  });
}

export async function deleteRecord(id: number): Promise<void> {
  await client.execute({ sql: 'DELETE FROM records WHERE id = ?', args: [id] });
}

export async function moveToOwned(id: number): Promise<void> {
  await client.execute({
    sql: "UPDATE records SET type = 'owned', owner = '' WHERE id = ?",
    args: [id],
  });
}
