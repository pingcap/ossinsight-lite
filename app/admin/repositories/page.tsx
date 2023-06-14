import { getTrackingRepos } from '@/actions/pipeline';
import { NewTrackingRepoForm } from '@/components/pages/admin/repositories/forms';
import RepositoriesList from '@/components/pages/admin/repositories/RepositoriesList';

export default async function Page () {
  const repos = await getTrackingRepos();

  return (
    <div className='max-w-screen-lg'>
      <h2>Watching repos</h2>
      <NewTrackingRepoForm selectedNames={repos.map(i => i.full_name)} />
      <RepositoriesList repositories={repos} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
