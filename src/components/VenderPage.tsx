import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Upload, Info, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Sticker } from '../types';
import StickerCard from './StickerCard';

interface VenderPageProps {
  currentUserId: string;
  onNavigate: (page: string) => void;
  onAddSticker: (newSticker: Omit<Sticker, 'id' | 'sellerId' | 'sellerName' | 'approved'>) => void;
}

export default function VenderPage({ currentUserId, onNavigate, onAddSticker }: VenderPageProps) {
  const [playerName, setPlayerName] = useState('Neymar Jr');
  const [team, setTeam] = useState('Brasil');
  const [code, setCode] = useState('BRA-10');
  const [edition, setEdition] = useState('Copa 2026');
  const [condition, setCondition] = useState<'Impecável' | 'Nova' | 'Usada'>('Impecável');
  const [rarity, setRarity] = useState<'Comum' | 'Raro' | 'Lendário' | 'Borda de Ouro'>('Borda de Ouro');
  const [price, setPrice] = useState(150);
  const [isTradeable, setIsTradeable] = useState(true);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto calculate prefix based on country
  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTeam(val);
    const prefix = val.substring(0, 3).toUpperCase();
    setCode(`${prefix}-10`);
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageFile(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      alert('Favor inserir o nome do jogador.');
      return;
    }
    if (price <= 0) {
      alert('Favor registrar um preço de venda real.');
      return;
    }

    onAddSticker({
      playerName,
      team,
      code,
      edition,
      condition,
      rarity,
      price,
      isTradeable,
    });

    setSuccess(true);
  };

  const simulatedSticker: Sticker = {
    id: 'preview',
    playerName: playerName || 'Nome do Jogador',
    team,
    code: code || 'COD-00',
    edition,
    condition,
    rarity,
    price: Number(price) || 0,
    sellerId: currentUserId,
    sellerName: 'Você (Vendedor)',
    approved: false,
    isTradeable,
  };

  return (
    <div className="flex-1 bg-zinc-950/20 pt-6 pb-24 px-4 max-w-7xl mx-auto w-full">
      
      {/* Back to market row */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#E8C96A] transition-colors cursor-pointer bg-zinc-900/60 px-4 py-2.5 rounded-xl border border-zinc-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Mercado
        </button>
        <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-widest">
          Sessão de Vendas
        </span>
      </div>

      {success ? (
        /* Success Screen */
        <div className="glass-card max-w-2xl mx-auto p-12 rounded-2xl text-center border border-emerald-500/20 space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Prontinho! Cadastro Efetuado</h2>
            <p className="text-zinc-400 text-xs md:text-sm max-w-md mx-auto font-light leading-relaxed">
              Sua figurinha <strong className="text-white">{playerName} ({code})</strong> foi cadastrada com sucesso!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850 text-left space-y-2 max-w-md mx-auto">
            <h4 className="text-xs font-bold text-[#E8C96A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" /> Próximos Passos (A Banca Intermediações)
            </h4>
            <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
              O anúncio já está registrado em sua coleção sob o status <strong className="text-amber-400">Pendente de Avaliação</strong>. 
              Para simular o fluxo completo, acesse o <strong>Painel do Administrador</strong> (ícone de engrenagem no topo) e aprove a figurinha para vê-la no mercado público imediatamente!
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSuccess(false);
                setPlayerName('Lionel Messi');
                setPrice(450);
              }}
              className="px-4 py-3 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-850 cursor-pointer"
            >
              Anunciar Outra
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-3 rounded-xl text-xs font-bold bg-[#C9A84C] hover:bg-[#E8C96A] text-[#0A0A0A] cursor-pointer"
            >
              Ir para Meu Acervo
            </button>
          </div>
        </div>
      ) : (
        /* Form + Preview Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Fill out Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Warning Intermediation */}
            <div className="p-4.5 rounded-2xl bg-amber-950/20 border border-[#C9A84C]/25 text-xs text-[#E8C96A] leading-relaxed flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-[#E8C96A] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">AVISO SOBRE INTERMEDIAÇÃO FÍSICAL GARANTIDA:</strong>
                Ao anunciar uma figurinha, ela será faturada sob o ecossistema protetor da Banca. 
                Quando vendida, o valor pago pelo comprador fica bloqueado no escrow da Banca até você enviar a figurinha física ao nosso laboratório e atestarmos sua autenticidade e estado físico.
              </div>
            </div>

            {/* Registration Card Form */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-zinc-850 space-y-6">
              <div className="border-b border-zinc-900 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#E8C96A]" /> Informações Gerais da Figurinha
                </h2>
                <p className="text-zinc-500 text-xs">Preencha todos os campos do encarte físico conforme impressos.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Responsive row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Player Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Nome do Jogador
                    </label>
                    <input
                      type="text"
                      required
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Ex: Neymar Jr, Kylian Mbappé"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 px-3.5 text-xs text-zinc-100 placeholder-zinc-650 focus:outline-none"
                    />
                  </div>

                  {/* Team Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Seleção / Time
                    </label>
                    <select
                      value={team}
                      onChange={handleTeamChange}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none cursor-pointer"
                    >
                      <option value="Brasil">Brasil</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Portugal">Portugal</option>
                      <option value="França">França</option>
                      <option value="Croácia">Croácia</option>
                      <option value="Inglaterra">Inglaterra</option>
                      <option value="Bélgica">Bélgica</option>
                      <option value="Espanha">Espanha</option>
                      <option value="Alemanha">Alemanha</option>
                    </select>
                  </div>

                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  
                  {/* Card Code */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Código Álbum
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Ex: BRA-10"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none text-center font-mono font-bold"
                    />
                  </div>

                  {/* Edition Year */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Copa do Mundo / Edição
                    </label>
                    <select
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none cursor-pointer"
                    >
                      <option value="Copa 2026">Copa 2026 (Atual)</option>
                      <option value="Copa 2022">Copa 2022 Qatar</option>
                      <option value="Copa 1994">Copa 1994 Retro</option>
                    </select>
                  </div>

                  {/* Condition selector */}
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Estado de Conservação
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none cursor-pointer"
                    >
                      <option value="Impecável">Impecável / MINT (Novíssima)</option>
                      <option value="Nova">Nova (Apenas retirada do sachê)</option>
                      <option value="Usada">Usada (Com pequenas ranhuras)</option>
                    </select>
                  </div>

                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  
                  {/* Rarity */}
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Nível de Raridade
                    </label>
                    <select
                      value={rarity}
                      onChange={(e) => setRarity(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none cursor-pointer"
                    >
                      <option value="Borda de Ouro">Borda de Ouro / Especial</option>
                      <option value="Lendário">Lendária</option>
                      <option value="Raro">Rara</option>
                      <option value="Comum">Comum</option>
                    </select>
                  </div>

                  {/* Pricing tag */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Preço de Venda (R$)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={5000}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none text-right font-mono font-bold text-[#E8C96A]"
                    />
                  </div>

                  {/* Allow trading checkbox */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Disponibilizar p/ Trocas?
                    </label>
                    <select
                      value={isTradeable ? 'Sim' : 'Não'}
                      onChange={(e) => setIsTradeable(e.target.value === 'Sim')}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-2.5 px-2.5 text-xs text-zinc-100 focus:outline-none cursor-pointer text-center"
                    >
                      <option value="Sim">Sim, aceito trocas</option>
                      <option value="Não">Não, apenas venda</option>
                    </select>
                  </div>

                </div>

                {/* Simulated photo drag/drop uploads */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                    Fotos Reais Do Encarte (Validação Visual)
                  </label>
                  
                  <div className="border border-dashed border-zinc-800 rounded-xl p-5 text-center bg-zinc-900/30 hover:bg-zinc-900/60 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSimulatedUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <Upload className="w-8 h-8 text-zinc-650 mx-auto group-hover:text-[#E8C96A] transition-colors" />
                    <p className="text-xs text-zinc-400 font-bold mt-2">Clique ou arraste a imagem aqui</p>
                    <p className="text-[10px] text-zinc-550 mt-1">Carregue fotos de frente e fundo em alta resolução (Máx: 10MB)</p>
                  </div>
                </div>

                {/* Actions submit */}
                <button
                  type="submit"
                  className="w-full py-4 mt-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] hover:to-[#fff3d1] text-[#0A0A0A] cursor-pointer shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                >
                  Confirmar Cadastro da Figurinha
                </button>

              </form>

            </div>

          </div>

          {/* Column 2: Sticker card live render preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="flex items-center justify-between">
              <span className="text-[#E8C96A] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Pré-visualização em tempo real
              </span>
              <span className="text-zinc-500 text-[10px]">Padrão Oficial A Banca</span>
            </div>

            {/* Sticker Rendering component */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <StickerCard
                  sticker={simulatedSticker}
                  isActionable={false}
                />
              </div>
            </div>

            {/* Micro FAQ or info hints inside page column */}
            <div className="glass-card p-5 rounded-2xl border border-zinc-800/40 text-[11px] text-zinc-400 space-y-3 font-light">
              <div className="flex gap-2 text-[#E8C96A] font-bold text-xs uppercase tracking-wider">
                <Info className="w-4 h-4 text-[#E8C96A] shrink-0" />
                <span>PERGUNTAS FREQUENTES</span>
              </div>
              <p>
                <strong className="text-zinc-200 block mt-1">• Há taxas de corretagem do mercado?</strong>
                A Banca retém uma taxa de intermediação física no valor fixo de 8% da venda final para cobrir os custos de selagem por código e postagens.
              </p>
              <p>
                <strong className="text-zinc-200 block">• O que acontece se minha figurinha for recusada na perícia física?</strong>
                Caso o item seja avaliado como falso ou em condição diferente da declarada, cancelamos o faturamento e enviamos de volta a você (frete de retorno por sua conta).
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
