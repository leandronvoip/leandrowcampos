#!/bin/sh
set -eu; cd "$(dirname "$0")"
set -a; . /Users/leandrocampos/Documents/codex/Nvoip/.secrets/openai.env; set +a
P="Na área indicada pela máscara, remova completamente o logotipo e o texto impressos na camiseta, preenchendo com o mesmo tecido preto liso da camiseta, com as mesmas dobras, sombras e iluminação. Não altere nada fora da área. Sem texto, sem marca d'água."
run() { nome="$1"; img="$2"; msk="$3"; tam="$4"
  curl -sS https://api.openai.com/v1/images/edits -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F "model=gpt-image-1.5" -F "image[]=@$img" -F "mask=@$msk" -F "input_fidelity=high" \
    -F "size=$tam" -F "quality=high" -F "n=1" -F "prompt=$P" > "$nome.json"
  python3 - "$nome" <<'PY'
import json,sys,base64
n=sys.argv[1]; d=json.load(open(f"{n}.json"))
if "data" not in d: print("ERRO:", json.dumps(d.get("error",d))[:300]); sys.exit(1)
open(f"{n}.png","wb").write(base64.b64decode(d["data"][0]["b64_json"])); print("ok",n)
PY
  rm -f "$nome.json"; }
run bracos-cruzados-limpo retrato-bracos-cruzados.png mask-bracos.png 1024x1536
run tres-quartos-limpo retrato-tres-quartos.png mask-tres-quartos.png 1024x1024
echo concluído
