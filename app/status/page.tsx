import EnvironmentStatus from './EnvironmentStatus';
import GithubPersonalStatus from './GithubPersonalStatus';
import GithubRepoStatus from './GithubRepoStatus';
import './style.scss';

export default function () {
  return (
    <div className="status-page p-4 mx-auto container">
      <h2>Checklist</h2>
      <EnvironmentStatus />
      <GithubPersonalStatus />
      <GithubRepoStatus />
    </div>
  );
}
