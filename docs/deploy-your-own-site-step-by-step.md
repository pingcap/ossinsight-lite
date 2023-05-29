# Deploy your own OSSInsight lite step by step

## Requirements

- **[GitHub](https://github.com.)** account for fork and run your own data pipeline.
- **[TiDB Cloud](https://tidbcloud.com/)** account for store your personal data.
- **[Vercel](https://vercel.com/)** account for deploy your dashboards.

> You can sign in to TiDB Cloud and Vercel with GitHub account.

## Three steps to get start

### Prepare database

- Create a TiDB Cloud Serverless cluster

  ![create-cluster.png](images/create-cluster.png)

- Wait a few seconds and click `Connect` on right top corner:

  ![connect.png](images/connect.png)

  Select `General` in `Connect With` label, click `Create password` and save your password. (
  ***Attention: this password
  will be shown only once***)

  ![img.png](images/connect-with.png)

### Setup repository and pipeline

- [Fork(TODO: CHANGE_OWNER_TO_pingcap)](http://github.com/634750802/ossinsight-lite/fork) ossinsight-lite.

  > This repository uses [hooopo/oh-my-github-pipeline](https://github.com/hooopo/oh-my-github-pipeline)
  > and [hooopo/repo-track-pipeline](https://github.com/hooopo/repo-track-pipeline) to fetch and collect your data to
  > your own TiDB Cloud cluster. **Your data will not be collected by other services.**
  >
  > See [.github/workflows/pipelines.yml](../.github/workflows/pipelines.yml) for more details about GitHub Action
  > workflows.
- Setup secrets:
    1. Goto `Settings` / `Secrets and variables` / `Actions` page of your forked repository.
    2. Click `New repository secret` button at right top of the page
    3. Set `USER_LOGIN` to your GitHub login
    4. Set `DATABASE_URL` to "**mysql2**://`user`:`password`@`host`:4000".
       Example: `mysql2://xxxxx.root:yyyyy@zzzzzprod.aws.tidbcloud.com:4000`.

    > See [GitHub Secrets](#github-secrets) for more details about what secrets we will use.

- Make sure you enable GitHub Action for this forked repo.

  ![enable-fork-action.png](images/enable-fork-action.png)![]()

- Enable `GitHub Data Pipeline` workflow, the workflow will be scheduled in every 2 hours.

  ![TODO: make new screenshot](images/enable-workflow.png)

- For the first time, you can manually run workflow. The first run will take a while based on your activities amount.

  ![TODO: make new screenshot](images/run-workflow.png)

### Deploy to vercel

- Click `Add New...` / `Project` on the right top corner of the [Vercel dashboard page](https://vercel.com/dashboard).
  
- ![add-new-project.png](images/add-new-project.png)

## Advanced Usage

### Private data collecting

> TODO
> Setup ACCESS_TOKEN

### Enable SQL cache

> TODO
> Setup Vercel KV

## Appendix

### GitHub Secrets

### Vercel Secrets