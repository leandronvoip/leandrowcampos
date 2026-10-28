"""Receptor de leads do site leandrowcampos.com.br.

Recebe o JSON do LeadForm (nome, e-mail, whatsapp, consentimentos, origem, UTMs),
grava no DynamoDB e envia o e-mail de boas-vindas pelo SES. Substituível pelo n8n
sem mudar o site: basta trocar PUBLIC_LEAD_WEBHOOK_URL.
"""
import json
import os
import re
import time
import uuid

import boto3

TABLE = os.environ["LEADS_TABLE"]
FROM = os.environ.get("MAIL_FROM", "Leandro Campos <contato@news.leandrowcampos.com.br>")
REPLY_TO = os.environ.get("MAIL_REPLY_TO", "contato@leandrowcampos.com.br")
ALLOWED_ORIGINS = {
    "https://leandrowcampos.com.br",
    "https://www.leandrowcampos.com.br",
    "https://leandrowcampos.com",
    "http://localhost:4321",
    "http://127.0.0.1:4321",
}

ddb = boto3.resource("dynamodb")
_ses_kwargs = {"region_name": os.environ.get("SES_REGION", "us-east-1")}
if os.environ.get("SES_ACCESS_KEY_ID"):  # remetente na conta dedicada de SES (485891566746)
    _ses_kwargs.update(aws_access_key_id=os.environ["SES_ACCESS_KEY_ID"], aws_secret_access_key=os.environ["SES_SECRET_ACCESS_KEY"])
ses = boto3.client("ses", **_ses_kwargs)
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _cors(origin: str) -> dict:
    allow = origin if origin in ALLOWED_ORIGINS else "https://leandrowcampos.com.br"
    return {
        "Access-Control-Allow-Origin": allow,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin",
        "Content-Type": "application/json; charset=utf-8",
    }


def _resp(status: int, body: dict, origin: str) -> dict:
    return {"statusCode": status, "headers": _cors(origin), "body": json.dumps(body, ensure_ascii=False)}


def _welcome(nome: str, origem: str) -> tuple[str, str, str]:
    primeiro = (nome or "").strip().split(" ")[0] or "olá"
    assunto = "Você está na lista: as 12 tarefas e o manual por R$ 47"
    texto = (
        f"Oi, {primeiro}.\n\n"
        "Você entrou na lista do Leandro Campos. Duas coisas chegam por aqui:\n\n"
        "1. O PDF \"12 tarefas da sua empresa que a IA já faz melhor que um analista\", assim que ficar pronto.\n"
        "2. As novidades do e-book \"IA no Negócio: o manual prático do empreendedor\", que já está à venda "
        "pelo preço de lançamento de R$ 47 até 12 de novembro: https://leandrowcampos.com.br/ebook/ia-no-negocio/\n\n"
        "Enquanto isso, uma pergunta rápida: qual área da sua empresa mais consome o seu tempo hoje? "
        "Responda este e-mail com uma palavra (atendimento, vendas, financeiro, pessoas, tecnologia...). "
        "Eu leio todas.\n\n"
        "Leandro Campos\n"
        "Fundador da Nvoip · 15 anos empreendendo\n"
        "https://leandrowcampos.com.br\n\n"
        "Para sair da lista, responda com \"sair\"."
    )
    html = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{assunto}</title></head>
