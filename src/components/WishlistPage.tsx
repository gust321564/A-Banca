import React, { useState } from 'react';
import { Sticker, User, TradeProposal } from '../types';
import { Search, Heart, User as UserIcon, Plus, Info, RefreshCw } from 'lucide-react';

interface WishlistPageProps {
  currentUser: User;
  stickers: Sticker[];
  onAddProposal: (newProposal: Omit<TradeProposal, 'id' | 'proposerId' | 'proposerName' | 'status' | 'createdAt'>) => void;
  onNavigate: (page: string) => void;
}

interface WishlistItem {
  id: string;
  userName: string;
  userId: string;
  city: string;
  targetStickerName: string;
  targetStickerCode: string;
  rarity: string;
  createdAt: string;
}

export default function WishlistPage({ currentUser, stickers, onAddProposal, onNavigate }: WishlistPageProps) {
  const [search, setSearch] = useState('');
  
  // Seed public wishlists from other members of A Banca
  const [wishlists, setWishlists] = useState<WishlistItem[]>([
    {
      id: 'wish_1',
      userId: 'user_vendedor',
      userName: 'Marcos Vendedor',
      city: 'Florianópolis / SC',
      targetStickerName: 'Neymar Jr',
      targetStickerCode: 'BRA-10',
      rarity: 'Borda de Ouro',
      createdAt: '2026-06-03T11:20:00Z',
    },
    {
      id: 'wish_2',
      userId: 'user_comprador',
      userName: 'Enzo Comprador',
      city: 'São Paulo / SP',
      targetStickerName: 'Vinicius Jr',
      targetStickerCode: 'BRA-20',
      rarity: 'Raro',
      createdAt: '2026-06-03T12:00:00Z',
    },
    {
      id: 'wish_3',
      userId: 'user_admin',
      userName: 'Thiago Admin',
      city: 'Belo Horizonte / MG',
      targetStickerName: 'Kylian Mbappé',
      targetStickerCode: 'FRA-10',
      rarity: 'Lendário',
      createdAt: '2026-06-04T09:40:00Z',
    }
  ]);

  // Form states to publish self missing cards
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newRarity, setNewRarity] = useState('Comum');

  const handleAddWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !newCode.trim()) {
      alert('Favor preencher todos os campos!');
      return;
    }

    const item: WishlistItem = {
      id: `wish_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      city: 'São Paulo / SP', // default simulation city
      targetStickerName: newPlayerName,
      targetStickerCode: newCode.toUpperCase(),
      rarity: newRarity,
      createdAt: new Date().toISOString(),
    };

    setWishlists(prev => [item, ...prev]);
    setNewPlayerName('');
    setNewCode('');
    alert('Item adicionado à sua wishlist pública!');
  };

  const handleDeleteSelfWishlist = (id: string) => {
    setWishlists(prev => prev.filter(w => w.id !== id));
  };

  const handleProposeFromWishlist = (wish: WishlistItem) => {
    // Other users can propose trades of cards they own
    const selfOwnedDuplicates = stickers.filter(s => s.sellerId === currentUser.id);
    if (selfOwnedDuplicates.length === 0) {
      alert('Você não tem nenhuma figurinha cadastrada para permutar. Cadastre um item para fazer propostas públicas!');
      onNavigate('vender');
      return;
    }

    // Try to auto-resolve what sticker we are offering
    const matchedStickerToOffer = selfOwnedDuplicates[0]; // propose the first as simulation

    // Create a mock swap target
    const targetStickerObject: Sticker = {
      id: `st_wish_${wish.id}`,
      playerName: wish.targetStickerName,
      team: 'Indeterminado',
      code: wish.targetStickerCode,
      edition: 'Copa 2026',
      condition: 'Nova',
      rarity: wish.rarity as any,
      price: 15.00,
      sellerId: wish.userId,
      sellerName: wish.userName,
      approved: true,
      isTradeable: true,
    };

    onAddProposal({
      receiverId: wish.userId,
      receiverName: wish.userName,
      offeredStickers: [matchedStickerToOffer],
      requestedStickers: [targetStickerObject],
    });

    alert(`Proposta de câmbio enviada! Oferecemos seu cromo ${matchedStickerToOffer.playerName} (${matchedStickerToOffer.code}) pelo cromo ${wish.targetStickerName} (${wish.targetStickerCode}) de ${wish.userName}.`);
    onNavigate('dashboard');
  };

  const filteredWishlists = wishlists.filter(
    w =>
      w.targetStickerName.toLowerCase().includes(search.toLowerCase()) ||
      w.targetStickerCode.toLowerCase().includes(search.toLowerCase()) ||
      w.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in" id="wishlist-page-container">
      
      {/* Intro row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-[#E8C96A] text-lg font-black uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400 fill-current animate-pulse" />
            WISHLIST PÚBLICA (COFRE DE DECEJOS)
          </h3>
          <p className="text-zinc-500 text-xs font-light max-w-xl">
            Publique quais figurinhas estão em falta para completar seu álbum pessoal. Todos os membros cadastrados na Banca podem ver seus interesses de troca e propor propostas instantâneas!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Add wish item form (4 columns) */}
        <div className="lg:col-span-4">
          <div className="glass-card p-5 rounded-2xl border border-zinc-850 space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#E8C96A]" /> Adicionar à Minha Lista
            </h4>

            <form onSubmit={handleAddWishlist} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do Jogador</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cristiano Ronaldo"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Código do Cromo (Código/Álbum)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: POR-07"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none text-center font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Raridade Desejada</label>
                <select
                  value={newRarity}
                  onChange={(e) => setNewRarity(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  <option value="Comum">Comum</option>
                  <option value="Raro">Raro</option>
                  <option value="Lendário">Lendário</option>
                  <option value="Borda de Ouro">Borda de Ouro</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C9A84C] hover:bg-[#E8C96A] text-black shadow cursor-pointer transition-all active:scale-[0.98]"
              >
                Cadastrar Desejo Público
              </button>
            </form>

            <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-900 flex gap-2">
              <Info className="w-4 h-4 text-[#E8C96A] shrink-0 mt-0.5" />
              <p className="text-[9px] text-zinc-500 font-light leading-normal">
                Sua figurinha será listada nos classificados públicos para matches físicos do site.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Public wishlist feed directory (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtre desejos por código, cromo ou colecionador..."
              className="w-full bg-zinc-900 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-[#E8C96A]/60"
            />
          </div>

          {/* Directory listings */}
          <div className="glass-card rounded-2xl border border-zinc-850 overflow-hidden">
            <div className="p-4 border-b border-zinc-900 bg-zinc-950/40 flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#E8C96A] uppercase tracking-wider">Diretório Público de Wishlisting</span>
              <span className="text-[10px] text-zinc-500 font-mono">Listando {filteredWishlists.length} requisições de câmbio</span>
            </div>

            <div className="divide-y divide-zinc-900">
              {filteredWishlists.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-8 h-8 text-zinc-700 animate-spin-slow" />
                  <p className="text-xs font-bold">Nenhum interesse encontrado</p>
                </div>
              ) : (
                filteredWishlists.map(w => {
                  const isSelf = w.userId === currentUser.id;
                  return (
                    <div 
                      key={w.id} 
                      className="p-4.5 hover:bg-zinc-900/10 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      id={`wishlist-item-${w.id}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white">{w.targetStickerName}</span>
                          <span className="text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-cyan-400 px-2 py-0.5 rounded">
                            {w.targetStickerCode}
                          </span>
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            w.rarity === 'Borda de Ouro' ? 'bg-amber-950/20 text-[#E8C96A]' :
                            w.rarity === 'Lendário' ? 'bg-indigo-950/20 text-indigo-400' :
                            'bg-zinc-900 text-zinc-400'
                          }`}>
                            {w.rarity}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-light">
                          <UserIcon className="w-3.5 h-3.5 text-zinc-650" />
                          <span>Membro: <strong className="text-zinc-400">{w.userName}</strong></span>
                          <span>•</span>
                          <span>Região: <strong className="text-zinc-400 font-normal">{w.city}</strong></span>
                        </div>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto text-right">
                        {isSelf ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteSelfWishlist(w.id)}
                            className="px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-950/10 hover:bg-red-950/30 cursor-pointer border border-red-500/10 transition-all"
                          >
                            Remover item
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleProposeFromWishlist(w)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 shadow-md cursor-pointer transition-all"
                          >
                            Propor Permuta Fiduciária
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
