import markup from '../page-markup/loading.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function LoadingPage() {
  return <MarkupPage markup={markup} />;
}
