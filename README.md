# OSSInsight lite

> 🚧🚧🚧 This project is still in very early version, see [roadmap](https://github.com/634750802/ossinsight-lite/issues/1).
>
> Features might be changed before stable release without notification.
> Suggestions and discussions are welcome.

Deploy a ***FREE*** online personal and customizable GitHub dashboard.

## Requirements

- **[GitHub](https://github.com.)** account for fork and run your own data pipeline.
- **[TiDB Cloud](https://tidbcloud.com/)** account for store your personal data.
- **[Vercel](https://vercel.com/)** account for deploy your dashboards.

> You can sign in to TiDB Cloud and Vercel with GitHub account.

## Get start

- [Setup TiDB Serverless cluster](docs/setup/database.md)
- [Fork repository and setup pipeline](docs/setup/repo-and-action.md)
- [Deploy to Vercel](docs/setup/deploy-to-vercel.md)

## Advanced Usage

- [Add tracking repos](docs/setup/tracking-repos.md)
- TODO: Private data collecting
- TODO: Enable SQL cache

## Misc

### Get automatic updated

Enable workflow [Sync upstream](.github/workflows/repo-sync.yml) to automatically sync upstream updates. (force push)
