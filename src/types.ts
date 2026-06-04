export interface User {
  id: string;
  name: string;
  email: string;
  role: 'comprador' | 'vendedor' | 'admin' | 'visitante';
  balance: number;
}

export interface Sticker {
  id: string;
  playerName: string;
  team: string;
  code: string; // e.g. BRA-10, ARG-10
  edition: string; // Copa 2022, Copa 2026
  condition: 'Impecável' | 'Nova' | 'Usada';
  rarity: 'Comum' | 'Raro' | 'Lendário' | 'Borda de Ouro';
  price: number;
  sellerId: string;
  sellerName: string;
  imageUrl?: string;
  approved: boolean; // admin approval
  isTradeable: boolean;
  stickerStyleId?: number; // visual styling selection
}

export interface TradeProposal {
  id: string;
  proposerId: string;
  proposerName: string;
  receiverId: string;
  receiverName: string;
  offeredStickers: Sticker[];
  requestedStickers: Sticker[];
  status: 'Pendente' | 'Aceita' | 'Recusada' | 'Cancelada';
  createdAt: string;
}

export interface Negotiation {
  id: string;
  type: 'Compra' | 'Troca';
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  items: string; // Summary of items
  value: number;
  // Step: 1 (Aguardando Envio), 2 (Em Trânsito para A Banca), 3 (Em Inspeção), 4 (Aprovado e Enviado ao Comprador), 5 (Entregue / Confirmação), 6 (Concluído)
  step: number;
  status: 'Aguardando postagem pelo vendedor' | 'Recebido pela Banca (Em Triagem)' | 'Inspeção Aprovada - Produto em Trânsito para Comprador' | 'Aguardando confirmação de recebimento' | 'Concluído' | 'Em Disputa';
  createdAt: string;
  chatMessages: ChatMessage[];
  trackingId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'Comprador' | 'Vendedor' | 'Suporte' | 'Banca';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeEscrows: number;
  totalVolume: number;
  pendingApprovals: number;
  openDisputes: number;
}

export interface AppNotification {
  id: string;
  userId: string; // recipient of the notification, or 'all_users'
  text: string;
  type: 'proposta' | 'envio' | 'pagamento' | 'inspeção' | 'geral';
  title: string;
  read: boolean;
  createdAt: string;
  linkPage?: string; // which page to redirect to, e.g., 'negociacao', 'dashboard', 'admin'
}
