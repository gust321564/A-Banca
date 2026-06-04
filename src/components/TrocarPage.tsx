import { useState, useEffect } from 'react';
import { Sticker, TradeProposal, User } from '../types';
import { ArrowLeftRight, Check, CheckCircle2, ArrowLeft, Info, Swords } from 'lucide-react';

interface TrocarPageProps {
  currentUser: User;
  stickers: Sticker[];
  proposals: TradeProposal[];
  targetSticker: Sticker | null;
  onNavigate: (page: string) => void;
  onAddProposal: (newProposal: Omit<TradeProposal, 'id' | 'proposerId' | 'proposerName' | 'status' | 'createdAt'>) => void;
  onClearTargetSticker: () => void;
}

export default function TrocarPage({
  currentUser,
  stickers,
  proposals,
  targetSticker,
  onNavigate,
  onAddProposal,
  onClearTargetSticker,
}: TrocarPageProps) {
  
  const [selectedMyStickers, setSelectedMyStickers] = useState<string[]>([]);
  const [selectedMarketStickers, setSelectedMarketStickers] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // My stickers list (available for trade)
  const myStickers = stickers.filter(s => s.sellerId === currentUser.id);
  
  // Other people's stickers (excluding mine, and should be tradeable)
  const marketStickers = stickers.filter(s => s.sellerId !== currentUser.id && s.approved && s.isTradeable);

  // Pre-populate target sticker if we redirected from dashboard
  useEffect(() => {
    if (targetSticker) {
      setSelectedMarketStickers([targetSticker.id]);
    }
  }, [targetSticker]);

  const toggleMySticker = (id: string) => {
    setSelectedMyStickers(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleMarketSticker = (id: string) => {
    setSelectedMarketStickers(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleProposeTrade = () => {
    if (selectedMyStickers.length === 0) {
      alert('Por favor, selecione pelo menos uma de suas figurinhas para oferecer.');
      return;
    }
    if (selectedMarketStickers.length === 0) {
      alert('Por favor, selecione qual figurinha do mercado você gostaria de receber.');
      return;
    }

    const offered = myStickers.filter(s => selectedMyStickers.includes(s.id));
    const requested = marketStickers.filter(s => selectedMarketStickers.includes(s.id));

    // For safety, assume receiving user is the owner of the first requested sticker
    const receiverId = requested[0].sellerId;
    const receiverName = requested[0].sellerName;

    onAddProposal({
      receiverId,
      receiverName,
      offeredStickers: offered,
      requestedStickers: requested,
    });

    setSuccess(true);
    onClearTargetSticker();
  };

  return (
    <div className="flex-1 bg-zinc-950/20 pt-6 pb-24 px-4 max-w-7xl mx-auto w-full">
      
      {/* Upper header action row */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => {
            onClearTargetSticker();
            onNavigate('dashboard');
          }}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#E8C96A] transition-colors cursor-pointer bg-zinc-900/60 px-4 py-2.5 rounded-xl border border-zinc-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Painel
        </button>
        <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-widest">
          Módulo de Troca Certificada
        </span>
      </div>

      {success ? (
        /* Success screen layout */
        <div className="glass-card max-w-2xl mx-auto p-12 rounded-2xl text-center border border-emerald-500/20 space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Sua proposta foi transmitida!</h2>
            <p className="text-zinc-400 text-xs md:text-sm max-w-md mx-auto font-light leading-relaxed">
              O colecionador receberá seu alerta em tempo real. Os itens oferecidos por você ficarão reservados em sua conta para garantir a transação assim que ela for aceita.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850 text-left space-y-2 max-w-md mx-auto">
            <h4 className="text-xs font-bold text-[#E8C96A] flex items-center gap-1.5">
              <Swords className="w-4 h-4 shrink-0" /> Garantia Física da Plataforma
            </h4>
            <p className="text-[11px] text-zinc-400 font-light leading-normal">
              Se aceita, os dois trocadores enviam os envelopes lacrados para a sede d'A Banca. 
              Nossos inspetores abrem simultaneamente, certificam os estados de conservação, selam na custódia e remetem as novas figurinhas para os respectivos destinos com embalagem rígida.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSuccess(false);
                setSelectedMyStickers([]);
                setSelectedMarketStickers([]);
              }}
              className="px-4 py-3 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-850 cursor-pointer"
            >
              Propor Outra Troca
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-3 rounded-xl text-xs font-bold bg-[#C9A84C] hover:bg-[#E8C96A] text-[#0A0A0A] cursor-pointer"
            >
              Voltar para Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Configuration Screen */
        <div className="space-y-6">
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-white">Consórcio de Troca Garantida</h2>
            <p className="text-zinc-400 text-xs mt-1 md:text-sm">Assinale os cromos que deseja oferecer e selecione os cromos correspondentes no mercado.</p>
          </div>

          {/* Two Columns Grid Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Column A: Offereable selection (6 cols) */}
            <div className="lg:col-span-6 flex flex-col glass-card rounded-2xl p-6 border border-zinc-850">
              <div className="border-b border-zinc-900 pb-3 mb-4">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">PASSO 01</span>
                <h3 className="text-base font-bold text-white mt-0.5">O que você está oferecendo:</h3>
                <p className="text-zinc-500 text-xs">Selecione uma ou mais figurinhas do seu acervo particular.</p>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[480px]">
                {myStickers.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl my-auto">
                    <p className="text-xs text-zinc-500 italic">Você não possui nenhuma figurinha disponível para trocas no acervo.</p>
                    <button
                      onClick={() => onNavigate('vender')}
                      className="mt-3 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-[#E8C96A]"
                    >
                      Cadastrar item
                    </button>
                  </div>
                ) : (
                  myStickers.map(st => {
                    const isChecked = selectedMyStickers.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleMySticker(st.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${isChecked ? 'border-emerald-500/40 bg-emerald-950/15' : 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-800'}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Checkbox badge circle */}
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-700 bg-zinc-800'}`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{st.playerName}</h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{st.team} • {st.code} • {st.rarity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-zinc-400 block bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-850">
                            Est. {st.condition}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column B: Requested selections (6 cols) */}
            <div className="lg:col-span-6 flex flex-col glass-card rounded-2xl p-6 border border-zinc-850">
              <div className="border-b border-zinc-900 pb-3 mb-4">
                <span className="text-[10px] font-bold text-[#E8C96A] uppercase tracking-widest block">PASSO 02</span>
                <h3 className="text-base font-bold text-white mt-0.5">O que você deseja receber:</h3>
                <p className="text-zinc-500 text-xs">Selecione o cromo do mercado que gostaria de trocar.</p>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[480px]">
                {marketStickers.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic p-8 text-center">Nenhuma figurinha disponível para troca no mercado externo no momento.</p>
                ) : (
                  marketStickers.map(st => {
                    const isChecked = selectedMarketStickers.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleMarketSticker(st.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${isChecked ? 'border-[#C9A84C]/45 bg-[#C9A84C]/5' : 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-800'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#C9A84C] border-[#E8C96A] text-black' : 'border-zinc-700 bg-zinc-800'}`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{st.playerName}</h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{st.team} • {st.code} • {st.rarity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-[#E8C96A] block font-semibold mb-1">
                            Val. R$ {st.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 block truncate max-w-[120px]">
                            Prop: {st.sellerName}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Proposal Review Summary Card */}
          <div className="glass-card p-6 rounded-2xl border border-[#C9A84C]/25 space-y-4">
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <ArrowLeftRight className="w-4 h-4 text-[#E8C96A]" /> Resumo Final da Proposta de Troca
              </h3>
              <span className="text-[10px] text-zinc-500">A Banca • Custódia de Câmbio de Alta Segurança</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-zinc-950/40 p-4.5 rounded-xl border border-zinc-900">
              
              {/* Proposer lists */}
              <div className="text-center md:text-left space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider block uppercase">Você Envia:</span>
                {selectedMyStickers.length === 0 ? (
                  <span className="text-xs text-rose-400 block font-light">Nenhum cromo assinalado</span>
                ) : (
                  <div className="text-xs font-bold text-white space-y-1">
                    {myStickers.filter(s => selectedMyStickers.includes(s.id)).map(s => (
                      <div key={s.id}>• {s.playerName} ({s.code})</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Central flow loop */}
              <div className="flex justify-center items-center py-2">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#E8C96A] shadow-[0_0_15px_rgba(201,168,76,0.15)] animate-pulse">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
              </div>

              {/* Receiver lists */}
              <div className="text-center md:text-right space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider block uppercase">Você Recebe:</span>
                {selectedMarketStickers.length === 0 ? (
                  <span className="text-xs text-rose-400 block font-light">Nenhum cromo assinalado</span>
                ) : (
                  <div className="text-xs font-bold text-[#E8C96A] space-y-1">
                    {marketStickers.filter(s => selectedMarketStickers.includes(s.id)).map(s => (
                      <div key={s.id}>• {s.playerName} ({s.code})</div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
              <div className="flex gap-2 items-start text-[11px] text-zinc-400 font-light max-w-lg leading-relaxed">
                <Info className="w-4 h-4 text-[#E8C96A] shrink-0 mt-0.5" />
                <span>
                  O destinatário poderá aceitar ou recusar a proposta. Caso recuse, suas figurinhas voltam a ficar livres para negociações normais na plataforma automaticamente.
                </span>
              </div>
              
              <button
                type="button"
                onClick={handleProposeTrade}
                disabled={selectedMyStickers.length === 0 || selectedMarketStickers.length === 0}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] hover:to-[#fff3d1] text-[#0A0A0A] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
              >
                Oferecer Proposta de Troca
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
