import markup from '../page-markup/index.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function HomePage() {
  return <MarkupPage markup={markup} />;
}
