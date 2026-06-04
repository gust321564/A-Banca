import { User, Sticker, TradeProposal, Negotiation, AppNotification } from './types';

export const USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Thiago Admin',
    email: 'admin@abanca.com',
    role: 'admin',
    balance: 1450.00
  },
  {
    id: 'user_vendedor',
    name: 'Marcos Vendedor',
    email: 'vendedor@abanca.com',
    role: 'vendedor',
    balance: 380.00
  },
  {
    id: 'user_comprador',
    name: 'Enzo Comprador',
    email: 'comprador@abanca.com',
    role: 'comprador',
    balance: 850.00
  }
];

export const INITIAL_STICKERS: Sticker[] = [
  {
    id: 'st_neymar',
    playerName: 'Neymar Jr',
    team: 'Brasil',
    code: 'BRA-10',
    edition: 'Copa 2022',
    condition: 'Impecável',
    rarity: 'Borda de Ouro',
    price: 490.00,
    sellerId: 'user_vendedor',
    sellerName: 'Marcos Vendedor',
    approved: true,
    isTradeable: true,
    stickerStyleId: 1
  },
  {
    id: 'st_messi',
    playerName: 'Lionel Messi',
    team: 'Argentina',
    code: 'ARG-10',
    edition: 'Copa 2022',
    condition: 'Impecável',
    rarity: 'Borda de Ouro',
    price: 850.00,
    sellerId: 'user_vendedor',
    sellerName: 'Marcos Vendedor',
    approved: true,
    isTradeable: true,
    stickerStyleId: 2
  },
  {
    id: 'st_cr7',
    playerName: 'Cristiano Ronaldo',
    team: 'Portugal',
    code: 'POR-07',
    edition: 'Copa 2022',
    condition: 'Nova',
    rarity: 'Lendário',
    price: 590.00,
    sellerId: 'user_admin',
    sellerName: 'Thiago Admin',
    approved: true,
    isTradeable: true,
    stickerStyleId: 3
  },
  {
    id: 'st_mbappe',
    playerName: 'Kylian Mbappé',
    team: 'França',
    code: 'FRA-10',
    edition: 'Copa 2022',
    condition: 'Impecável',
    rarity: 'Lendário',
    price: 240.00,
    sellerId: 'user_vendedor',
    sellerName: 'Marcos Vendedor',
    approved: true,
    isTradeable: true,
    stickerStyleId: 4
  },
  {
    id: 'st_vini',
    playerName: 'Vinicius Jr',
    team: 'Brasil',
    code: 'BRA-20',
    edition: 'Copa 2026',
    condition: 'Nova',
    rarity: 'Raro',
    price: 180.00,
    sellerId: 'user_admin',
    sellerName: 'Thiago Admin',
    approved: true,
    isTradeable: true,
    stickerStyleId: 5
  },
  {
    id: 'st_modric',
    playerName: 'Luka Modrić',
    team: 'Croácia',
    code: 'CRO-10',
    edition: 'Copa 2022',
    condition: 'Usada',
    rarity: 'Raro',
    price: 85.00,
    sellerId: 'user_vendedor',
    sellerName: 'Marcos Vendedor',
    approved: true,
    isTradeable: true,
    stickerStyleId: 6
  },
  {
    id: 'st_debruyne',
    playerName: 'Kevin De Bruyne',
    team: 'Bélgica',
    code: 'BEL-07',
    edition: 'Copa 2022',
    condition: 'Nova',
    rarity: 'Comum',
    price: 35.00,
    sellerId: 'user_comprador',
    sellerName: 'Enzo Comprador',
    approved: true,
    isTradeable: true,
    stickerStyleId: 1
  },
  {
    id: 'st_richarlison',
    playerName: 'Richarlison',
    team: 'Brasil',
    code: 'BRA-09',
    edition: 'Copa 2022',
    condition: 'Impecável',
    rarity: 'Comum',
    price: 15.00,
    sellerId: 'user_comprador',
    sellerName: 'Enzo Comprador',
    approved: true,
    isTradeable: true,
    stickerStyleId: 3
  }
];

