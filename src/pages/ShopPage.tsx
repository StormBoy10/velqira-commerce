import markup from '../page-markup/shop.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function ShopPage() {
  return <MarkupPage markup={markup} />;
}
