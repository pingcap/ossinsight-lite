# Environment Variables

## GitHub

| Name                       | Required | Description                                                                                  |
|----------------------------|----------|----------------------------------------------------------------------------------------------|
| `DATABASE_URL`             | YES      | Used to connect to TiDB Cluster and manage collected data.                                   |
| `USER_LOGIN`               | NO       | Determine which user to collect. Default to the repository owner.                            |
| `ACCESS_TOKEN`             | NO       | GitHub personal token, set an authorized token if you want to fetch private repo activities. |
| `GITHUB_PERSONAL_DATABASE` | NO       | The database name for personal data. Default to `github_personal`.                           |
| `GITHUB_REPO_DATABASE`     | NO       | The database name for tracking repos. Default to `github_repos`                              |
| `SYNC_GITHUB_TOKEN`        | NO       | See [Syncing workflows updates](../../README.md#syncing-workflows-updates)                   |

## Vercel

| Name                       | Required | Description                                                                             |
|----------------------------|----------|-----------------------------------------------------------------------------------------|
| `JWT_MAX_AGE`              | NO       | Max age (seconds) of your login credential. Defaults to 1800.                           |
| `SITE_INITIAL_PASSWORD`    | NO       | Your site initial password, only works for the first deployment. Default to `tidbcloud` |
| `GITHUB_PERSONAL_DATABASE` | NO       | Must be same with github secret `GITHUB_PERSONAL_DATABASE`                              |
| `GITHUB_REPO_DATABASE`     | NO       | Must be same with github secret `GITHUB_REPO_DATABASE`                                  |

