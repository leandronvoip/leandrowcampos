# Guia de estilo e brief dos artigos do blog (leandrowcampos.com.br)

Vale para todos os 24 artigos aprovados por Leandro em 27/10/2026 (lista em `pautas-blog-2026-10.md`).

## Quem escreve e para quem

- Autor: **Leandro Campos**, em primeira pessoa ("eu", "na minha empresa", "na Nvoip"). Fundador da Nvoip (telefonia e comunicação em nuvem: ligações, WhatsApp, SMS, API). Quinze anos empreendendo em tecnologia, os últimos oito à frente de uma empresa 100% digital. Mentor do Inovativa Brasil por quatro anos. Captou mais de R$ 3 milhões em duas rodadas com três fundos de venture capital. Reduziu o time de 70 para 10 pessoas com IA e automação de processos, sem perder clientes. Mais de 50 mil clientes atendidos, mais de 10 anos de operação. Usa IA no dia a dia há cerca de dois anos; 2026 foi o ano da virada.
- Leitor: dono, sócio ou gestor de pequena ou média empresa brasileira (2 a 50 pessoas), que já abriu o ChatGPT algumas vezes e quer resultado operacional. Não é programador. Tem pouco tempo. Busca no Google algo prático para resolver hoje.
- Tese da casa: **crescer sem contratar**. Toda demanda nova não precisa virar uma vaga: processo documentado + IA + pessoa que supervisiona.

## Voz

- Direta, de operador, sem jargão de consultoria. Frases curtas. Parágrafos de 2 a 4 linhas.
- Opinião clara ("eu faria X", "não compre Y antes de Z") em vez de "depende".
- Exemplos concretos de uma empresa real de atendimento e tecnologia; transpor para serviços, comércio e indústria leve quando couber.
- Sem promessas de ganho garantido, sem "revolucionário", sem "transforme", sem emojis, sem travessões (usar vírgula, ponto ou dois-pontos), sem parênteses longos.
- Português do Brasil revisado: acentuação, crase, concordância. Palavras técnicas em inglês só quando são o termo corrente (prompt, no-code, follow-up, onboarding).

## Fatos permitidos (não inventar outros)

Sobre Leandro e a Nvoip: só os do bloco "Quem escreve". Nenhum dado de cliente da Nvoip, nenhum nome de cliente, nenhum número financeiro da Nvoip além dos citados. Pode descrever processos internos em termos gerais (ex.: "nossa régua de cobrança tem quatro mensagens", "o painel semanal tem sete indicadores") sem valores.

Estatísticas externas permitidas, com a fonte no texto:
- Sebrae/Meta 2026: 52% dos pequenos negócios usaram IA nas últimas duas semanas; 38% dos que não têm plano para IA dizem não saber o que ela faz; 90% não mudaram o número de funcionários por causa da IA. Fonte: https://agenciasebrae.com.br/dados/pequenos-negocios-do-brasil-usam-mais-ia-que-os-norte-americanos-aponta-sebrae/
- Sebrae/FGV/Google: marketing é a finalidade nº 1 da IA em 59% das MPEs.
- ESET (WeLiveSecurity): só 39% das empresas brasileiras têm diretrizes de uso de IA. Fonte: https://www.welivesecurity.com/pt/seguranca-para-empresas/inteligencia-artificial-nas-empresas-da-proibicao-a-implementacao-de-politicas-de-uso/
- Locaweb/Sebrae PR: ~175 mil buscas/ano por "agentes de IA" no Brasil, crescimento de 22%.

Preços de ferramentas (ChatGPT, Gemini, Claude, n8n, ERPs, Meta WhatsApp): só citar depois de conferir na página oficial com WebSearch/WebFetch, sempre com "em outubro de 2026" e link da fonte. Se não conseguir conferir, escrever "consulte a página de preços" com o link, sem número. Encargos trabalhistas (INSS patronal, FGTS, férias, 13º): usar as alíquotas legais vigentes e dizer que o cálculo é aproximado; indicar validação com o contador.

