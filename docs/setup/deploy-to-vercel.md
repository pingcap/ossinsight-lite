# Deploy to Vercel

## Deploy your project and assign a domain

Click `Add New...` / `Project` on the right top corner of the [Vercel dashboard page](https://vercel.com/dashboard).

![add-new-project.png](images/add-new-project.png)

Select your repo and click `Deploy`. Wait about 2 minutes and you will see:

![vercel-deploy.png](images/vercel-deploy.png)

Click `Add domain` at right side and assign a domain you want. (xxxx.vercel.app).

## Link TiDB Serverless to Vercel project

- Click `Integrations` / `Browse Marketplace`.

  ![vercel-integrations-browse-marketplace.png](images/vercel-integrations-browse-marketplace.png)

- Search `tidb`, click `TiDB Cloud` then click `Add Integration`.

  ![vercel-integration-tidb.png](images/vercel-integration-tidb.png)

  ![vercel-integration-tidb-add.png](images/vercel-integration-tidb-add.png)


- Click `Configure` and `Add Link` in TiDB Cloud page, select your repo and the cluster you've created before.

  ![vercel-integration-tidb-configure.png](images/vercel-integration-tidb-configure.png)


- Click `Add link` again then you will see the Database is linked to Vercel.

  ![vercel-integration-tidb-add-link.png](images/vercel-integration-tidb-add-link.png)


- Go to Vercel project `Deployment` tab and redeploy your project.

  ![vercel-redeploy.png](images/vercel-redeploy.png)

