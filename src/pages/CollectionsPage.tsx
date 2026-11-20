import markup from '../page-markup/collections.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function CollectionsPage() {
  return <MarkupPage markup={markup} />;
}
