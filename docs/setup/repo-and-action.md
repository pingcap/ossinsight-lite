# Setup GitHub Action

This repository will use GitHub Action to run two pipelines ([oh-my-github-pipeline](https://github.com/hooopo/oh-my-github-pipeline) and [repo-track-pipeline](https://github.com/hooopo/repo-track-pipeline)) to collect your GitHub data and persist it to your own TiDB Serverless cluster (**Your data will not be collected by other services**).

> See [.github/workflows/pipelines.yml](../../.github/workflows/pipelines.yml) file for more details about the pipeline GitHub Action
> workflows.

Please follow the steps below to set up GitHub Actions on your forked repository.

1. [Fork ossinsight-lite repository](#fork-ossinsight-lite-repository)
2. [Setup GitHub Action secrets](#setup-github-action-secrets)
3. [Enable and run workflow](#enable-and-run-workflow)

## Fork ossinsight-lite repository

Click [here](http://github.com/pingcap/ossinsight-lite/fork) to fork your own repository from the pingcap/ossinsight-lite repository

## Setup GitHub Action secrets

Please follow the steps below to configure the connection information of TiDB cluster to GitHub Action's Secrets (which is required to run the pipeline workflow).

1. Go to **Settings** / **Secrets and variables** / **Actions** page of your forked repository.
2. Click **New repository secret** button at right top of the page.
3. In the **Name** field, type "DATABASE_URL".
4. In the **Secret** field, enter the value of `DATABASE_URL` of your TiDB Serverless cluster as following format:

   ```
   mysql://<user>:<password>@<host>:<port>
   ```
   
   Please use the TiDB Serverless cluster connection information (can be found in the **Connect to** dialog shown in [last step](database.md)) to replace the above `<user>`,`<password>`,`<host>`,`<port>` parts, and please DO NOT type any blank characters.

   <details>

   <summary>Click to check the example</summary>
   
   For example, if the connection information provided by the TiDB Serverless cluster is as follows:

   ```
   host: 'gateway01.us-west-2.prod.aws.tidbcloud.com',
   port: 4000,
   user: '4Budszs5sxiUZ65.root',
   password: 'Us1h2MRraVB4zfpU',
   ssl_ca: /etc/ssl/cert.pem
   ```

   The value of `DATABASE_URL` typed in the **Secret** field should be:

   ```
   mysql://4Budszs5sxiUZ65.root:Us1h2MRraVB4zfpU@gateway01.us-west-2.prod.aws.tidbcloud.com:4000
   ```

   </details>

   <div align="center">
      <img src="images/github-set-secret.png" width="600px" alt="New action secrets page"/>
      <p><i>New action secrets page (please input DATABASE_URL of your cluster)</i></p>
   </div>

5. Click **Add secret** button to finish.

> See [Environment Variables](./env.md#github) section to learn about the other environment variables that will be used by the pipeline workflow.

## Enable and run workflow

1. Click **Actions** tab of your forked repository and make sure you enable GitHub Action for this repo.

   <div align="center">
      <img src="images/enable-fork-action.png" width="600px" alt="The sidebar of the GitHub Action page"/>
      <div><i>The sidebar of the GitHub Action page</i></div>
   </div>

2. Click **GitHub Data Pipeline** workflow on the left navigation bar, click **Enable workflow** if the warning alert
   exists.

   > Once the workflow is enabled, it will be scheduled in every 2 hours.

   <div align="center">
      <img src="images/github-actions-side.png" width="300px" alt="The sidebar of the GitHub Action page"/>
      <p><i>The sidebar of the GitHub Action page</i></p>
   </div>

   <div align="center">
      <img src="images/enable-workflow.png" width="600px" alt="Warning alter in the workflow details page"/>
      <p><i>Warning alter in the workflow details page</i></p>
   </div>

3. For the first time, you can manually run workflow.

   <div align="center">
      <img src="images/run-workflow.png" width="600px" alt="Start up the workflow manually"/>
      <p><i>Start up the workflow manually</i></p>
   </div>

   > The workflow can take a while, depending on how much activity you have on GitHub.
   >
   > You can continue with the next steps without waiting for workflow to complete. If any errors occur during workflow, please refer to the [troubleshooting section](../../README.md#troubleshooting) (TODO) for solutions.

---

Previous step: [1. Setup TiDB Serverless cluster](database.md)

Next step: [3. Deploy to Vercel](deploy-to-vercel.md)
