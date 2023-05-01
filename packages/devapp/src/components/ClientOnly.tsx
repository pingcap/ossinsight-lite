import { useEffect, useState } from 'react';

export default function ClientOnly ({ children }: { children: () => JSX.Element }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted) {
    return <>{children()}</>;
  } else {
    return <></>;
  }
}