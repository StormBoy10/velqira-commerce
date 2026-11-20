import markup from '../page-markup/wishlist.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function WishlistPage() {
  return <MarkupPage markup={markup} />;
}
