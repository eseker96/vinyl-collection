import { getWishlistByOwner } from '@/lib/db';
import WishlistTabs from '../components/WishlistTabs';

export default async function WishlistPage() {
  const [eceRecords, renkeRecords] = await Promise.all([
    getWishlistByOwner('Ece'),
    getWishlistByOwner('Renke'),
  ]);

  return <WishlistTabs eceRecords={eceRecords} renkeRecords={renkeRecords} />;
}
