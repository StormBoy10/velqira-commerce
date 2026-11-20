import markup from '../page-markup/product.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function ProductPage() {
  return <MarkupPage markup={markup} />;
}
