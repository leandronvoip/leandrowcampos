# Painel semanal: 7 indicadores de gestão para pequenas empresas

Modelo de planilha do artigo "Indicadores de gestão para pequenas empresas: os 7 que o dono deve olhar toda semana", de Leandro Campos (leandrowcampos.com.br). Abre em qualquer editor; copie a estrutura para o Google Planilhas ou o Excel.

## Como montar

1. Crie uma aba chamada `Painel`. Cada linha é uma semana. A linha 1 tem os cabeçalhos abaixo; os dados começam na linha 2.
2. Crie uma aba chamada `Config` com três valores: `B1` = meta de faturamento mensal; `B2` = custo fixo mensal; `B3` = custo médio da hora de uma pessoa do time (salário com encargos dividido por 176).
3. Preencha toda sexta-feira as colunas de entrada (marcadas com "entrada"). As colunas de fórmula se calculam sozinhas.
4. Cole as últimas 5 linhas no prompt do relatório semanal (no fim deste arquivo) para receber o resumo em 12 linhas.

## Colunas da aba Painel

| Coluna | Cabeçalho | Tipo | Fórmula (linha 2) ou instrução de preenchimento |
|---|---|---|---|
| A | Semana (data da sexta) | entrada | Data de fechamento da semana |
| B | Faturamento da semana (R$) | entrada | Soma do que foi faturado de segunda a sexta |
| C | Meta semanal (R$) | fórmula | `=Config!$B$1/4,33` |
| D | Variação vs meta (%) | fórmula | `=B2/C2-1` |
| E | Média das últimas 4 semanas (R$) | fórmula | `=MÉDIA(B2:B5)` quando a planilha está em ordem decrescente de data; se a ordem for crescente, use `=MÉDIA(DESLOC(B2;-3;0;4;1))` a partir da linha 5 |
| F | Saldo em caixa hoje (R$) | entrada | Soma de todas as contas bancárias e caixa físico |
| G | A receber nas próximas 8 semanas (R$) | entrada | Soma dos recebíveis com vencimento em até 56 dias |
| H | A pagar nas próximas 8 semanas (R$) | entrada | Soma das contas, folha, impostos e fornecedores em até 56 dias |
| I | Caixa projetado em 8 semanas (R$) | fórmula | `=F2+G2-H2` |
| J | Meses de custo fixo em caixa | fórmula | `=I2/Config!$B$2` |
| K | Valor vencido há mais de 30 dias (R$) | entrada | Soma dos títulos em aberto com atraso maior que 30 dias |
| L | Faturado nos últimos 90 dias (R$) | entrada | Soma do faturamento das 13 semanas anteriores |
| M | Inadimplência (%) | fórmula | `=K2/L2` |
| N | Conversas iniciadas na semana | entrada | Mensagens novas de clientes no WhatsApp, e-mail e telefone |
| O | Soma dos tempos até a primeira resposta (minutos) | entrada | Exporte do sistema de atendimento ou anote em amostra de 20 conversas |
| P | Tempo médio da primeira resposta (minutos) | fórmula | `=O2/N2` |
| Q | Propostas enviadas na semana | entrada | Orçamentos e propostas formais enviados |
| R | Propostas fechadas na semana | entrada | Propostas aceitas, independentemente de quando foram enviadas |
| S | Conversão de propostas (%) | fórmula | `=R2/Q2` |
| T | Pessoas na operação | entrada | Funcionários, sócios que trabalham e terceirizados fixos, em equivalente a tempo integral |
| U | Faturamento por pessoa no mês (R$) | fórmula | `=(B2*4,33)/T2` |
| V | Horas feitas por IA na semana | entrada | Soma de (volume de cada tarefa automatizada x minutos que a tarefa levava com uma pessoa) dividido por 60 |
| W | Valor das horas de IA (R$) | fórmula | `=V2*Config!$B$3` |

Observações:

- Nas fórmulas, o separador de argumentos é `;` no Google Planilhas e no Excel em português. Se a sua planilha estiver em inglês, troque por `,` e `MÉDIA` por `AVERAGE`, `DESLOC` por `OFFSET`.
- Formate D, M e S como porcentagem, e B, C, E, F, G, H, I, K, L, U e W como moeda.
- Para a coluna V, mantenha uma aba `Tarefas IA` com três colunas: tarefa, minutos que levava com uma pessoa, volume na semana. A soma de (minutos x volume) / 60 entra em V.

## Metas de referência (ajuste para o seu negócio)

| Indicador | Referência que uso | Quando acender o alerta |
|---|---|---|
| Faturamento vs meta | Variação entre -10% e +10% | Duas semanas seguidas abaixo de -10% |
| Caixa projetado | Pelo menos 1 mês de custo fixo (J maior ou igual a 1) | J abaixo de 1 em qualquer semana das próximas 8 |
| Inadimplência | Abaixo de 3% em serviço recorrente; abaixo de 5% em comércio a prazo | Acima de 5% ou subindo por 3 semanas |
| Tempo da primeira resposta | Menos de 5 minutos no horário comercial com agente; menos de 60 minutos sem agente | Acima de 60 minutos |
| Conversão de propostas | Entre 20% e 30% em venda consultiva | Abaixo de 15% por 4 semanas |
| Faturamento por pessoa | Crescer a cada trimestre | Cair por 2 trimestres seguidos |
| Horas de IA | Crescer a cada mês enquanto houver tarefa repetitiva por automatizar | Estagnar com tarefas repetitivas ainda manuais |

## Prompt do relatório semanal

```text
# Prompt: relatório semanal dos 7 indicadores
Abaixo estão as últimas 5 linhas da minha planilha de indicadores, com os cabeçalhos. A linha mais recente é a semana que fechou hoje.
Metas: faturamento semanal [valor]; caixa projetado nunca abaixo de 1 mês de custo fixo ([valor]); inadimplência abaixo de [3%]; primeira resposta em menos de [5] minutos; conversão de propostas entre 20% e 30%; faturamento por pessoa crescendo; horas de IA crescendo.
Escreva um relatório de até 12 linhas, sem introdução e sem adjetivos:
1) os indicadores que melhoraram e os que pioraram em relação à semana anterior, com os números;
2) o indicador que mais preocupa, por quê, e uma hipótese de causa;
3) 3 ações para a próxima semana, cada uma com responsável sugerido pela função (atendimento, comercial, financeiro, dono);
4) uma pergunta que eu deveria fazer ao time na reunião de segunda.
Se algum dado estiver faltando ou parecer errado (por exemplo, inadimplência negativa), aponte antes de analisar.
Dados: [colar as 5 linhas com cabeçalhos]
```
