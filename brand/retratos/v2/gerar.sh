#!/bin/sh
# v2: fidelidade alta (input_fidelity=high) com o ensaio de 2023 como referência. Só fundo, luz e camiseta mudam.
set -eu
cd "$(dirname "$0")"
set -a; . /Users/leandrocampos/Documents/codex/Nvoip/.secrets/openai.env; set +a
REF=../../fotos-origem/ref
PROMPT="Edite esta foto mantendo a pessoa EXATAMENTE como está: mesmo rosto, mesmos traços, mesma barba, mesmo cabelo, mesmo corpo, mesma pose e mesma expressão. Não rejuvenesça, não emagreça, não altere nariz, olhos, boca, pele ou proporções. Mude apenas três coisas: 1) o fundo laranja vira um fundo de estúdio escuro, quase preto, com gradiente suave e leve profundidade; 2) a iluminação vira luz de estúdio suave e lateral, elegante, de retrato editorial, mantendo a pele natural; 3) a camiseta preta com logotipo vira uma camiseta preta lisa, sem logotipo, sem estampa. Sem texto, sem marca d'água. Qualidade fotográfica realista."
gerar() {
  nome="$1"; tamanho="$2"; principal="$3"; shift 3
  echo "== $nome ($tamanho) base $principal"
  set -- "$@"
  extra=""
  for r in "$@"; do extra="$extra -F image[]=@$REF/$r"; done
  curl -sS https://api.openai.com/v1/images/edits \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F "model=gpt-image-1.5" \
    -F "image[]=@$REF/$principal" $extra \
    -F "input_fidelity=high" \
    -F "size=$tamanho" -F "quality=high" -F "n=1" \
    -F "prompt=$PROMPT" > "$nome.json"
  python3 - "$nome" <<'PY'
import json, sys, base64
n = sys.argv[1]
d = json.load(open(f"{n}.json"))
if "data" not in d:
    print("ERRO:", json.dumps(d.get("error", d))[:300]); sys.exit(1)
open(f"{n}.png", "wb").write(base64.b64decode(d["data"][0]["b64_json"]))
print("ok", n + ".png")
PY
  rm -f "$nome.json"
}
gerar retrato-bracos-cruzados 1024x1536 IMG_7900.jpg IMG_7901.jpg
gerar retrato-tres-quartos 1024x1024 IMG_7896.jpg IMG_7900.jpg
gerar retrato-perfil 1024x1024 IMG_7923.jpg IMG_7889.jpg
echo "concluído"
