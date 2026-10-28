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
    html = (
        "<div style=\"font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.6;color:#111;max-width:560px\">"
        f"<p>Oi, {primeiro}.</p>"
        "<p>Você entrou na lista do <strong>Leandro Campos</strong>. Duas coisas chegam por aqui:</p>"
        "<ol><li>O PDF <strong>12 tarefas da sua empresa que a IA já faz melhor que um analista</strong>, assim que ficar pronto.</li>"
        "<li>As novidades do e-book <strong>IA no Negócio: o manual prático do empreendedor</strong>, que já está à venda pelo preço de lançamento de R$ 47 até 12 de novembro: "
        "<a href=\"https://leandrowcampos.com.br/ebook/ia-no-negocio/\" style=\"color:#b8862b\">leandrowcampos.com.br/ebook/ia-no-negocio</a>.</li></ol>"
        "<p>Enquanto isso, uma pergunta rápida: <strong>qual área da sua empresa mais consome o seu tempo hoje?</strong> "
        "Responda este e-mail com uma palavra (atendimento, vendas, financeiro, pessoas, tecnologia...). Eu leio todas.</p>"
        "<p>Leandro Campos<br><span style=\"color:#666\">Fundador da Nvoip · 15 anos empreendendo</span><br>"
        "<a href=\"https://leandrowcampos.com.br\" style=\"color:#b8862b\">leandrowcampos.com.br</a></p>"
        "<p style=\"color:#888;font-size:13px\">Para sair da lista, responda com \"sair\".</p></div>"
    )
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
