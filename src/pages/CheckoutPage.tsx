import markup from '../page-markup/checkout.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function CheckoutPage() {
  return <MarkupPage markup={markup} />;
}