<body style="margin:0;padding:0;background:#f3f1ec;font-family:Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#141416;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f1ec;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
  <tr><td style="background:#0a0a0c;border-radius:16px 16px 0 0;padding:28px 32px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
      <td style="font:700 20px/1 'Inter Tight',Inter,Helvetica,Arial,sans-serif;color:#f5f3ee;letter-spacing:-.02em;">Leandro Campos<span style="color:#d4a857;">.</span></td>
      <td align="right" style="font:600 11px/1 Inter,Helvetica,Arial,sans-serif;color:#f26a1b;letter-spacing:.18em;text-transform:uppercase;">Lista</td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#ffffff;padding:36px 32px 8px 32px;">
    <p style="margin:0 0 14px 0;font:600 12px/1 Inter,Helvetica,Arial,sans-serif;color:#f26a1b;letter-spacing:.2em;text-transform:uppercase;">Você está na lista</p>
    <h1 style="margin:0 0 18px 0;font:700 28px/1.15 'Inter Tight',Inter,Helvetica,Arial,sans-serif;color:#141416;letter-spacing:-.025em;">Oi, {primeiro}. Duas coisas chegam por aqui.</h1>
    <p style="margin:0 0 24px 0;font:400 16px/1.6 Inter,Helvetica,Arial,sans-serif;color:#4a4a4f;">Obrigado por entrar. Eu uso esta lista para mandar o que de fato funciona na minha empresa, sem enfeite e sem spam: um e-mail por semana, no máximo.</p>
  </td></tr>
  <tr><td style="background:#ffffff;padding:0 32px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e6e2da;border-radius:12px;">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0 0 6px 0;font:700 12px/1 Inter,Helvetica,Arial,sans-serif;color:#f26a1b;">1</p>
        <p style="margin:0 0 6px 0;font:700 16px/1.35 Inter,Helvetica,Arial,sans-serif;color:#141416;">O PDF gratuito: 12 tarefas da sua empresa que a IA já faz melhor que um analista</p>
        <p style="margin:0;font:400 14px/1.55 Inter,Helvetica,Arial,sans-serif;color:#4a4a4f;">Uma tarefa por página, com o prompt pronto para copiar. Chega neste e-mail assim que ficar pronto.</p>
      </td></tr>
    </table>
    <div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e6e2da;border-radius:12px;background:#fbfaf7;">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0 0 6px 0;font:700 12px/1 Inter,Helvetica,Arial,sans-serif;color:#f26a1b;">2</p>
        <p style="margin:0 0 6px 0;font:700 16px/1.35 Inter,Helvetica,Arial,sans-serif;color:#141416;">O e-book IA no Negócio: o manual prático do empreendedor</p>
        <p style="margin:0 0 16px 0;font:400 14px/1.55 Inter,Helvetica,Arial,sans-serif;color:#4a4a4f;">Os prompts e os agentes que eu uso para operar a minha empresa, nas 10 áreas, prontos para a sua. Preço de lançamento de <strong style="color:#141416;">R$ 47</strong> até 12 de novembro (depois, R$ 97).</p>
        <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="background:#f26a1b;border-radius:999px;">
          <a href="https://leandrowcampos.com.br/ebook/ia-no-negocio/?utm_source=email&amp;utm_medium=boas-vindas&amp;utm_campaign=lancamento-ia-no-negocio" style="display:inline-block;padding:12px 22px;font:600 15px/1 Inter,Helvetica,Arial,sans-serif;color:#0a0a0c;text-decoration:none;">Conhecer o e-book por R$ 47</a>
        </td></tr></table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#ffffff;padding:28px 32px 32px 32px;border-radius:0 0 16px 16px;">
    <p style="margin:0 0 10px 0;font:400 16px/1.6 Inter,Helvetica,Arial,sans-serif;color:#4a4a4f;">Enquanto isso, uma pergunta rápida: <strong style="color:#141416;">qual área da sua empresa mais consome o seu tempo hoje?</strong> Responda este e-mail com uma palavra (atendimento, vendas, financeiro, pessoas, tecnologia). Eu leio todas.</p>
    <p style="margin:24px 0 0 0;font:700 16px/1.3 'Inter Tight',Inter,Helvetica,Arial,sans-serif;color:#141416;">Leandro Campos<span style="color:#f26a1b;">.</span><br><span style="font:400 13px/1.5 Inter,Helvetica,Arial,sans-serif;color:#6f6e6a;">Fundador da Nvoip · 15 anos empreendendo</span></p>
  </td></tr>
  <tr><td style="padding:22px 16px 0 16px;text-align:center;font:400 12px/1.6 Inter,Helvetica,Arial,sans-serif;color:#8a8883;">
    <a href="https://leandrowcampos.com.br" style="color:#8a8883;text-decoration:none;">leandrowcampos.com.br</a> &nbsp;·&nbsp; <a href="https://www.instagram.com/leandrowcampos" style="color:#8a8883;text-decoration:none;">Instagram</a> &nbsp;·&nbsp; <a href="https://www.linkedin.com/in/leandro-campos" style="color:#8a8883;text-decoration:none;">LinkedIn</a> &nbsp;·&nbsp; <a href="https://www.youtube.com/c/leandro-campos" style="color:#8a8883;text-decoration:none;">YouTube</a><br>
    Você recebe este e-mail porque se cadastrou em leandrowcampos.com.br. Para sair da lista, responda com "sair".
  </td></tr>
