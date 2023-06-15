'use client';

import { DeleteActionButton } from '@/components/pages/admin/repositories/forms';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import './styles.scss';

export default function RepositoriesList ({ repositories }: { repositories: { id: string, full_name: string }[] }) {
  const [deleting, setDeleting] = useState(() => new Set<string>());

  useEffect(() => {
    repositories.forEach(repo => {
      deleting.delete(repo.full_name);
      setDeleting(new Set([...deleting]));
    });
  }, [repositories]);

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary mt-4">
      {repositories.map(repo => (
        <li key={repo.full_name} className={clsx('flex items-center justify-between rounded-md bg-white p-4', { 'opacity-50 pointer-events-none': deleting.has(repo.full_name) })}>
          <span className="flex items-center gap-2">
            <img className="w-8 h-8 rounded-full" src={`https://github.com/${repo.full_name.split('/')[0]}.png`} alt={repo.full_name} />
            <span>
              {repo.full_name}
            </span>
          </span>

          <DeleteActionButton
            repoName={repo.full_name}
            onClick={() => setDeleting(deleting => new Set([...deleting, repo.full_name]))}
          />
        </li>
      ))}
    </ul>
  );
}