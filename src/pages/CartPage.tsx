import markup from '../page-markup/cart.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function CartPage() {
  return <MarkupPage markup={markup} />;
}
