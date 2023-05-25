import { getTrackingRepos } from '@/app/admin/repositories/op';
import { DeleteActionButton, NewTrackingRepoForm } from '@/app/admin/repositories/actions-ui';
import { authenticateGuard } from '@/src/auth';

export default async function Page () {
  await authenticateGuard('/admin/repositories');
  const repos = await getTrackingRepos();

  return (
    <div>
      <table className="data-table table-auto">
        <thead>
        <tr>
          <th>ID</th>
          <td>Repository Full Name</td>
          <td></td>
        </tr>
        </thead>
        <tbody>
        {repos.map((row) => (
          <tr key={row.id}>
            <th>{row.id}</th>
            <td>{row.full_name}</td>
            <td>
              <DeleteActionButton repoName={row.full_name} />
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <NewTrackingRepoForm />
    </div>
  );
}

export const dynamic = 'force-dynamic';
