/**
 * Configuração central do site. Tudo que é texto fixo da marca,
 * links e dados do lançamento mora aqui para ser trocado num só lugar.
 *
 * A marca é "Leandro Campos". O domínio continua leandrowcampos.com.br
 * (o W é de Wesley, segundo nome; o domínio sem W não estava livre).
 */
export const site = {
  name: 'Leandro Campos',
  shortName: 'Leandro Campos',
  url: 'https://leandrowcampos.com.br',
  locale: 'pt_BR',
  lang: 'pt-BR',
  /** Posicionamento (26/10/2026): a marca é o conhecimento de um empreendedor de 15 anos; a IA é o tema da primeira série. */
  description:
    'Empreendedorismo, tecnologia e IA por quem opera uma empresa de verdade. Conteúdo, cursos e consultoria sobre negócios, tecnologia e gestão.',
  /** Título padrão da página inicial e do rodapé. */
  tagline: 'Empreendedorismo, tecnologia e IA por quem opera uma empresa de verdade',
  author: {
    name: 'Leandro Campos',
    role: 'Fundador da Nvoip',
    /** Bio curta de 3 linhas para o início e para "Sobre o autor". Fatos confirmados em 26/10/2026. */
    bioShort: [
      'Fundador da Nvoip, plataforma de telefonia e comunicação em nuvem com mais de 10 anos de operação e mais de 50 mil clientes atendidos.',
      'Reduziu o time de 70 para 10 pessoas com IA e automação de processos, sem perder clientes. Captou mais de R$ 3 milhões em duas rodadas com três fundos de venture capital.',
      'Quinze anos empreendendo em tecnologia, os últimos oito à frente de uma empresa 100% digital. Mentor do Inovativa Brasil por quatro anos.',
    ],
    /** Avatar quadrado (posts, caixa do autor, JSON-LD). */
    photo: '/images/leandro-perfil.jpg',
    /** Retrato vertical de meio corpo, fundo preto (herói do início e página Sobre). */
    portrait: '/images/leandro-retrato.jpg',
    /** Busto vertical, fundo preto (seção "Sobre o autor" da página de venda). */
    portraitBust: '/images/leandro-retrato-busto.jpg',
    email: 'contato@leandrowcampos.com.br',
  },
  company: {
    name: 'Nvoip',
    url: 'https://www.nvoip.com.br',
    /** Números de prova social da empresa, confirmados por Leandro em 26/10/2026. */
    proof: [
      { value: '70 → 10', label: 'pessoas no time, com IA' },
      { value: '50 mil+', label: 'clientes atendidos' },
      { value: '10+', label: 'anos de operação' },
    ],
  },
  social: {
    // [PLACEHOLDER] Confirmar handles.
    linkedin: 'https://www.linkedin.com/in/leandrowcampos',
    instagram: 'https://www.instagram.com/leandrowcampos',
    youtube: 'https://www.youtube.com/@leandrowcampos',
    twitter: '@leandrowcampos',
  },
  hotmart: {
    productId: '8764405',
  },
  launch: {
    // Carrinho aberto de 10 a 12/11/2026 (horário de Brasília).
    cartOpens: '2026-11-10T09:00:00-03:00',
    cartCloses: '2026-11-12T23:59:00-03:00',
    featuredEbook: 'ia-no-negocio',
  },
  /** Frentes do conteúdo (seção "O que você encontra aqui" e vitrine). O `icon` é um nome do Icon.astro. */
  topics: [
    { icon: 'compass', title: 'Empreendedorismo e gestão', text: 'Decidir com pouca informação, montar time, sobreviver às fases ruins e crescer sem perder o controle.' },
    { icon: 'code', title: 'Tecnologia e produto', text: 'O que pedir a quem desenvolve, o que custa de verdade (nuvem, licenças, retrabalho) e como não virar refém do fornecedor.' },
    { icon: 'target', title: 'Marketing e vendas', text: 'Posicionamento, funil, proposta e follow-up para empresa que precisa vender todo mês, não para campanha de prêmio.' },
    { icon: 'coins', title: 'Financeiro e processos', text: 'Caixa, cobrança, contratos com fornecedor e os processos que fazem a empresa rodar sem o dono em cada etapa.' },
    { icon: 'users', title: 'Pessoas', text: 'Contratar, desenvolver, dar feedback e desligar com respeito. E saber quando uma vaga não é a resposta.' },
    { icon: 'sparkles', title: 'IA aplicada', text: 'A primeira série. Agentes e prompts que assumem trabalho de verdade nas dez áreas da empresa, por quem fez isso na própria.' },
  ],
  /** Isca gratuita: PDF curto, uma tarefa por página, com o prompt pronto. */
  leadMagnet: {
    title: '12 tarefas da sua empresa que a IA já faz melhor que um estagiário',
    shortTitle: 'as 12 tarefas',
    cta: 'Baixar as 12 tarefas',
    description:
      'Um PDF curto, uma tarefa por página, com o prompt pronto para copiar. Doze coisas que a sua empresa já pode delegar à IA hoje, sem contratar ninguém.',
  },
  defaultOgImage: '/images/og-default.png',
} as const;

export type Site = typeof site;
