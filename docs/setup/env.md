# Environment Variables

## GitHub

| Name                       | Required | Description                                                                                  |
|----------------------------|----------|----------------------------------------------------------------------------------------------|
| `DATABASE_URL`             | YES      | Used to connect to TiDB Cluster and manage collected data.                                   |
| `USER_LOGIN`               | NO       | Determine which user to collect. Default to the repository owner.                            |
| `ACCESS_TOKEN`             | NO       | GitHub personal token, set an authorized token if you want to fetch private repo activities. |
| `GITHUB_PERSONAL_DATABASE` | NO       | The database name for personal data. Default to `github_personal`.                           |
| `GITHUB_REPO_DATABASE`     | NO       | The database name for tracking repos. Default to `github_repos`                              |

## Vercel

| Name                    | Required | Description                                                                             |
|-------------------------|----------|-----------------------------------------------------------------------------------------|
| `JWT_SECRET`            | NO       | Not required but recommended to set to protect your personal data.                      |
| `JWT_MAX_AGE`           | NO       | Max age (seconds) of your login credential. Defaults to 1800.                           |
| `SITE_INITIAL_PASSWORD` | NO       | Your site initial password, only works for the first deployment. Default to `tidbcloud` |

