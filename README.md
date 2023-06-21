# OSSInsight lite

> 🚧🚧🚧 This project is still in very early version, see [roadmap](https://github.com/pingcap/ossinsight-lite/issues/1).
> Features might be changed before stable release without notification.
> Suggestions and discussions are welcome.

Yet another customizable **FREE** github stats dashboard.

Demo: https://ossinsight-lite.vercel.app/

<img width="1440" alt="Default dashboard" src="https://github.com/pingcap/ossinsight-lite/assets/55385323/0eb143bb-abfb-4d31-8bbc-36da87355f2d">

## Requirements

- **[GitHub](https://github.com.)** account for fork and run your own data pipeline to fetch your GitHub activities.
- **[TiDB Serverless](https://tidbcloud.com/?utm_source=ossinsight&utm_medium=lite)** account to store your personal data for FREE.
- **[Vercel](https://vercel.com/)** account to deploy your dashboards.

## How to deploy your own (10mins)

1. [Create a TiDB Serverless cluster](docs/setup/database.md)
2. [Fork repository and setup GitHub Action to fetch data](docs/setup/repo-and-action.md)
3. [Deploy to Vercel to get your dashboards!](docs/setup/deploy-to-vercel.md)

## Advanced Usage (Optional)

- [Add tracking repos](docs/setup/tracking-repos.md)
- [Private repositories](docs/setup/private-repositories.md)
- TODO: Enable SQL cache

## Roadmap

See [roadmap](https://github.com/pingcap/ossinsight-lite/issues/1)

## Help

- Any feedback is welcome! Please create an [Issue](https://github.com/pingcap/ossinsight-lite/issues/new/choose) or
start a [Discussion](https://github.com/pingcap/ossinsight-lite/discussions/new/choose).
- If your site's home page thrown a 'client side error', Visit `/status` page to see if your database was correctly
configured.
- How to update? You can:
  - manually sync upstream updates if any workflows changed
  - or enable workflow [Sync upstream](.github/workflows/repo-sync.yml) to automatically sync upstream updates, you could set GitHub Action secret `SYNC_GITHUB_TOKEN` to enable auto update workflows. See https://stackoverflow.com/questions/66643917/refusing-to-allow-a-github-app-to-create-or-update-workflow for more
details.

## Use Case

You can add widgets to **README.md** / **websites** / **reports** / **slides** / **profile** by just 4 steps:
  1. 🚀 Deploy your own dashboard
  2. 🔗 Click the share link at the right conner of each widget card

     <img src="https://github.com/pingcap/ossinsight-lite/assets/55385323/c51a2b8e-05f7-4a69-9e0b-414925d6878a" weight="400" />
     
  3. 📋 Choose a way to add your widget: Markdown, HTML, Link or use Thumbnail img only

     <img src="https://github.com/pingcap/ossinsight-lite/assets/55385323/128278ad-2b94-421d-8532-41175d73c73c" weight="400" />
     
  4. 🤩 Paste and enjoy!

Here are some examples:

| The most used languages | Contribution behavior percentage |
| ----------- | ----------- |
|<img src="https://ossinsight-lite.vercel.app/widgets/contribution-most-used-languages/thumbnail.png" height="200" />|<img src="https://ossinsight-lite.vercel.app/widgets/contribution-behavior-percentage/thumbnail.png" height="200" />|

| Contribution monthly | Contribution time distribution |
| ----------- | ----------- |
|<img src="https://ossinsight-lite.vercel.app/widgets/contribution-monthly/thumbnail.png" height="200" />|<img src="https://ossinsight-lite.vercel.app/widgets/contribution-time-distribution/thumbnail.png" height="200" />|

| Contribution pull request size history | Currently working on |
| ----------- | ----------- |
|<img src="https://ossinsight-lite.vercel.app/widgets/contribution-pull-request-size-history/thumbnail.png" height="200" />|<img src="https://ossinsight-lite.vercel.app/widgets/db%2Fsql-1686650509966/thumbnail.png" height="200" />|

