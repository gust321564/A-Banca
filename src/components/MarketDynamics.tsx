import { useState } from 'react';
import { AreaChart, TrendingUp, DollarSign, Activity, Settings, Info, ShoppingBag, BarChart2 } from 'lucide-react';

export default function MarketDynamics() {
  const [estimatePlayer, setEstimatePlayer] = useState('Neymar Jr');
  const [estimateRarity, setEstimateRarity] = useState<'Comum' | 'Raro' | 'Lendário' | 'Borda de Ouro'>('Borda de Ouro');
  const [estimateCondition, setEstimateCondition] = useState<'Impecável' | 'Nova' | 'Usada'>('Impecável');

  // Dynamic price evaluation logic
  const calculateEstimate = () => {
    let base = 50.0;
    
    // Player multiplier
    if (estimatePlayer === 'Lionel Messi') base = 90.0;
    if (estimatePlayer === 'Neymar Jr') base = 65.0;
    if (estimatePlayer === 'Cristiano Ronaldo') base = 75.0;
    if (estimatePlayer === 'Vinicius Jr') base = 45.0;

    // Rarity multiplier
    const rarityMultiplier = {
      'Comum': 0.3,
      'Raro': 1.5,
      'Lendário': 4.5,
      'Borda de Ouro': 8.5
    };
    
    // Condition multiplier
    const conditionMultiplier = {
      'Usada': 0.6,
      'Nova': 1.0,
      'Impecável': 1.4
    };

    const finalPrice = base * (rarityMultiplier[estimateRarity] || 1) * (conditionMultiplier[estimateCondition] || 1);
    
    // Scarcity percentage index tracker
    let scarcityPct = 95;
    if (estimateRarity === 'Comum') scarcityPct = 15;
    if (estimateRarity === 'Raro') scarcityPct = 48;
    if (estimateRarity === 'Lendário') scarcityPct = 82;

    return {
      price: finalPrice,
      scarcity: scarcityPct,
      demand: scarcityPct > 80 ? 'Altíssima 🔥' : scarcityPct > 45 ? 'Moderada 📈' : 'Normal 🪵',
      volume: scarcityPct > 60 ? '112 transações / hora' : '15 transações / hora'
    };
  };

  const currentDeal = calculateEstimate();

  return (
    <div className="space-y-8 animate-fade-in" id="market-dynamics-container">
      
      {/* Intro info heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-[#E8C96A] text-lg font-black uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#E8C96A]" />
            BOLSA DE QUANTIDADE & PREÇOS DINÂMICOS
          </h3>
          <p className="text-zinc-500 text-xs font-light max-w-xl">
            Acompanhe o valor de cotação das figurinhas no cofre central em tempo real. Nosso algoritmo analisa raridade física, estado de conservação e demanda dos compradores para estimar preços de mercado fidedignos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Real-time price chart (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-5">
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[9px] text-[#E8C96A] font-bold uppercase tracking-widest block font-mono">• BANCA INDEX CORE</span>
                <h4 className="text-sm font-black text-white">Gráfico de Histórico de Cotações</h4>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-900/60 pl-3 pr-2.5 py-1.5 rounded-xl border border-zinc-800 text-[10px] text-zinc-400">
                <span>Período:</span>
                <select className="bg-transparent font-bold text-[#E8C96A] outline-none cursor-pointer">
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                </select>
              </div>
            </div>

            {/* Bespoke native responsive SVG Area Chart */}
            <div className="relative pt-4" id="scarcity-svg-chart">
              
              <div className="h-56 w-full bg-zinc-950/70 border border-zinc-900 rounded-xl relative p-3 overflow-hidden flex flex-col justify-end">
                
                {/* Horizontal guide lines */}
                <div className="absolute inset-x-0 top-1/4 border-b border-zinc-900/40 pointer-events-none" />
                <div className="absolute inset-x-0 top-2/4 border-b border-zinc-900/40 pointer-events-none" />
                <div className="absolute inset-x-0 top-3/4 border-b border-zinc-900/40 pointer-events-none" />

                {/* SVG Area spline */}
                <svg className="absolute inset-0 w-full h-[85%] mt-auto" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>
                  
                  {/* Spline area */}
                  <path 
                    d="M 0 160 Q 75 140 120 90 T 250 85 T 380 40 T 500 15 L 500 200 L 0 200 Z" 
                    fill="url(#chart-gold)" 
                  />
                  
                  {/* Stroke line */}
                  <path 
                    d="M 0 160 Q 75 140 120 90 T 250 85 T 380 40 T 500 15" 
                    fill="none" 
                    stroke="#E8C96A" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                  />

                  {/* Highlight dots */}
                  <circle cx="120" cy="90" r="4.5" fill="#FAF8F5" stroke="#C9A84C" strokeWidth="2" />
                  <circle cx="380" cy="40" r="4.5" fill="#FAF8F5" stroke="#C9A84C" strokeWidth="2" />
                  <circle cx="500" cy="15" r="4.5" fill="#C9A84C" stroke="#fff" strokeWidth="2.5" className="animate-ping" />
                </svg>

                {/* Bottom months labels */}
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-zinc-550 pt-2 z-10">
                  <span>SEG (R$ 180)</span>
                  <span>TER (R$ 210)</span>
                  <span>QUA (R$ 290)</span>
                  <span>QUI (R$ 380)</span>
                  <span>SEX (R$ 490)</span>
                  <span>HOJE (R$ 520)</span>
                </div>

                {/* Top tooltip bubble marker */}
                <div className="absolute top-4 right-4 bg-[#C9A84C]/10 border border-[#C9A84C]/40 px-2.5 py-1.5 rounded-lg text-right">
                  <span className="text-[8px] text-zinc-400 uppercase tracking-wider block font-bold">Pico de Demanda</span>
                  <span className="text-xs font-mono font-black text-[#E8C96A] block mt-0.5">+48% no Mês</span>
                </div>

              </div>

            </div>

            {/* Quick stats items */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-900">
                <span className="text-[8px] text-zinc-500 uppercase block font-bold">Volume Acumulado</span>
                <span className="text-xs font-mono font-bold text-white mt-1 block">R$ 412.500,00</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-900">
                <span className="text-[8px] text-zinc-500 uppercase block font-bold">Inspeções Concluídas</span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block">14.810 un</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-900">
                <span className="text-[8px] text-zinc-500 uppercase block font-bold">Taxa Escrow Média</span>
                <span className="text-xs font-mono font-bold text-indigo-400 mt-1 block">3.2 minutos</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Price Simulator Calculator panel (5 columns) */}
        <div className="lg:col-span-12 xl:col-span-5">
          <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-6">
            
            <div className="border-b border-zinc-900 pb-3">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-amber-500" /> Calculadora de Escassez
              </h4>
              <p className="text-[10px] text-zinc-500 font-light mt-0.5">Selecione as variáveis para projetar o valor de venda fiduciário sintonizado.</p>
            </div>

            <div className="space-y-4">
              
              {/* Select Player */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Cromo / Jogador</label>
                <select
                  value={estimatePlayer}
                  onChange={(e) => setEstimatePlayer(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white cursor-pointer"
                >
                  <option value="Neymar Jr">Neymar Jr (Brasil)</option>
                  <option value="Lionel Messi">Lionel Messi (Argentina)</option>
                  <option value="Cristiano Ronaldo">Cristiano Ronaldo (Portugal)</option>
                  <option value="Vinicius Jr">Vinicius Jr (Brasil)</option>
                </select>
              </div>

              {/* Rarity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Raridade</label>
                  <select
                    value={estimateRarity}
                    onChange={(e) => setEstimateRarity(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-2.5 text-xs text-white cursor-pointer"
                  >
                    <option value="Borda de Ouro">Borda de Ouro</option>
                    <option value="Lendário">Lendário</option>
                    <option value="Raro">Raro</option>
                    <option value="Comum">Comum</option>
                  </select>
                </div>

                {/* Condition */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Conservação</label>
                  <select
                    value={estimateCondition}
                    onChange={(e) => setEstimateCondition(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-2.5 text-xs text-white cursor-pointer"
                  >
                    <option value="Impecável">MINT (Impecável)</option>
                    <option value="Nova">Nova</option>
                    <option value="Usada">Usada</option>
                  </select>
                </div>
              </div>

              {/* Calculated Estimator Box display */}
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-[#C9A84C]/25 text-center space-y-4 relative overflow-hidden">
                <span className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl" />
                <span className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />

                <div>
                  <span className="text-[9px] text-[#E8C96A] font-bold uppercase tracking-widest block font-mono">AVALIAÇÃO DE COFRE ESTIMADA:</span>
                  <p className="text-3xl font-black text-white font-mono mt-2 tracking-tight">
                    R$ {currentDeal.price.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-zinc-900 text-[10px] text-zinc-400">
                  <div>
                    <span className="text-[8px] text-zinc-500 uppercase block font-semibold">Índice Escassez:</span>
                    <span className="font-bold text-zinc-300 block">{currentDeal.scarcity}% do Sindicato</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-zinc-500 uppercase block font-semibold">Demanda Central:</span>
                    <span className="font-bold text-[#E8C96A] block">{currentDeal.demand}</span>
                  </div>
                </div>

              </div>

              <div className="flex gap-2 p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl items-start">
                <Info className="w-4 h-4 text-[#E8C96A] shrink-0 mt-0.5" />
                <p className="text-[9px] text-zinc-400 font-light leading-relaxed">
                  Os valores exibidos servem como recomendação de venda baseados nos registros de escrow das últimas 48 horas úteis d'A Banca.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
