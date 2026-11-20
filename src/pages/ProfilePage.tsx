import markup from '../page-markup/profile.html?raw';
import { MarkupPage } from '../components/common/MarkupPage';

export function ProfilePage() {
  return <MarkupPage markup={markup} />;
}
