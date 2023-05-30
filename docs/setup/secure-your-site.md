# Secure your site

### Setup JWT_SECRET

Goto your Vercel project `Settings` / `Environment Variables` page, add a new Environment variable `JWT_SECRET` to a
random string. You could generate a strong secret using online service. **Do not share it to anyone**.

### Redeploy project

Go to Vercel project `Deployment` tab and redeploy your project.

![vercel-redeploy.png](images/vercel-redeploy.png)

### Stronger password

By default, the default password of your site is `tidbcloud`. It's recommended to change to a stronger password.

#### Setup `SITE_INITIAL_PASSWORD` before first deployment

The provided password will be set to your provided password. After the migrations were finished, this env would not take
effect.

#### Update password at admin page after site deployed

Goto `/admin/accounts` page and change a new password.
