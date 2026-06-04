import { useState } from 'react';
import { Sticker, User, Negotiation, TradeProposal } from '../types';
import StickerCard from './StickerCard';
import { Search, SlidersHorizontal, ArrowLeftRight, Coins, RefreshCw, Layers, ShieldAlert, ArrowUpRight, HelpCircle, Heart, Camera, MessageSquare, Award, TrendingUp } from 'lucide-react';

import TinderMatch from './TinderMatch';
import ScannerAlbum from './ScannerAlbum';
import WishlistPage from './WishlistPage';
import GroupRooms from './GroupRooms';
import GamificationPage from './GamificationPage';
import MarketDynamics from './MarketDynamics';

interface DashboardProps {
  currentUser: User;
  stickers: Sticker[];
  negotiations: Negotiation[];
  proposals: TradeProposal[];
  onBuySticker: (sticker: Sticker) => void;
  onNavigate: (page: string) => void;
  onInitTrade: (targetSticker?: Sticker) => void;
  onAcceptProposal: (proposalId: string) => void;
  onDeclineProposal: (proposalId: string) => void;
  onAddProposal: (newProposal: Omit<TradeProposal, 'id' | 'proposerId' | 'proposerName' | 'status' | 'createdAt'>) => void;
}

export default function Dashboard({
  currentUser,
  stickers,
  negotiations,
  proposals,
  onBuySticker,
  onNavigate,
  onInitTrade,
  onAcceptProposal,
  onDeclineProposal,
  onAddProposal
}: DashboardProps) {
  
  // Tab states for dashboard content
  const [activeTab, setActiveTab] = useState<
    'mercado' | 'colecao' | 'negociacoes' | 'propostas' | 'tinder-match' | 'scanner-album' | 'wishlist' | 'grupos-troca' | 'missoes-ranking' | 'mercado-dinamico'
  >('mercado');

  // Search and Filter states
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Todos');
  const [selectedRarity, setSelectedRarity] = useState('Todas');
  const [sortBy, setSortBy] = useState('raro-dec');

  // Available unique teams for filter lists
  const availableTeams = ['Todos', ...Array.from(new Set(stickers.map(s => s.team)))];
  const availableRarities = ['Todas', 'Comum', 'Raro', 'Lendário', 'Borda de Ouro'];

  // Filter stickers in the marketplace (excluding those already belonging to current user unless in 'colecao' tab, and checking approved status)
  const marketStickers = stickers.filter(s => s.approved && s.sellerId !== currentUser.id);
  const myStickers = stickers.filter(s => s.sellerId === currentUser.id);

  // Apply filters
  const applyFilters = (list: Sticker[]) => {
    let filtered = [...list];

    if (search.trim() !== '') {
      filtered = filtered.filter(s => s.playerName.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedTeam !== 'Todos') {
      filtered = filtered.filter(s => s.team === selectedTeam);
    }

    if (selectedRarity !== 'Todas') {
      filtered = filtered.filter(s => s.rarity === selectedRarity);
    }

    // Sort options
    if (sortBy === 'preco-cres') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'preco-dec') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'raro-dec') {
      const weight = { 'Borda de Ouro': 4, 'Lendário': 3, 'Raro': 2, 'Comum': 1 };
      filtered.sort((a, b) => (weight[b.rarity] || 0) - (weight[a.rarity] || 0));
    }

    return filtered;
  };

  const displayedMarketStickers = applyFilters(marketStickers);
  const displayedMyStickers = applyFilters(myStickers);

  // Active user related negotiations
  const myNegotiations = negotiations.filter(n => n.buyerId === currentUser.id || n.sellerId === currentUser.id);
  const pendingSentProposals = proposals.filter(p => p.proposerId === currentUser.id);
  const pendingReceivedProposals = proposals.filter(p => p.receiverId === currentUser.id && p.status === 'Pendente');

  return (
    <div className="flex-1 bg-zinc-950/20 pt-6 pb-24 px-4 max-w-7xl mx-auto w-full">
      
      {/* Upper overview widgets banner */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        
        {/* Wallet Balance widget */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden border-l-2 border-l-[#C9A84C]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">Carteira Escrow</span>
              <span className="text-2xl font-black text-white font-mono mt-2 block">
                R$ {currentUser.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="p-2.5 rounded-lg bg-yellow-950/60 border border-[#C9A84C]/25 text-[#E8C96A]">
              <Coins className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-light">Garantia ativa em compras</span>
            <button
              onClick={() => alert(`Funcionalidade do Pix de Depósito/Retirada simulado. Seu saldo atual é R$ ${currentUser.balance.toFixed(2)}.`)}
              className="text-[#E8C96A] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              Adicionar Saldo <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Collection stats widget */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">Minha Coleção</span>
              <span className="text-2xl font-black text-white font-mono mt-2 block">
                {myStickers.length} <span className="text-xs text-zinc-500 font-sans font-normal">figurinhas</span>
              </span>
            </div>
            <span className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Layers className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-light">{myStickers.filter(s => s.approved).length} anunciadas à venda</span>
            <button
              onClick={() => onNavigate('vender')}
              className="text-[#E8C96A] font-bold hover:underline cursor-pointer"
            >
              Anunciar Novo +
            </button>
          </div>
        </div>

        {/* Active negotiations / Intermediations tracker */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">Negociações</span>
              <span className="text-2xl font-black text-white font-mono mt-2 block">
                {myNegotiations.length} <span className="text-xs text-zinc-400 font-sans font-normal">ativas</span>
              </span>
            </div>
            <span className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[#E8C96A]">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-light">Protegido pela intermediação física</span>
            <button
              onClick={() => {
                if (myNegotiations.length > 0) {
                  onNavigate('negociacao');
                } else {
                  alert('Você não tem nenhuma negociação ativa no momento. Faça uma compra ou realize uma troca no mercado!');
                }
              }}
              className="text-[#E8C96A] font-bold hover:underline cursor-pointer"
            >
              Ver Linha do Tempo
            </button>
          </div>
        </div>

        {/* Pending received trading proposals list summary */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">Trocas Recebidas</span>
              <span className="text-2xl font-black text-white font-mono mt-2 block">
                {pendingReceivedProposals.length} <span className="text-xs text-zinc-400 font-sans font-normal">pendentes</span>
              </span>
            </div>
            <span className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-light">{pendingSentProposals.filter(p => p.status === 'Pendente').length} propostas enviadas</span>
            <button
              onClick={() => setActiveTab('propostas')}
              className="text-[#E8C96A] font-bold hover:underline cursor-pointer"
            >
              Gerenciar Trocas
            </button>
          </div>
        </div>

      </section>

      {/* Main interactive Tab controller */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
        
        {/* Responsive Dashboard sidebar menu */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none border-b border-zinc-900 lg:border-b-0 lg:border-r lg:border-r-zinc-900 lg:pr-4 space-y-0.5" id="dashboard-sidebar">
          
          <span className="hidden lg:block text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 px-3 pb-1 pt-1">Mercado Tradicional</span>
          {[
            { id: 'mercado', label: '🛒 Comprar Figurinhas' },
            { id: 'colecao', label: '🗂️ Minhas Figurinhas' },
            { id: 'negociacoes', label: '📦 Entregas & Cofre' },
            { id: 'propostas', label: '✉️ Propostas de Troca' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider text-left transition-all whitespace-nowrap cursor-pointer shrink-0 ${activeTab === tab.id ? 'bg-[#C9A84C] text-[#0A0A0A] font-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30'}`}
            >
              {tab.label}
            </button>
          ))}

          <span className="hidden lg:block text-[9px] font-extrabold uppercase tracking-widest text-[#E8C96A] px-3 pb-1 pt-4 border-t border-zinc-900/60 font-mono">MVP Premium Suite</span>
          {[
            { id: 'tinder-match', label: '🎯 Tinder de Figurinhas' },
            { id: 'scanner-album', label: '📷 Scanner & Checklist' },
            { id: 'wishlist', label: '📝 Wishlist Pública' },
            { id: 'grupos-troca', label: '💬 Grupos & Eventos' },
            { id: 'missoes-ranking', label: '🏆 Missões & XP' },
            { id: 'mercado-dinamico', label: '📈 Bolsa de Escassez' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider text-left transition-all whitespace-nowrap cursor-pointer shrink-0 ${activeTab === tab.id ? 'bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-black font-black' : 'text-zinc-300 hover:text-white hover:bg-zinc-900/30 border border-transparent hover:border-[#C9A84C]/15'}`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => onNavigate('vender')}
            className="px-3 py-2.5 rounded-xl text-[11.5px] font-extrabold uppercase tracking-wider text-left text-emerald-400 hover:bg-emerald-950/20 border border-emerald-500/20 cursor-pointer mt-0 lg:mt-6 text-center lg:text-left shrink-0 block"
          >
            + Cadastrar Figurinha
          </button>
        </aside>

        {/* View content pane */}
        <div className="flex-1 mt-4 md:mt-0">
          
          {/* Tab 1: Marketplace search feed */}
          {activeTab === 'mercado' && (
            <div className="space-y-6">
              
              {/* Filter controls heading row */}
              <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between border-t border-zinc-800/40">
                
                {/* Search text query field */}
                <div className="relative w-full md:w-72">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar jogador ou seleção..."
                    className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 pl-9 pr-4 text-xs text-zinc-100 placeholder-zinc-500"
                  />
                </div>

                {/* Filters row selectors */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  
                  {/* Select Team selection */}
                  <div className="flex items-center gap-1.5 bg-zinc-900/60 pl-3 pr-2.5 py-1.5 rounded-xl border border-zinc-800 text-[11px] font-medium text-zinc-400">
                    <span>Seleção:</span>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="bg-transparent text-zinc-200 outline-none cursor-pointer focus:text-[#E8C96A]"
                    >
                      {availableTeams.map(t => (
                        <option key={t} value={t} className="bg-zinc-950 text-zinc-200">{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Rarity selection */}
                  <div className="flex items-center gap-1.5 bg-zinc-900/60 pl-3 pr-2.5 py-1.5 rounded-xl border border-zinc-800 text-[11px] font-medium text-zinc-400">
                    <span>Raridade:</span>
                    <select
                      value={selectedRarity}
                      onChange={(e) => setSelectedRarity(e.target.value)}
                      className="bg-transparent text-zinc-200 outline-none cursor-pointer focus:text-[#E8C96A]"
                    >
                      {availableRarities.map(r => (
                        <option key={r} value={r} className="bg-zinc-950 text-zinc-200">{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing sort selection */}
                  <div className="flex items-center gap-1.5 bg-zinc-900/60 pl-3 pr-2.5 py-1.5 rounded-xl border border-zinc-800 text-[11px] font-medium text-zinc-400">
                    <span>Ordenar:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-zinc-200 outline-none cursor-pointer focus:text-[#E8C96A]"
                    >
                      <option value="raro-dec" className="bg-zinc-950 text-zinc-200">Raridade</option>
                      <option value="preco-cres" className="bg-zinc-950 text-zinc-200">Preço: Menor ao Maior</option>
                      <option value="preco-dec" className="bg-zinc-950 text-zinc-200">Preço: Maior ao Menor</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Feed Grid cards display */}
              {displayedMarketStickers.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-2xl border border-dashed border-zinc-800/60">
                  <SlidersHorizontal className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-zinc-300">Nenhuma figurinha disponível</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                    Não encontramos resultados para os filtros selecionados ou você já é dono de todos os itens em exibição.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedMarketStickers.map(sticker => (
                    <StickerCard
                      key={sticker.id}
                      sticker={sticker}
                      currentUserId={currentUser.id}
                      onBuy={onBuySticker}
                      onTrade={(st) => {
                        onInitTrade(st);
                        onNavigate('trocar');
                      }}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* Tab 2: User Inventory view */}
          {activeTab === 'colecao' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#E8C96A] text-lg font-bold">Meu Acervo Particular</h3>
                  <p className="text-zinc-500 text-xs">Exibindo figurinhas registradas sob a sua propriedade.</p>
                </div>
                <button
                  onClick={() => onNavigate('vender')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C9A84C] hover:bg-[#E8C96A] text-[#0A0A0A] cursor-pointer"
                >
                  + Cadastrar Nova Figurinha
                </button>
              </div>

              {displayedMyStickers.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-2xl border border-dashed border-zinc-800/60">
                  <Layers className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-zinc-300">Você não tem figurinhas nesta lista</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto font-light">
                    Anuncie figurinhas de sua propriedade ou finalize compras de novos cards para aumentar seu acervo do site.
                  </p>
                  <button
                    onClick={() => onNavigate('vender')}
                    className="mt-4 px-4 py-2 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-[#C9A84C]/30 text-[#E8C96A]"
                  >
                    Simular Cadastro de Item
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedMyStickers.map(sticker => (
                    <div key={sticker.id} className="relative">
                      {!sticker.approved && (
                        <div className="absolute top-2.5 left-2.5 right-2.5 z-30 p-2 text-[10px] rounded bg-amber-950/90 border border-amber-500/40 text-amber-300 text-center flex items-center justify-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" /> Pendente de Aprovação pelo Administrador
                        </div>
                      )}
                      <StickerCard
                        sticker={sticker}
                        currentUserId={currentUser.id}
                        isActionable={false}
                      />
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* Tab 3: Ongoing and finished physical intermediations tracker list */}
          {activeTab === 'negociacoes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[#E8C96A] text-lg font-bold">Portfólio de Intermediações</h3>
                <p className="text-zinc-500 text-xs">Acompanhe as suas negociações físicas protegidas pelo cofre e custódia da Banca.</p>
              </div>

              {myNegotiations.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-2xl border border-dashed border-zinc-800/60">
                  <RefreshCw className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-zinc-300">Nenhuma negociação em andamento</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Compre um item ou aceite uma proposta de troca para iniciar o fluxo oficial do cofre.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myNegotiations.map(neg => {
                    const isBuyer = neg.buyerId === currentUser.id;
                    return (
                      <div
                        key={neg.id}
                        onClick={() => onNavigate('negociacao')}
                        className="glass-card p-5 rounded-2xl border-l-2 border-l-[#C9A84C] hover:border-r hover:border-r-[#E8C96A]/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono font-bold bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E8C96A] px-2.5 py-0.5 rounded">
                              {neg.type}
                            </span>
                            <span className="text-xs font-mono text-zinc-500 font-bold">REF: #{neg.id}</span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-150 mt-1">{neg.items}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                            <span>Comprador: <strong className="text-zinc-300">{neg.buyerName}</strong></span>
                            <span>•</span>
                            <span>Vendedor: <strong className="text-zinc-300">{neg.sellerName}</strong></span>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col justify-between items-end w-full md:w-auto h-full border-t border-t-zinc-900 md:border-t-0 pt-3 md:pt-0">
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Procedimento atual</span>
                            <span className="text-[11px] font-bold text-[#E8C96A] block mt-0.5">{neg.status}</span>
                          </div>
                          <div className="text-right mt-0 md:mt-4 flex md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto">
                            <span className="text-xs text-zinc-500 font-light block">Valor:</span>
                            <span className="text-sm font-mono font-bold text-white block">R$ {neg.value.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* Tab 4: Proposals sent and received manager list */}
          {activeTab === 'propostas' && (
            <div className="space-y-6">
              
              {/* Proposals Received */}
              <div className="space-y-4">
                <h4 className="text-[#E8C96A] font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowLeftRight className="w-4 h-4" /> Propostas Recebidas
                </h4>

                {pendingReceivedProposals.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">Nenhuma proposta de troca aguardando sua resposta.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingReceivedProposals.map(prop => (
                      <div key={prop.id} className="glass-card p-5 rounded-2xl border border-[#C9A84C]/25 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-zinc-300">Enviado por: {prop.proposerName}</span>
                          <span className="text-zinc-500 font-mono">{new Date(prop.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900">
                          <div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Ele Te Oferece:</span>
                            <div className="space-y-1">
                              {prop.offeredStickers.map(s => (
                                <div key={s.id} className="text-xs text-[#E8C96A] font-bold flex justify-between">
                                  <span>{s.playerName} ({s.code})</span>
                                  <span className="text-zinc-500 font-mono font-normal">Est. {s.condition}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-zinc-800 md:border-t-0 md:border-l md:border-l-zinc-800 pt-2 md:pt-0 md:pl-4">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Em Troca Do Seu:</span>
                            <div className="space-y-1">
                              {prop.requestedStickers.map(s => (
                                <div key={s.id} className="text-xs text-white font-bold flex justify-between">
                                  <span>{s.playerName} ({s.code})</span>
                                  <span className="text-zinc-500 font-mono font-normal">Est. {s.condition}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => onDeclineProposal(prop.id)}
                            className="px-4 py-2 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-850 text-red-400 border border-red-500/10 cursor-pointer"
                          >
                            Recusar Troca
                          </button>
                          <button
                            type="button"
                            onClick={() => onAcceptProposal(prop.id)}
                            className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-black cursor-pointer"
                          >
                            Aceitar & Enviar para Banca
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Proposals Sent */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <h4 className="text-zinc-300 font-bold text-sm uppercase tracking-wider">
                  Propostas Enviadas por Você
                </h4>

                {pendingSentProposals.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">Você não propôs nenhuma troca no mercado.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingSentProposals.map(prop => (
                      <div key={prop.id} className="glass-card p-4 rounded-xl border border-zinc-900 text-xs flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-zinc-200">Destinatário: {prop.receiverName}</span>
                            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">(REF: #{prop.id})</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 font-light">
                            Você ofereceu {prop.offeredStickers.length} item(ns) por {prop.requestedStickers.length} de Marcos Vendedor.
                          </p>
                        </div>

                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prop.status === 'Pendente' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/20' :
                            prop.status === 'Aceita' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20' :
                            'bg-zinc-900 text-zinc-500'
                          }`}>
                            {prop.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'tinder-match' && (
            <TinderMatch 
              currentUser={currentUser}
              stickers={stickers}
              onAddProposal={onAddProposal}
              onNavigate={onNavigate}
            />
          )}

          {activeTab === 'scanner-album' && (
            <ScannerAlbum />
          )}

          {activeTab === 'wishlist' && (
            <WishlistPage 
              currentUser={currentUser}
              stickers={stickers}
              onAddProposal={onAddProposal}
              onNavigate={onNavigate}
            />
          )}

          {activeTab === 'grupos-troca' && (
            <GroupRooms 
              currentUser={currentUser}
            />
          )}

          {activeTab === 'missoes-ranking' && (
            <GamificationPage 
              currentUser={currentUser}
            />
          )}

          {activeTab === 'mercado-dinamico' && (
            <MarketDynamics />
          )}

        </div>

      </section>

    </div>
  );
}
