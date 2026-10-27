/**
 * Configuração central do site. Tudo que é texto fixo da marca,
 * links e dados do lançamento mora aqui para ser trocado num só lugar.
 */
export const site = {
  name: 'Leandro W. Campos',
  shortName: 'Leandro W. Campos',
  url: 'https://leandrowcampos.com.br',
  locale: 'pt_BR',
  lang: 'pt-BR',
  description:
    'IA aplicada a pequenas e médias empresas, por quem construiu uma empresa de verdade. E-books práticos, sem hype.',
  author: {
    name: 'Leandro W. Campos',
    role: 'Fundador da Nvoip',
    // [PLACEHOLDER] Bio curta de 3 linhas para o início e para "Sobre o autor".
    bioShort: [
      'Fundador da Nvoip, plataforma de telefonia e comunicação em nuvem com mais de uma década de operação.',
      'Aplica IA no dia a dia de uma empresa real: atendimento, vendas, financeiro e operação.',
      'Escreve para o empreendedor que quer resultado prático, não demonstração bonita.',
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
    // [PLACEHOLDER] Números de prova social da empresa. Confirmar antes de publicar.
    proof: [
      { value: '10+', label: 'anos de operação' },
      { value: '[PLACEHOLDER]', label: 'clientes atendidos' },
      { value: '[PLACEHOLDER]', label: 'chamadas por mês' },
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
  defaultOgImage: '/images/og-default.png',
} as const;

export type Site = typeof site;