export const INITIAL_NEGOTIATIONS: Negotiation[] = [
  {
    id: 'neg_001',
    type: 'Compra',
    buyerId: 'user_comprador',
    buyerName: 'Enzo Comprador',
    sellerId: 'user_vendedor',
    sellerName: 'Marcos Vendedor',
    items: 'Kylian Mbappé (FRA-10) - Lendário',
    value: 240.00,
    step: 3, // Em Inspeção pela Banca
    status: 'Recebido pela Banca (Em Triagem)',
    createdAt: '2026-06-02T14:30:00Z',
    trackingId: 'BR-BANCA-9281A',
    chatMessages: [
      {
        id: 'msg_1',
        sender: 'Banca',
        senderName: 'Intermediador Privado',
        text: 'A transação #neg_001 foi criada! R$ 240.00 foram retidos em nossa conta de garantia (escrow). Marcos Vendedor já despachou o item para nossa filial física.',
        timestamp: '14:32'
      },
      {
        id: 'msg_2',
        sender: 'Vendedor',
        senderName: 'Marcos Vendedor',
        text: 'Olá Enzo! Enviei ontem mesmo. A embalagem foi dupla com protetor rígido para não amassar no trajeto.',
        timestamp: '15:10'
      },
      {
        id: 'msg_3',
        sender: 'Comprador',
        senderName: 'Enzo Comprador',
        text: 'Maravilha, Marcos! Fico no aguardo do selo de aprovação da banca. Essa figurinha vai fechar meu trio!',
        timestamp: '15:25'
      },
      {
        id: 'msg_4',
        sender: 'Banca',
        senderName: 'Inspeção Física',
        text: 'ATUALIZAÇÃO: Pacote entregue em nosso centro de triagem. Nossos peritos estão avaliando a integridade física e o selo holográfico para atestar que é 100% autêntica.',
        timestamp: '10:05'
      }
    ]
  },
  {
    id: 'neg_002',
    type: 'Compra',
    buyerId: 'user_comprador',
    buyerName: 'Enzo Comprador',
    sellerId: 'user_vendedor',
    sellerName: 'Marcos Vendedor',
    items: 'Lionel Messi (ARG-10) - Borda de Ouro',
    value: 850.00,
    step: 1, // Aguardando Envio
    status: 'Aguardando postagem pelo vendedor',
    createdAt: '2026-06-03T18:15:00Z',
    trackingId: 'BR-BANCA-1022X',
    chatMessages: [
      {
        id: 'msg_1',
        sender: 'Banca',
        senderName: 'Intermediador Privado',
        text: 'O pagamento por Lionel Messi (R$ 850.00) foi recebido e garantido pela Banca. Vendedor: por favor, realize a postagem em até 48h úteis.',
        timestamp: '18:16'
      }
    ]
  }
];

export const INITIAL_PROPOSALS: TradeProposal[] = [
  {
    id: 'prop_001',
    proposerId: 'user_comprador',
    proposerName: 'Enzo Comprador',
    receiverId: 'user_vendedor',
    receiverName: 'Marcos Vendedor',
    offeredStickers: [
      {
        id: 'st_debruyne',
        playerName: 'Kevin De Bruyne',
        team: 'Bélgica',
        code: 'BEL-07',
        edition: 'Copa 2022',
        condition: 'Nova',
        rarity: 'Comum',
        price: 35.00,
        sellerId: 'user_comprador',
        sellerName: 'Enzo Comprador',
        approved: true,
        isTradeable: true,
        stickerStyleId: 1
      }
    ],
    requestedStickers: [
      {
        id: 'st_modric',
        playerName: 'Luka Modrić',
        team: 'Croácia',
        code: 'CRO-10',
        edition: 'Copa 2022',
        condition: 'Usada',
        rarity: 'Raro',
        price: 85.00,
        sellerId: 'user_vendedor',
        sellerName: 'Marcos Vendedor',
        approved: true,
        isTradeable: true,
        stickerStyleId: 6
      }
    ],
    status: 'Pendente',
    createdAt: '2026-06-03T09:40:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'not_1',
    userId: 'user_vendedor',
    title: 'Nova Proposta de Troca',
    text: 'Enzo Comprador enviou uma proposta: Luka Modrić por seu Kevin De Bruyne.',
    type: 'proposta',
    read: false,
    createdAt: '2026-06-03T09:40:00Z',
    linkPage: 'dashboard'
  },
  {
    id: 'not_2',
    userId: 'user_comprador',
    title: 'Pagamento Custodiado',
    text: 'Seu pagamento de R$ 240,00 pelo cromo de Kylian Mbappé foi garantido fiduciariamente d\'A Banca.',
    type: 'pagamento',
    read: true,
    createdAt: '2026-06-02T14:30:00Z',
    linkPage: 'negociacao'
  },
  {
    id: 'not_3',
    userId: 'user_vendedor',
    title: 'Inspeção Física Agendada',
    text: 'O pacote da transação #neg_001 deu entrada no centro de triagem d\'A Banca.',
    type: 'inspeção',
    read: false,
    createdAt: '2026-06-04T10:05:00Z',
    linkPage: 'negociacao'
  },
  {
    id: 'not_4',
    userId: 'user_comprador',
    title: 'Anúncio Autorizado',
    text: 'Seu cromo Neymar Jr (BRA-10) passou pela triagem digital e está listado para negociação pública.',
    type: 'geral',
    read: true,
    createdAt: '2026-06-04T11:00:00Z',
    linkPage: 'dashboard'
  },
  {
    id: 'not_5',
    userId: 'user_comprador',
    title: 'Nova Proposta Recebida',
    text: 'Você recebeu um convite para câmbio de figurinhas de Marcos Vendedor.',
    type: 'proposta',
    read: false,
    createdAt: '2026-06-04T12:30:00Z',
    linkPage: 'dashboard'
  }
];
