#!/bin/sh
# v3: mesmo retrato fiel, agora com fundo escuro e névoa/luz laranja (laranja da Nvoip) atrás da pessoa.
set -eu
cd "$(dirname "$0")"
set -a; . /Users/leandrocampos/Documents/codex/Nvoip/.secrets/openai.env; set +a
REF=../../fotos-origem/ref
PROMPT="Edite esta foto mantendo a pessoa EXATAMENTE como está: mesmo rosto, mesmos traços, mesma barba, mesmo cabelo, mesmo corpo, mesma pose e mesma expressão. Não rejuvenesça, não emagreça, não altere nariz, olhos, boca, pele ou proporções. Mude apenas: 1) o fundo laranja chapado vira um fundo de estúdio escuro, quase preto, com uma névoa luminosa laranja quente (tom de laranja vivo, como #F07A1F) atrás da pessoa, mais intensa atrás dos ombros e da cabeça e se dissolvendo no preto nas bordas, com leve volumetria de fumaça; 2) a iluminação vira luz de estúdio suave, elegante, com um leve contorno quente nas bordas do cabelo e dos ombros vindo da névoa laranja, pele natural; 3) a camiseta preta com logotipo vira uma camiseta preta lisa, sem logotipo, sem estampa, sem texto. Sem texto, sem marca d'água. Qualidade fotográfica realista."
gerar() {
  nome="$1"; tamanho="$2"; principal="$3"; shift 3
  extra=""; for r in "$@"; do extra="$extra -F image[]=@$REF/$r"; done
  echo "== $nome ($tamanho) base $principal"
  curl -sS https://api.openai.com/v1/images/edits -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F "model=gpt-image-1.5" -F "image[]=@$REF/$principal" $extra -F "input_fidelity=high" \
    -F "size=$tamanho" -F "quality=high" -F "n=1" -F "prompt=$PROMPT" > "$nome.json"
  python3 - "$nome" <<'PY'
import json,sys,base64
n=sys.argv[1]; d=json.load(open(f"{n}.json"))
if "data" not in d: print("ERRO:", json.dumps(d.get("error",d))[:300]); sys.exit(1)
open(f"{n}.png","wb").write(base64.b64decode(d["data"][0]["b64_json"])); print("ok",n)
PY
  rm -f "$nome.json"
}
gerar retrato-laranja-vertical 1024x1536 IMG_7900.jpg IMG_7901.jpg
gerar retrato-laranja-quadrado 1024x1024 IMG_7896.jpg IMG_7900.jpg
echo concluído