## Estrutura de cada artigo (MDX)

Arquivo: `src/content/posts/<slug>.mdx`. Frontmatter:

```yaml
---
title: "Título com a palavra-chave principal (até ~65 caracteres)"
description: "Meta description de 140 a 180 caracteres, com a palavra-chave e a promessa concreta."
publishedAt: 2026-10-27T10:00:00-03:00   # ver a hora de cada artigo na lista de slugs
tags: ["ia", "atendimento"]              # 2 a 4 tags em minúsculas, da lista: ia, agentes, prompts, whatsapp, atendimento, vendas, marketing, financeiro, pessoas, gestão, processos, tecnologia, automação, n8n, custos, indicadores, modelos
draft: false
---
```

Corpo, nesta ordem:

1. **Abertura** (3 a 5 parágrafos, sem título): a situação do leitor, uma frase com a experiência do Leandro, o que o artigo entrega. A primeira frase já responde à busca.
2. **Seções `##`** (5 a 9). A primeira palavra-chave aparece em pelo menos dois `##`. Usar `###` para subitens. O banner do e-book entra sozinho antes do terceiro `##`; não escrever nada sobre "banner".
3. **Prompts e instruções** sempre em bloco de código com a linguagem `text`, começando com `# Prompt:` ou `# Instrução do agente:` na primeira linha, prontos para copiar, com campos entre colchetes para o leitor preencher ([nome da empresa], [produto]). Mínimo de 1 prompt por artigo; artigos de "prompts" têm a quantidade do título.
4. **Tabelas** em Markdown quando comparar (custo, ferramentas, critérios).
5. **Modelos para baixar** (POP, descrição de cargo, política, planilha, scripts): o conteúdo do modelo vai completo no próprio artigo (em bloco de código `text` ou em seções) e também num arquivo `public/downloads/<slug>-<nome>.md` com o mesmo conteúdo, linkado como "baixar o modelo (.md, abre em qualquer editor)". Não prometer .docx, .xlsx ou PDF.
6. **Seção `## Perguntas frequentes`** com 3 a 5 perguntas em `###` e resposta de 2 a 4 linhas (alvo: "As pessoas também perguntam").
7. **Fecho** `## Por onde começar` (ou título equivalente): 3 passos para hoje + ligação natural com o e-book e com as 12 tarefas gratuitas (ver links internos). Sem "não deixe de", sem CTA agressivo.

Tamanho: o indicado na pauta (1.800 a 3.500 palavras). Nenhum placeholder, nenhum "[inserir]" fora dos campos de prompt, nenhum "em breve".

## Links obrigatórios

Internos (caminhos relativos, com barra final):
- E-book: `/ebook/ia-no-negocio/` com âncora natural ("no e-book IA no Negócio eu mostro o agente completo", "capítulo de Atendimento do manual"). 1 a 2 vezes no texto, além do banner automático.
- Isca gratuita: `/gratis/` ("as 12 tarefas que a IA já faz melhor que um analista", PDF gratuito). 1 vez, de preferência no fecho.
- Sobre: `/sobre/` quando citar a trajetória, no máximo 1 vez.
- Outros artigos do blog: 2 a 4 links para slugs da lista abaixo, com âncora descritiva. Só linkar slugs da lista (todos existirão).

