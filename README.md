# OSSInsight lite

> 🚧🚧🚧 This project is still in very early version, see [roadmap](https://github.com/634750802/ossinsight-lite/issues/1).
> Features might be changed before stable release without notification.
> Suggestions and discussions are welcome.

Deploy a ***FREE*** online personal and customizable GitHub dashboard.

Demo: http://ossinsight-lite.vercel.app/

## Requirements

- **[GitHub](https://github.com.)** account for fork and run your own data pipeline to fetch your GitHub activities.
- **[TiDB Serverless](https://tidbcloud.com/?utm_source=github&utm_medium=ossinsight_lite)** account to store your personal data for FREE.
- **[Vercel](https://vercel.com/)** account to deploy your dashboards.

## How to deploy your own (10mins)

1. [Setup a TiDB Serverless cluster](docs/setup/database.md)
1. [Fork repository and setup GitHub Action to fetch data](docs/setup/repo-and-action.md)
1. [Deploy to Vercel to get your dashboards!](docs/setup/deploy-to-vercel.md)

## Advanced Usage (Optional)

- [Add tracking repos](docs/setup/tracking-repos.md)
- [Private repositories](docs/setup/private-repositories.md)
- TODO: Enable SQL cache

## Help

- Any feedback is welcome! Please create an [Issue](https://github.com/634750802/ossinsight-lite/issues/new/choose) or
start a [Discussion](https://github.com/634750802/ossinsight-lite/discussions/new/choose).
- If your site's home page thrown a 'client side error', Visit `/status` page to see if your database was correctly
configured.


## Misc

### Get automatic updated

Enable workflow [Sync upstream](.github/workflows/repo-sync.yml) to automatically sync upstream updates. (force push)

#### Syncing workflows updates

Upstream workflows is not allowed to be synced without providing a GitHub Access Token with `workflows` permission. You
need to manually sync upstream updates if any workflows changed.

Alternatively, you could set GitHub Action secret `SYNC_GITHUB_TOKEN` to enable auto update workflows.

See https://stackoverflow.com/questions/66643917/refusing-to-allow-a-github-app-to-create-or-update-workflow for more
details.
