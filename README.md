# OSSInsight lite

> 🚧🚧🚧 This project is still in very early version, see [roadmap](https://github.com/634750802/ossinsight-lite/issues/1).
>
> Features might be changed before stable release without notification.
> Suggestions and discussions are welcome.

Deploy a ***FREE*** online personal and customizable GitHub dashboard.

## Requirements

- **[GitHub](https://github.com.)** account for fork and run your own data pipeline.
- **[TiDB Cloud](https://tidbcloud.com/?utm_source=github&utm_medium=ossinsight_lite)** account for store your personal data.
- **[Vercel](https://vercel.com/)** account for deploy your dashboards.

> You can sign in to TiDB Cloud and Vercel with GitHub account.

## Get start

- [Setup TiDB Serverless cluster](docs/setup/database.md)
- [Fork repository and setup pipeline](docs/setup/repo-and-action.md)
- [Deploy to Vercel](docs/setup/deploy-to-vercel.md)

## Advanced Usage

- [Add tracking repos](docs/setup/tracking-repos.md)
- [Private repositories](docs/setup/private-repositories.md)
- TODO: Enable SQL cache

## Feedback

Any feedback is welcome! Please create an [Issue](https://github.com/634750802/ossinsight-lite/issues/new/choose) or
start a [Discussion](https://github.com/634750802/ossinsight-lite/discussions/new/choose).

## Troubleshooting

If your site's home page thrown a 'client side error', Visit `/status` page to see if your database was correctly
configured.

TODO

## Misc

### Get automatic updated

Enable workflow [Sync upstream](.github/workflows/repo-sync.yml) to automatically sync upstream updates. (force push)

#### Syncing workflows updates

Upstream workflows is not allowed to be synced without providing a GitHub Access Token with `workflows` permission. You
need to manually sync upstream updates if any workflows changed.

Alternatively, you could set GitHub Action secret `SYNC_GITHUB_TOKEN` to enable auto update workflows.

See https://stackoverflow.com/questions/66643917/refusing-to-allow-a-github-app-to-create-or-update-workflow for more
details.
