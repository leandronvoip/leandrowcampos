#!/bin/sh
# Gera retratos tratados a partir da foto de referência usando a API de edição de imagens da OpenAI.
# Uso: sh brand/retratos/gerar.sh   (chave lida do cofre; nunca impressa)
set -eu
cd "$(dirname "$0")"
set -a; . /Users/leandrocampos/Documents/codex/Nvoip/.secrets/openai.env; set +a
REF="../fotos-origem/leandro-2021-2.jpg"

gerar() {
  nome="$1"; tamanho="$2"; prompt="$3"
  echo "== $nome ($tamanho)"
  curl -sS https://api.openai.com/v1/images/edits \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F "model=gpt-image-1.5" \
    -F "image[]=@$REF" \
    -F "size=$tamanho" \
    -F "quality=high" \
    -F "n=1" \
    -F "prompt=$prompt" > "$nome.json"
  python3 - "$nome" <<'EOF'
import json, sys, base64
n = sys.argv[1]
d = json.load(open(f"{n}.json"))
if "data" not in d:
    print("ERRO:", json.dumps(d.get("error", d))[:300]); sys.exit(1)
open(f"{n}.png", "wb").write(base64.b64decode(d["data"][0]["b64_json"]))
print("ok", n + ".png", d.get("usage"))
EOF
  rm -f "$nome.json"
}

BASE="Retrato profissional editorial da mesma pessoa da foto de referência, mantendo fielmente o rosto, a barba, os óculos e a expressão natural. Estilo de fotografia de estúdio de alto padrão: fundo escuro quase preto com leve gradiente, luz principal suave lateral (estilo Rembrandt), contraste elegante, pele natural sem retoque exagerado. Roupa: camisa social escura ou malha preta lisa, sem logotipos nem estampas. Enquadramento"

gerar "retrato-vertical" "1024x1536" "$BASE: busto e ombros, olhando para a câmera com confiança e um sorriso leve, espaço acima da cabeça. Sem texto, sem marcas d'água."
gerar "retrato-quadrado" "1024x1024" "$BASE: rosto e ombros centralizados, formato quadrado para foto de perfil, olhar direto, sorriso discreto. Sem texto, sem marcas d'água."
gerar "retrato-meio-corpo" "1024x1536" "$BASE: meio corpo, braços cruzados com naturalidade, ligeiramente de três quartos, postura de fundador seguro, fundo escuro com profundidade. Sem texto, sem marcas d'água."
echo "concluído"