Nvoip (Leandro usa e recomenda; linkar sempre que o assunto for WhatsApp, SMS, ligação, telefonia, API, automação de canais, atendimento, cobrança por mensagem, n8n/Make/Zapier com canais). 2 a 5 links por artigo, naturais, com a frase "eu uso a Nvoip, que fundei, e recomendo" ou equivalente uma vez por artigo quando citar produto. Só estas URLs:
- Site: https://www.nvoip.com.br/
- WhatsApp (API oficial): https://www.nvoip.com.br/whatsapp/ · artigo https://www.nvoip.com.br/blog/whatsapp-api/ · https://www.nvoip.com.br/blog/whatsapp-business/ · cobrança pelo WhatsApp https://www.nvoip.com.br/blog/cobranca-whatsapp-business-outubro-2026/ · reduzir mensagens https://www.nvoip.com.br/blog/como-reduzir-mensagens-whatsapp-sem-perder-qualidade/
- SMS: https://www.nvoip.com.br/sms/ · https://www.nvoip.com.br/blog/api-de-sms/ · SMS ou WhatsApp https://www.nvoip.com.br/blog/sms-ou-whatsapp/
- API de comunicação: https://www.nvoip.com.br/api/ · https://www.nvoip.com.br/blog/saiba-o-que-e-api-de-comunicacao/ · https://www.nvoip.com.br/blog/o-que-voce-precisa-saber-sobre-api/
- Automações e integrações: https://www.nvoip.com.br/automacoes/ · n8n https://www.nvoip.com.br/integracoes/automacao/n8n/ e https://www.nvoip.com.br/blog/como-integrar-n8n-com-canais-de-atendimento/ · Make https://www.nvoip.com.br/integracoes/automacao/make/ e https://www.nvoip.com.br/blog/como-integrar-make-com-telefonia-e-whatsapp/ · Zapier https://www.nvoip.com.br/integracoes/automacao/zapier/ · automatizar atendimento https://www.nvoip.com.br/blog/automatizar-atendimento-whatsapp-sms-ligacoes/
- MCP Server (IA conectada à telefonia): https://www.nvoip.com.br/mcp-server/ · https://www.nvoip.com.br/blog/mcp-server-nvoip/ · https://www.nvoip.com.br/blog/o-que-e-mcp-server/
- Chatbot e voicebot: https://www.nvoip.com.br/chatbot/ · https://www.nvoip.com.br/voicebot/ · https://www.nvoip.com.br/blog/chatbots/ · https://www.nvoip.com.br/blog/voicebot/ · IA conversacional https://www.nvoip.com.br/blog/ia-conversacional/ · URA https://www.nvoip.com.br/blog/o-que-e-ura/
- Atendimento e vendas (blog): https://www.nvoip.com.br/blog/atendimento-ao-cliente/ · https://www.nvoip.com.br/blog/script-de-atendimento/ · https://www.nvoip.com.br/blog/script-de-vendas-por-telefone/ · https://www.nvoip.com.br/blog/funil-de-vendas/ · https://www.nvoip.com.br/blog/equipe-de-sdr/ · https://www.nvoip.com.br/blog/inside-sales/ · https://www.nvoip.com.br/blog/prospeccao-de-clientes/ · https://www.nvoip.com.br/blog/metricas-de-vendas/ · https://www.nvoip.com.br/blog/metricas-reais-x-metricas-de-vaidade/ · https://www.nvoip.com.br/blog/perfil-do-cliente-ideal/ · https://www.nvoip.com.br/blog/pesquisa-de-satisfacao/ · https://www.nvoip.com.br/blog/reclamacoes-dos-clientes/ · https://www.nvoip.com.br/blog/diminuir-a-taxa-de-churn/ · https://www.nvoip.com.br/blog/upsell-e-cross-sell/ · https://www.nvoip.com.br/blog/tmr/ · https://www.nvoip.com.br/blog/first-call-resolution/
- Cobrança: https://www.nvoip.com.br/blog/regua-de-cobranca/ · https://www.nvoip.com.br/blog/gestao-de-cobrancas/
- CRM e integrações: https://www.nvoip.com.br/blog/crm/ · https://www.nvoip.com.br/blog/diferenca-entre-erp-e-crm/ · https://www.nvoip.com.br/blog/telefonia-integrada-ao-crm/ · https://www.nvoip.com.br/blog/integracao-de-sistemas/ · HubSpot https://www.nvoip.com.br/integracoes/crms/hubspot/ · Pipedrive https://www.nvoip.com.br/integracoes/crms/pipedrive/ · RD Station https://www.nvoip.com.br/integracoes/crms/rd-station/ · Kommo https://www.nvoip.com.br/integracoes/crms/kommo/
- Gestão e tecnologia: https://www.nvoip.com.br/blog/saas/ · https://www.nvoip.com.br/blog/business-intelligence/ · https://www.nvoip.com.br/blog/o-que-e-lgpd/ · https://www.nvoip.com.br/blog/inteligencia-artificial/ · https://www.nvoip.com.br/blog/transcricao-de-audio/ · https://www.nvoip.com.br/blog/speech-analytics/ · https://www.nvoip.com.br/blog/text-to-speech/ · https://www.nvoip.com.br/blog/gravacao-de-ligacao/ · https://www.nvoip.com.br/blog/widget-de-atendimento-para-site/ · https://www.nvoip.com.br/blog/omnichannel/ · https://www.nvoip.com.br/blog/gastos-com-telefonia/ · https://www.nvoip.com.br/blog/reduzir-a-conta-de-telefone/
- Planos: https://www.nvoip.com.br/planos/ · startups https://www.nvoip.com.br/nvoip-para-startups/

