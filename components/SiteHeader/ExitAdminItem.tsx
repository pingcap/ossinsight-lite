import XIcon from 'bootstrap-icons/icons/x.svg';
import Link from 'next/link';

export default function ExitAdminItem () {
  return (
    <Link className="site-header-item" href="/" prefetch={false}>
      Exit admin
      <XIcon />
    </Link>
  );
}