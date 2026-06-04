import { useState } from 'react';
import { Sticker, User, TradeProposal } from '../types';
import { ArrowLeftRight, Heart, X, Check, Award, Layers, Sparkles, RefreshCw } from 'lucide-react';
import StickerCard from './StickerCard';

interface TinderMatchProps {
  currentUser: User;
  stickers: Sticker[];
  onAddProposal: (newProposal: Omit<TradeProposal, 'id' | 'proposerId' | 'proposerName' | 'status' | 'createdAt'>) => void;
  onNavigate: (page: string) => void;
}

export default function TinderMatch({ currentUser, stickers, onAddProposal, onNavigate }: TinderMatchProps) {
  // Let's seed duplicates and missing list state
  const [myDuplicates, setMyDuplicates] = useState<string[]>(['st_debruyne', 'st_richarlison']);
  const [myMissing, setMyMissing] = useState<string[]>(['st_neymar', 'st_messi', 'st_cr7']);
  
  // Custom states for the Tinder Card Stack
  const [deckIndex, setDeckIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchDetails, setMatchDetails] = useState<{
    offered: Sticker;
    requested: Sticker;
    partnerName: string;
  } | null>(null);

  // Filter stickers we can obtain (owned by others, approved)
  const tradeableFromOthers = stickers.filter(
    s => s.approved && s.sellerId !== currentUser.id && s.isTradeable
  );

  // Build potential deals where:
  // 1. Other user owns a card we need (myMissing)
  // 2. We own a duplicate they might need (actually, any card we have as duplicate is eligible for trade to make matching fun!)
  const potentialSwaps = tradeableFromOthers.filter(s => myMissing.includes(s.id));

  const handleSwipe = (dir: 'left' | 'right') => {
    if (deckIndex >= potentialSwaps.length) return;
    
    setSwipeDir(dir);
    
    // Process "Match" if swiped right
    if (dir === 'right') {
      const currentSwapSticker = potentialSwaps[deckIndex];
      
      // Let's see if we have an offered duplicate
      const offeredStickerObj = stickers.find(s => myDuplicates.includes(s.id) && s.sellerId === currentUser.id) 
        || stickers.find(s => s.sellerId === currentUser.id); // fallback to any owned sticker

      if (offeredStickerObj) {
        // Formulate proposal
        onAddProposal({
          receiverId: currentSwapSticker.sellerId,
          receiverName: currentSwapSticker.sellerName,
          offeredStickers: [offeredStickerObj],
          requestedStickers: [currentSwapSticker],
        });

        // Set match congratulations popup details
        setMatchDetails({
          offered: offeredStickerObj,
          requested: currentSwapSticker,
          partnerName: currentSwapSticker.sellerName,
        });

        setTimeout(() => {
          setShowMatchModal(true);
        }, 150);
      }
    }

    setTimeout(() => {
      setDeckIndex(prev => prev + 1);
      setSwipeDir(null);
    }, 280);
  };

  const handleToggleDuplicate = (id: string) => {
    setMyDuplicates(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleMissing = (id: string) => {
    setMyMissing(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Remaining deck size
  const currentSticker = potentialSwaps[deckIndex];
  const hasCards = deckIndex < potentialSwaps.length;

  return (
    <div className="space-y-8 animate-fade-in" id="tinder-match-container">
      
      {/* Intro Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-[#E8C96A] text-lg font-black uppercase tracking-wider flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#E8C96A] animate-pulse" />
            TINDER DE FIGURINHAS
          </h3>
          <p className="text-zinc-500 text-xs font-light max-w-xl">
            Defina seus cromos repetidos e as figurinhas em falta no seu álbum. Nosso robô d'A Banca cruza dados do Sindicato em tempo real, gerando um feed autônomo de matches de troca instantâneos!
          </p>
        </div>
      </div>

      {/* Grid Layout Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Setup Preferences checklists */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-zinc-850 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E8C96A]" /> Minha Checklist de Trocas
            </h4>

            {/* List duplicatas */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Cromos Repetidos (Tenho p/ Troca):
              </span>
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 space-y-2">
                {stickers.filter(s => s.sellerId === currentUser.id).length === 0 ? (
                  <p className="text-[11px] text-zinc-600 italic">Cadastre novas figurinhas no seu acervo primeiro.</p>
                ) : (
                  stickers.filter(s => s.sellerId === currentUser.id).map(s => {
                    const isDup = myDuplicates.includes(s.id);
                    return (
                      <label 
                        key={s.id} 
                        className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                          isDup 
                            ? 'bg-[#C9A84C]/5 border-[#C9A84C]/35 text-[#E8C96A] font-bold' 
                            : 'bg-zinc-950/20 border-zinc-900/60 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={isDup}
                            onChange={() => handleToggleDuplicate(s.id)}
                            className="rounded accent-[#C9A84C] cursor-pointer"
                          />
                          <span>{s.playerName} <span className="text-[10px] text-zinc-500 font-mono">({s.code})</span></span>
                        </div>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1 bg-zinc-900 rounded">Repetida</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* List faltas */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Falta no meu Álbum (Procurando):
              </span>
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 space-y-2 max-h-52 overflow-y-auto">
                {stickers.filter(s => s.sellerId !== currentUser.id).map(s => {
                  const isMiss = myMissing.includes(s.id);
                  return (
                    <label 
                      key={s.id} 
                      className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                        isMiss 
                          ? 'bg-[#C9A84C]/5 border-[#C9A84C]/35 text-[#E8C96A] font-bold' 
                          : 'bg-zinc-950/20 border-zinc-900/60 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          checked={isMiss}
                          onChange={() => handleToggleMissing(s.id)}
                          className="rounded accent-[#C9A84C] cursor-pointer"
                        />
                        <span>{s.playerName} <span className="text-[10px] text-zinc-500 font-mono">({s.code})</span></span>
                      </div>
                      <span className="text-[9px] text-[#C9A84C]/80 font-mono font-bold">R$ {s.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tinder swipe layout */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {hasCards ? (
            <div className="w-full max-w-sm space-y-6">
              
              {/* Swipe count header */}
              <div className="flex justify-between items-center text-xs text-zinc-400 px-1">
                <span>Colecionadores com Matches:</span>
                <span className="font-bold text-white bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2 py-0.5 rounded-full font-mono">
                  {deckIndex + 1} de {potentialSwaps.length}
                </span>
              </div>

              {/* Swiper Deck Wrapper */}
              <div className="relative h-[480px] w-full flex items-center justify-center">
                
                {/* Simulated background cards stack effect */}
                {deckIndex + 1 < potentialSwaps.length && (
                  <div className="absolute inset-0 scale-[0.95] translate-y-3 opacity-30 pointer-events-none z-0">
                    <StickerCard 
                      sticker={potentialSwaps[deckIndex + 1]} 
                      isActionable={false} 
                      currentUserId={currentUser.id}
                    />
                  </div>
                )}
                {deckIndex + 2 < potentialSwaps.length && (
                  <div className="absolute inset-0 scale-[0.91] translate-y-6 opacity-10 pointer-events-none z-0">
                    <StickerCard 
                      sticker={potentialSwaps[deckIndex + 2]} 
                      isActionable={false} 
                      currentUserId={currentUser.id}
                    />
                  </div>
                )}

                {/* Main animated active card */}
                <div 
                  className={`absolute inset-0 z-10 transition-all duration-300 ${
                    swipeDir === 'left' ? '-rotate-12 -translate-x-32 opacity-0' :
                    swipeDir === 'right' ? 'rotate-12 translate-x-32 opacity-0' : 'rotate-0 translate-x-0 opacity-100'
                  }`}
                >
                  <StickerCard 
                    sticker={currentSticker} 
                    isActionable={false} 
                    currentUserId={currentUser.id}
                  />

                  {/* Absolute Swipe labels overlay */}
                  {swipeDir === 'left' && (
                    <div className="absolute top-12 right-6 bg-red-600/90 text-white font-black text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl border border-red-400/40 rotate-12 z-20 shadow-lg animate-pulse">
                      ESQUECER / SKIP
                    </div>
                  )}
                  {swipeDir === 'right' && (
                    <div className="absolute top-12 left-6 bg-emerald-600/90 text-black font-black text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl border border-emerald-400/40 -rotate-12 z-20 shadow-lg animate-pulse">
                      MATCH DE TROCA! 🚀
                    </div>
                  )}
                </div>

              </div>

              {/* Lower Deck Controls (Skipping/Accept buttons) */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  onClick={() => handleSwipe('left')}
                  className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors shadow-lg active:scale-90 cursor-pointer"
                  title="Recusar"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="bg-zinc-900/60 border border-zinc-850 px-4 py-2 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Dono</span>
                  <span className="text-xs font-bold text-white block mt-0.5">{currentSticker.sellerName}</span>
                </div>

                <button
                  onClick={() => handleSwipe('right')}
                  className="w-14 h-14 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 flex items-center justify-center text-[#E8C96A] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all shadow-lg active:scale-90 cursor-pointer"
                  title="Dar Match"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>
              </div>

            </div>
          ) : (
            <div className="w-full max-w-sm glass-card p-10 rounded-2xl text-center border-dashed border-zinc-800 flex flex-col items-center justify-center gap-4 py-16">
              <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/35 flex items-center justify-center text-[#E8C96A]">
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-sm">Fim do Deck de Matches</h4>
                <p className="text-zinc-500 text-xs font-light max-w-[280px] mx-auto leading-relaxed">
                  Não existem novas figurinhas correspondentes com os seus interesses configurados no momento.
                </p>
              </div>
              <div className="p-3 bg-zinc-900/50 border border-zinc-900 rounded-xl text-left text-[11px] text-zinc-400 space-y-1 w-full mt-2">
                <span className="font-bold text-[#E8C96A] uppercase tracking-wider block mb-1">Dica de Sucesso:</span>
                • Marque mais figurinhas na checklist ao lado para reatar novas simulações de match!
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MATCH CONFIRMATION GLORIOUS POPUP MODAL */}
      {showMatchModal && matchDetails && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md p-6 rounded-2xl glass-card border border-[#C9A84C]/40 text-center space-y-6 relative overflow-hidden">
            
            <span className="absolute -top-12 -left-12 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-2xl" />
            <span className="absolute -bottom-12 -right-12 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl" />

            <div className="w-14 h-14 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] rounded-full flex items-center justify-center text-2xl font-black mx-auto shrink-0 shadow-lg animate-bounce">
              <Check className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-white tracking-wide uppercase flex items-center justify-center gap-1.5 font-serif">
                <Sparkles className="w-5 h-5 text-[#E8C96A] animate-spin" />
                É UM MATCH!
              </h4>
              <p className="text-[#C9A84C] text-[11px] tracking-widest uppercase font-bold text-xs">
                Contrato Proposta de Câmbio Registrado
              </p>
              <p className="text-zinc-400 text-xs font-light pt-2">
                Você e <strong>{matchDetails.partnerName}</strong> têm interesses mútuos de câmbio!
              </p>
            </div>

            {/* Interchange match visuals */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl relative">
              <div className="text-left py-1">
                <span className="text-[9px] text-zinc-500 uppercase font-mono block">Você Oferece:</span>
                <span className="text-xs font-bold text-white block mt-0.5">{matchDetails.offered.playerName}</span>
                <span className="text-[10px] text-zinc-400 font-mono italic block">{matchDetails.offered.code}</span>
              </div>
              <div className="text-right py-1 border-l border-zinc-805">
                <span className="text-[9px] text-[#C9A84C] uppercase font-mono block">Você Recebe:</span>
                <span className="text-xs font-bold text-[#E8C96A] block mt-0.5">{matchDetails.requested.playerName}</span>
                <span className="text-[10px] text-zinc-400 font-mono italic block">{matchDetails.requested.code}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowMatchModal(false);
                  onNavigate('dashboard');
                }}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-black shadow-md cursor-pointer hover:underline"
              >
                Prosseguir com as Trocas
              </button>
              <button
                onClick={() => setShowMatchModal(false)}
                className="w-full py-3 text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
              >
                Voltar e Continuar Swipando
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
