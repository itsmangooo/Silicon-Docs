# First login and organization

## Register the installation administrator

Open the URL printed by the installer and choose **Register**. The first account on a new installation becomes the installation-level system administrator, which is separate from organization roles. Use a unique password and serve production installations through HTTPS before entering provider credentials.

![Silicon registration page](/img/screenshots/register.png)

## Create an organization

After registration, create the first organization from the empty dashboard. The creator becomes that organization's Owner. An organization is Silicon's tenant and security boundary: projects, applications, servers, domains, networks, provider connections, secrets, budgets, jobs, and audit events belong to it.

Users are global and may join multiple organizations with different roles. Use the selector under the Silicon logo to switch the active tenant. The frontend clears tenant-specific state on a switch, while the backend independently authorizes every request.

## Invite existing users

Open **Members**, add an existing local user, and choose Owner, Admin, Developer, or Viewer. Open **Access** to review the named permissions behind the role. Use the narrowest role that permits the required work.

![Organization membership and roles](/img/screenshots/members.png)

Next, follow [First deployment](first-deployment.md).