</table>
</td></tr></table>
</body></html>"""
    return assunto, texto, html


def lambda_handler(event, _context):
    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    origin = headers.get("origin", "")
    method = (event.get("requestContext", {}).get("http", {}) or {}).get("method", "POST")
    if method == "OPTIONS":
        return {"statusCode": 204, "headers": _cors(origin), "body": ""}
    try:
        payload = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return _resp(400, {"ok": False, "erro": "json_invalido"}, origin)

    email = (payload.get("email") or "").strip().lower()
    if not EMAIL_RE.match(email):
        return _resp(422, {"ok": False, "erro": "email_invalido"}, origin)
    if payload.get("website") or payload.get("site"):  # honeypot
        return _resp(200, {"ok": True}, origin)

    agora = int(time.time())
    item = {
        "email": email,
        "ts": agora,
        "id": str(uuid.uuid4()),
        "nome": (payload.get("nome") or "")[:120],
        "whatsapp": re.sub(r"\D", "", payload.get("whatsapp") or "")[:20],
        "consent_email": bool((payload.get("consentimentos") or {}).get("email", payload.get("consent_email", True))),
        "consent_whatsapp": bool((payload.get("consentimentos") or {}).get("whatsapp", payload.get("consent_whatsapp", False))),
        "origem": (payload.get("origem") or "")[:60],
        "pagina": (payload.get("pagina") or payload.get("page") or "")[:200],
        "url": (payload.get("url") or "")[:500],
        "utms": {k: str(v)[:160] for k, v in (payload.get("utms") or payload.get("utm") or {}).items() if v} or None,
        "enviado_em": (payload.get("enviado_em") or "")[:40],
        "tags": [f"origem:{(payload.get('origem') or 'site')[:40]}"],
        "ip": (event.get("requestContext", {}).get("http", {}) or {}).get("sourceIp", ""),
        "user_agent": headers.get("user-agent", "")[:200],
    }
    item = {k: v for k, v in item.items() if v not in (None, "")}
    ddb.Table(TABLE).put_item(Item=item)

    enviado = False
    try:
        assunto, texto, html = _welcome(item.get("nome", ""), item.get("origem", ""))
        ses.send_email(
            Source=FROM,
            Destination={"ToAddresses": [email]},
            ReplyToAddresses=[REPLY_TO],
            Message={
                "Subject": {"Data": assunto, "Charset": "UTF-8"},
                "Body": {"Text": {"Data": texto, "Charset": "UTF-8"}, "Html": {"Data": html, "Charset": "UTF-8"}},
            },
            Tags=[{"Name": "projeto", "Value": "leandrowcampos"}, {"Name": "fluxo", "Value": "boas-vindas"}],
        )
        enviado = True
    except Exception as exc:  # noqa: BLE001 — o lead já está salvo; e-mail falhar não pode derrubar o cadastro
        print("erro_ses", repr(exc))

    return _resp(200, {"ok": True, "email_enviado": enviado}, origin)
