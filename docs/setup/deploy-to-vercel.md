# Deploy to Vercel

## Deploy your project and assign a domain

Click `Add New...` / `Project` on the right top corner of the [Vercel dashboard page](https://vercel.com/dashboard).

![add-new-project.png](images/add-new-project.png)

Select your repo and click `Deploy`. Wait about 2 minutes and you will see:

![vercel-deploy.png](images/vercel-deploy.png)

Click `Add domain` at right side and assign a domain you want. (xxxx.vercel.app).

## Link TiDB Serverless to Vercel project

- Go back to Vercel homepage, click `Integrations` / `Browse Marketplace`.

  ![vercel-integrations-browse-marketplace.png](images/vercel-integrations-browse-marketplace.png)

- Search `tidb`, click `TiDB Cloud` then click `Add Integration`.

  ![vercel-integration-tidb.png](images/vercel-integration-tidb.png)

  ![vercel-integration-tidb-add.png](images/vercel-integration-tidb-add.png)

  ![vercel-integration-add.png](images/vercel-integration-add.png)

  Then you will see the TiDB Cloud integration page

  ![vercel-integration-tidb-configure.png](images/vercel-integration-tidb-configure.png)

- Click `Manage Access` button, make sure your repository is accessible.

  ![vercel-integration-manage-access.png](images/vercel-integration-manage-access.png)

- Click `Configure` in TiDB Cloud page, and `Add Link` button on the jumped page select your repo and the cluster you've
  created before.

  Click `Add link` again then you will see the Database is linked to Vercel.

  ![vercel-integration-tidb-add-link.png](images/vercel-integration-tidb-add-link.png)


- Go to Vercel project `Deployment` tab and redeploy your project.

  ![vercel-redeploy.png](images/vercel-redeploy.png)

---

Last step: [2. Setup GitHub Action](repo-and-action.md) 