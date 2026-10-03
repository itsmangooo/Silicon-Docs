# AWS costs and budgets

Silicon reads AWS Cost Explorer data and pricing estimates for connected accounts. It does not replace AWS billing, guarantee real-time values, or stop infrastructure automatically.

1. Connect an AWS account with Cost Explorer and Pricing permissions from the [AWS guide](aws.md).
2. Open **AWS → Costs**, select the account and period, and refresh the provider snapshot.
3. Distinguish provider-reported actual/forecast values from pre-provision estimates.
4. Create an organization, account, project, or environment budget only where attribution data is available.
5. Review threshold events and audit history.

Cost Explorer data may be delayed. Cross-account organization totals require a complete snapshot for every included account. Project/environment budgets depend on AWS allocation tags and remain unevaluated when attribution is missing rather than presenting a false zero.

Budgets may reject new Silicon provisioning after configured thresholds, but they do not stop or terminate running resources. Configure independent AWS Budgets/alerts for provider-level safeguards.
