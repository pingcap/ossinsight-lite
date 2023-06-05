'use client';

import { Alert } from '@/components/Alert';

export default function ({ error }: any) {
  return <Alert type="error" title={String(error?.type)} message={String(error?.message ?? error)} />;
}