Externos: fontes citadas (Sebrae, ESET, páginas oficiais de preço). Sem links para concorrentes diretos da Nvoip em telefonia/WhatsApp (Zenvia, Twilio, Take Blip, SleekFlow, Z-API etc.); ferramentas de IA, ERPs e no-code podem ser linkadas na página oficial.

## Slugs, horários e lotes (todos os 24)

Lote 1 (publishedAt 2026-10-27, horários 10:00 a 17:00 -03:00, nesta ordem):
1. `como-criar-agente-de-ia-para-whatsapp` 10:00
2. `como-usar-ia-na-minha-empresa` 11:00
3. `como-criar-agente-de-ia-no-chatgpt-claude-gemini` 12:00
11. `como-reduzir-custos-na-empresa-sem-demitir` 13:00
12. `como-organizar-uma-empresa-pequena` 14:00
23. `modelo-de-pop-procedimento-operacional-padrao` 15:00
24. `descricao-de-cargo-modelo` 16:00
16. `n8n-o-que-e-e-automacoes-para-pme` 17:00

Lote 2 (publishedAt 2026-10-28, 09:00 a 16:00 -03:00):
4. `prompts-para-empresas` 09:00
5. `prompts-para-atendimento-ao-cliente` 10:00
9. `chatgpt-gemini-ou-claude-qual-ia-usar-na-empresa` 11:00
13. `indicadores-de-gestao-para-pequenas-empresas` 12:00
14. `faturamento-por-funcionario` 13:00
22. `quanto-custa-um-funcionario-para-a-empresa` 14:00
19. `script-de-vendas-whatsapp` 15:00
10. `politica-de-uso-de-ia-na-empresa-modelo` 16:00

Lote 3 (publishedAt 2026-10-29, 09:00 a 16:00 -03:00):
6. `prompts-para-vendas` 09:00
7. `prompts-para-rh` 10:00
8. `prompts-para-financeiro` 11:00
15. `como-delegar-tarefas-na-empresa` 12:00
17. `erp-para-pequenas-empresas-como-escolher` 13:00
18. `como-criar-um-sistema-sem-programar-no-code` 14:00
20. `prompts-para-marketing-digital` 15:00
21. `prompts-para-instagram` 16:00

## Checagem antes de entregar

- `npm run build` sem erro (frontmatter válido, MDX válido: nenhum `{` ou `<` solto fora de bloco de código; em MDX, `<` e `{` no texto corrente quebram o build, então escrever "menor que" ou usar bloco de código).
- Nenhum link interno fora da lista; nenhum link da Nvoip fora da lista; nenhum link externo não verificado.
- Acentuação revisada. Nenhum travessão, nenhum emoji, nenhum placeholder.
- Palavra-chave principal no título, na description, no primeiro parágrafo e em dois `##`.
