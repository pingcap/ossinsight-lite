# Setup GitHub Action

> This repository uses [hooopo/oh-my-github-pipeline](https://github.com/hooopo/oh-my-github-pipeline)
> and [hooopo/repo-track-pipeline](https://github.com/hooopo/repo-track-pipeline) to collect your data from GitHub API
> and persist to your own TiDB Serverless cluster. **Your data will not be collected by other services.**
>
> See [.github/workflows/pipelines.yml](../.github/workflows/pipelines.yml) for more details about GitHub Action
> workflows.

Click [here(TODO: CHANGE_OWNER_TO_pingcap)](http://github.com/634750802/ossinsight-lite/fork) to fork ossinsight-lite.

## Setup GitHub Action secrets

> Several environment variables is used to run data pipeline properly.
> 
> See [TODO: GitHub Secrets]() for more details about what pipeline will use.

- Goto `Settings` / `Secrets and variables` / `Actions` page of your forked repository.
- Click `New repository secret` button at right top of the page
- Set `USER_LOGIN` to your GitHub login
- Set `DATABASE_URL` to "**mysql2**://`user`:`password`@`host`:4000".
  Example: `mysql2://xxxxx.root:yyyyy@zzzzzprod.aws.tidbcloud.com:4000`.

## Enable and run workflow

Make sure you enable GitHub Action for this forked repo.

![enable-fork-action.png](images/enable-fork-action.png)![]()

Enable `GitHub Data Pipeline` workflow, the workflow will be scheduled in every 2 hours.

![TODO: make new screenshot](images/enable-workflow.png)

For the first time, you can manually run workflow. The first run will take a while based on your activities amount.

![TODO: make new screenshot](images/run-workflow.png)
