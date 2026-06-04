import { Sticker } from '../types';
import { ShieldCheck, Flame, Star, Award, Sparkles, CheckCircle } from 'lucide-react';

interface StickerCardProps {
  sticker: Sticker;
  onBuy?: (sticker: Sticker) => void;
  onTrade?: (sticker: Sticker) => void;
  currentUserId?: string;
  isActionable?: boolean;
  key?: string | number;
}

export default function StickerCard({
  sticker,
  onBuy,
  onTrade,
  currentUserId,
  isActionable = true,
}: StickerCardProps) {
  const { playerName, team, code, edition, condition, rarity, price, sellerId, sellerName, isTradeable } = sticker;

  const isOwnSticker = currentUserId === sellerId;

  // Determine country specific colors or fallback
  const getCountryTheme = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes('brasil')) return { bg: 'from-amber-600/20 to-emerald-600/20', accent: 'text-yellow-400 bg-emerald-950/60 border-emerald-500/30 font-sans' };
    if (c.includes('argentina')) return { bg: 'from-cyan-600/20 to-sky-600/20', accent: 'text-cyan-200 bg-sky-950/60 border-cyan-500/30' };
    if (c.includes('portugal')) return { bg: 'from-red-600/20 to-emerald-600/20', accent: 'text-red-300 bg-emerald-950/60 border-red-500/30' };
    if (c.includes('frança') || c.includes('franca')) return { bg: 'from-blue-600/20 to-red-600/20', accent: 'text-blue-300 bg-blue-950/60 border-blue-500/30' };
    if (c.includes('croácia') || c.includes('croacia')) return { bg: 'from-red-600/10 via-zinc-800/20 to-red-600/10', accent: 'text-rose-400 bg-zinc-900 border-rose-500/30' };
    return { bg: 'from-zinc-800/30 to-zinc-950/30', accent: 'text-zinc-300 bg-zinc-900/60 border-zinc-700/30' };
  };

  const theme = getCountryTheme(team);

  // Rarity styling
  const getRarityConfig = (rar: string) => {
    switch (rar) {
      case 'Borda de Ouro':
        return {
          border: 'border-2 border-[#E8C96A] shadow-[0_0_20px_rgba(201,168,76,0.35)]',
          badgeBg: 'bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A]',
          icon: <Sparkles className="w-4 h-4" />,
          titleStyle: 'font-extrabold text-[#E8C96A] gold-glow',
          shine: true
        };
      case 'Lendário':
        return {
          border: 'border-2 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
          badgeBg: 'bg-purple-600 text-white',
          icon: <Flame className="w-4 h-4" />,
          titleStyle: 'font-bold text-purple-400',
          shine: true
        };
      case 'Raro':
        return {
          border: 'border border-blue-400/40 shadow-[0_0_10px_rgba(96,165,250,0.2)]',
          badgeBg: 'bg-blue-600 text-white',
          icon: <Star className="w-4 h-4 text-white" />,
          titleStyle: 'font-semibold text-blue-300',
          shine: false
        };
      default:
        return {
          border: 'border border-zinc-700/60',
          badgeBg: 'bg-zinc-800 text-zinc-300',
          icon: <Award className="w-4 h-4 text-zinc-400" />,
          titleStyle: 'font-medium text-zinc-100',
          shine: false
        };
    }
  };

  const rConf = getRarityConfig(rarity);

  return (
    <div className={`relative flex flex-col rounded-xl overflow-hidden glass-card transition-all duration-300 ${isActionable ? 'hover:scale-[1.02] hover:border-[#E8C96A]/40' : ''} ${rConf.border}`}>
      {/* Glossy shine overlay for Legendary / Gold stickers */}
      {rConf.shine && (
        <div className="absolute inset-0 pointer-events-none shine-effect z-10" />
      )}

      {/* Flag / Country Ribbon Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr ${theme.bg} blur-xl opacity-70 rounded-full -mr-10 -mt-10 pointer-events-none`} />

      {/* Badge Rarity */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md bg-black/50 border border-zinc-700/40">
        <span className="text-[#E8C96A]">{rConf.icon}</span>
        <span className="text-zinc-100">{rarity}</span>
      </div>

      {/* Index Score Badge */}
      <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-black/60 border border-zinc-800 text-[#E8C96A] shadow-inner">
        {code}
      </div>

      {/* Card Content Outer */}
      <div className="p-4 pt-12 flex-1 flex flex-col">
        {/* Pitch Circle / Visual Anchor */}
        <div className="mx-auto w-24 h-24 my-3 rounded-full flex items-center justify-center relative bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 shadow-lg overflow-hidden">
          <div className="absolute inset-1 rounded-full border border-dashed border-zinc-600/40" />
          <span className="text-3xl font-black text-zinc-500 tracking-wider">
            {playerName.split(' ').map(n => n[0]).join('')}
          </span>
          {/* Subtle gold halo */}
          {rarity === 'Borda de Ouro' && (
            <div className="absolute inset-0 rounded-full border-2 border-[#E8C96A]/50 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Player Meta Info */}
        <div className="text-center mt-2 flex-1 flex flex-col justify-between">
          <div>
            <h3 className={`text-base truncate ${rConf.titleStyle}`}>
              {playerName}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs text-zinc-400 font-medium">{team}</span>
              <span className="text-[10px] text-zinc-500">•</span>
              <span className="text-[11px] text-zinc-300 font-mono font-medium">{edition}</span>
            </div>
            {/* Condition badge */}
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 capitalize">
              Condição: <span className="font-semibold text-zinc-200">{condition}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60">
            {/* Seller Info */}
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
              <span>Vendedor:</span>
              <span className="text-zinc-300 font-medium truncate max-w-[120px]" title={sellerName}>
                {isOwnSticker ? 'Você (Anúncio)' : sellerName}
              </span>
            </div>

            {/* Price Tag */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-semibold">Valor garantido</span>
              <span className="text-base font-bold text-[#E8C96A] font-mono">
                R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Button Row (only if actionable and not own sticker) */}
      {isActionable && (
        <div className="p-3 bg-zinc-950/60 border-t border-zinc-900 flex gap-2">
          {isOwnSticker ? (
            <div className="w-full text-center py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700/30 flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Seu Anúncio
            </div>
          ) : (
            <>
              {onBuy && (
                <button
                  type="button"
                  onClick={() => onBuy(sticker)}
                  className="flex-1 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] hover:to-[#fff3d1] text-[#0A0A0A] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md hover:shadow-[#C9A84C]/25 hover:shadow-lg"
                >
                  Comprar
                </button>
              )}
              {onTrade && isTradeable && (
                <button
                  type="button"
                  onClick={() => onTrade(sticker)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-[#E8C96A] border border-[#C9A84C]/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
                >
                  Propor Troca
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Safety Intermediation Badge Overlay */}
      <div className="absolute bottom-0 right-0 z-0 opacity-10 p-1 pointer-events-none text-zinc-500">
        <ShieldCheck className="w-16 h-16 mr-[-10px] mb-[-10px]" />
      </div>
    </div>
  );
}
