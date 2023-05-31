# Deploy to Vercel

## Create a Vercel project for your forked repository

1. Click **Add New...** button and select the **Project** option on the right top corner of the [Vercel dashboard page](https://vercel.com/dashboard).

   <div align="center">
      <img src="images/vercel-new-project.png" width="400px" alt="Add new project on Vercel"/>
      <p><i>Add new project on Vercel</i></p>
   </div>

2. Select your forked `ossinsight-lite` repository and click the **Import** button. 

   <div align="center">
      <img src="images/vercel-new-import-git-repository.png" width="650px" alt="Import the forked repository to Vercel project"/>
      <p><i>Import the forked repository to Vercel project</i></p>
   </div>

3. Click the **Deploy** button to deploy the forked `ossinsight-lite` to Vercel (It will take about two to three minutes).

   <div align="center">
      <img src="images/vercel-new-configure-project.png" width="650px" alt="Configure Vercel project"/>
      <p><i>Configure Vercel project</i></p>
   </div>

   <div align="center">
      <img src="images/vercel-deploy-success.png" width="650px" alt="Deploy Vercel project successfully"/>
      <p><i>Deploy Vercel project successfully</i></p>
   </div>

4. Click **Add domain** at right side and assign a domain you like, such as `ossinsight-lite-five.vercel.app`.

## Integrate TiDB Serverless into Vercel project

1. Go to [TiDB Cloud Integration](https://vercel.com/integrations/tidb-cloud) page on Vercel, and click the **Add Integration** button.

2. Select the Vercel Account to add TiDB Cloud Integration to, and then click **Continue** button.

   <div align="center">
      <img src="images/vercel-tidb-integration-add-to-account.png" width="700px" alt="Add TiDB integration to specify Vercel account"/>
      <p><i>Add TiDB Cloud integration to specify Vercel account</i></p>
   </div>

3. Select the Vercel project you've created before, and then click **Continue** button.

   <div align="center">
      <img src="images/vercel-tidb-integration-add-to-project.png" width="400px" alt="Add TiDB Cloud integration to specify Vercel project"/>
      <p><i>Add TiDB Cloud integration to specify Vercel project</i></p>
   </div>

   After clicking continue, the browser will open a new window, which is the integration page of TiDB Cloud.

4. Confirm the Vercel project and the TiDB Serverless cluster will be linked.

   If there is no problem, click the **Next** button to continue.

   <div align="center">
      <img src="images/vercel-tidb-integration-new.png" width="450px" alt="New TiDB Cloud integration page"/>
      <p><i>New TiDB Cloud integration page</i></p>
   </div>

   If there is no problem, click the **Add Integration and Return to Vercel** button to finish the integration.

   <div align="center">
      <img src="images/vercel-tidb-integration-config.png" width="450px" alt="Configure TiDB Cloud integration page"/>
      <p><i>Configure TiDB Cloud integration page</i></p>
   </div>

   > The TiDB Cloud integration with Vercel will automatically pass the database cluster connection information to the Vercel project through environment variables.

5. Go to **Deployments** tab of the Vercel project and click the **Redeploy** button to redeploy your project, so that the environment variables can take effect.

   <div align="center">
      <img src="images/vercel-redeploy.png" width="750px" alt="Redeploy Vercel project"/>
      <p><i>Redeploy Vercel project</i></p>
   </div>

---

Previous step: [2. Setup GitHub Action](repo-and-action.md) 
