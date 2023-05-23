import EnvironmentStatus from '@/app/admin/status/EnvironmentStatus';
import GithubPersonalStatus from '@/app/admin/status/GithubPersonalStatus';
import GithubRepoStatus from '@/app/admin/status/GithubRepoStatus';
import './style.scss';

export default function () {
  return (
    <div className="status-page">
      <h2>Checklist</h2>
      <EnvironmentStatus />
      <GithubPersonalStatus />
      <GithubRepoStatus />
    </div>
  );
}
