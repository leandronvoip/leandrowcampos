# Receptor de leads (AWS)

Conta AWS 935930665473 (perfil `claude`), região us-east-1, tudo com tag `projeto=leandrowcampos`.

- Lambda `lwc-leads` (python3.12, arm64) — código em `handler.py`
- DynamoDB `lwc_leads` (PK `email`, SK `ts`), on-demand
- API Gateway HTTP `lwc-leads-api` (id `tv4m6u0sdh`) com CORS para o site; a Function URL nativa devolvia 403 nesta conta
- IAM role `lwc-leads-lambda-role` (logs, PutItem, SES só de `@news.leandrowcampos.com.br`)
- E-mail de boas-vindas pelo SES — **pausado**: a conta está com `EnforcementStatus=SHUTDOWN` em us-east-1 (ver caixa do e-mail raiz da conta / Support). O lead é gravado mesmo assim.

Endpoint usado pelo site (`vars.PUBLIC_LEAD_WEBHOOK_URL` no GitHub): `https://tv4m6u0sdh.execute-api.us-east-1.amazonaws.com/`

Atualizar o código:

```sh
cd infra/leads-lambda && zip -qj /tmp/lwc-leads.zip handler.py && \
AWS_PROFILE=claude aws lambda update-function-code --region us-east-1 --function-name lwc-leads --zip-file fileb:///tmp/lwc-leads.zip
```
