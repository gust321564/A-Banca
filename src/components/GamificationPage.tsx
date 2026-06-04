import { useState } from 'react';
import { Award, CheckCircle, ShieldCheck, Star, StarOff, Trophy, Flame, HelpCircle } from 'lucide-react';
import { User } from '../types';

interface GamificationPageProps {
  currentUser: User;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  target: number;
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function GamificationPage({ currentUser }: GamificationPageProps) {
  // Mock weekly quests and badges list
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'q_1',
      title: 'Vendedor Exemplar',
      description: 'Cadastre 3 novas figurinhas no seu acervo virtual para negociações.',
      points: 25,
      progress: 2,
      target: 3,
      completed: false,
    },
    {
      id: 'q_2',
      title: 'Mestre do Tinder',
      description: 'Dê match e realize proposta de troca na plataforma utilizando o swipe deck.',
      points: 30,
      progress: 1,
      target: 1,
      completed: true,
    },
    {
      id: 'q_3',
      title: 'Lente Holográfica',
      description: 'Utilize o scanner inteligente de álbum em tempo real para ler figurinhas.',
      points: 20,
      progress: 0,
      target: 1,
      completed: false,
    },
    {
      id: 'q_4',
      title: 'Presença VIP',
      description: 'Confirme sua presença no encontro presencial de colecionadores de sua região.',
      points: 15,
      progress: 1,
      target: 1,
      completed: true,
    }
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 'b_1',
      name: 'Pioneiro da Banca',
      description: 'Desbloqueado ao participar da fundação do Sindicato de Escrow.',
      icon: '🏛️',
      unlocked: true,
    },
    {
      id: 'b_2',
      name: 'Perito Holográfico',
      description: 'Escanear mais de 10 páginas do álbum com visão computacional.',
      icon: '👁️‍🗨️',
      unlocked: false,
    },
    {
      id: 'b_3',
      name: 'Comerciante Sagaz',
      description: 'Concluir 5 transações de intermediação física sem disputas.',
      icon: '🛡️',
      unlocked: true,
    },
    {
      id: 'b_4',
      name: 'Coração de Ouro',
      description: 'Doar ou trocar figurinha comum para ajudar iniciantes do Wishlist.',
      icon: '💛',
      unlocked: false,
    }
  ]);

  const handleClaimPoints = (questId: string) => {
    setQuests(prev =>
      prev.map(q => {
        if (q.id === questId) {
          return { ...q, progress: q.target, completed: true };
        }
        return q;
      })
    );
    alert('Missão concluída com maestria! Seus pontos de confiabilidade e badges de reputação foram faturados.');
  };

  // Stats
  const repPoints = 85; // Initial mock score
  const totalCompleted = quests.filter(q => q.completed).length;

  return (
    <div className="space-y-8 animate-fade-in" id="gamification-page-container">
      
      {/* Intro section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-[#E8C96A] text-lg font-black uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500 animate-pulse" />
            CONFIABILIDADE & SISTEMA DE MISSÕES
          </h3>
          <p className="text-zinc-500 text-xs font-light max-w-xl">
            Sua reputação e engajamento na Banca são convertidos em níveis de confiabilidade. Evite golpes, complete tarefas da semana, destrave insígnias exclusivas e mostre que você é um colecionador 100% confiável para negociar!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Reputation Meter & Verification trust metrics (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl border-l-2 border-l-emerald-500 space-y-6">
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">ÍNDICE DE CONFIABILIDADE</span>
                <h4 className="text-xl font-bold text-white mt-1">Colecionador Nível Gold</h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                Selo de Garantia Ativo
              </span>
            </div>

            {/* Reputation score big badge */}
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-850 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block">Score de Troca Seguro</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-400 font-mono">98</span>
                  <span className="text-xs text-zinc-500 font-light font-sans">/ 100 pontos</span>
                </div>
              </div>
              <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
            </div>

            {/* Ratings stars review table */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Avaliações das Últimas Intermediações:</span>
              
              <div className="space-y-2.5">
                {[
                  { name: 'Excelente vendedor!', reviewer: 'Enzo Comprador', date: '3 dias atrás', stars: 5, comment: 'Embalagem impecável com protetor plástico. Postagem rápida!' },
                  { name: 'Troca justa e honesta', reviewer: 'Marcos Vendedor', date: '1 semana atrás', stars: 5, comment: 'Item autêntico na inspeção d\'A Banca. Recomendo muito.' }
                ].map((rating, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-950/40 border border-zinc-900 space-y-1.5 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-300">{rating.reviewer}</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(st => (
                          <Star key={st} className="w-3 h-3 fill-current text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 italic">"{rating.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispute security trust badge */}
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[10px] text-emerald-300 font-normal leading-relaxed">
                Reputação Imbatível: 0 disputas registradas, 100% de envios tempestivos em menos de 24h úteis ao centro d'A Banca.
              </p>
            </div>

          </div>
        </div>

        {/* Right column: Weekly Quests list + unlocked badges (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Weekly Tasks list */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-950 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Missões da Semana</h4>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">Complete estas tarefas para acumular pontuação de segurança e score.</p>
              </div>
              <span className="text-[10px] bg-yellow-500/15 text-amber-500 px-2 py-0.5 rounded font-bold font-mono">
                {totalCompleted} de {quests.length} Feitas
              </span>
            </div>

            <div className="space-y-3.5">
              {quests.map(q => (
                <div 
                  key={q.id} 
                  className={`p-3.5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-colors ${
                    q.completed 
                      ? 'bg-zinc-900/30 border-zinc-900 text-zinc-500' 
                      : 'bg-zinc-900/60 border-zinc-850 text-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${q.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
                        {q.title}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 bg-yellow-950/50 text-[#E8C96A] rounded font-mono">
                        +{q.points} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-light leading-relaxed max-w-sm">
                      {q.description}
                    </p>
                  </div>

                  <div className="shrink-0 w-full md:w-auto text-right">
                    {q.completed ? (
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Cumprida
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimPoints(q.id)}
                        className="w-full md:w-auto px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-[#E8C96A] border border-[#C9A84C]/30 cursor-pointer transition-all"
                      >
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Badges unlocked showcase */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Suas Insígnias d'A Banca</h4>
              <p className="text-[10px] text-zinc-500 font-light mt-0.5">Badges especiais desbloqueados por atividades no Sindicato de Coleções.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map(b => (
                <div 
                  key={b.id} 
                  className={`p-3.5 rounded-xl border flex items-start gap-3.5 transition-all ${
                    b.unlocked 
                      ? 'bg-zinc-900/40 border-zinc-800/60 text-white shadow-sm' 
                      : 'bg-zinc-950/20 border-zinc-955 opacity-40 text-zinc-600'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-1 rounded-lg bg-zinc-950 border border-zinc-900 select-none">{b.icon}</span>
                  <div className="space-y-0.5 text-left">
                    <h5 className="text-xs font-black">{b.name}</h5>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-light">{b.description}</p>
                    {b.unlocked && (
                      <span className="text-[8px] uppercase tracking-widest font-black text-emerald-500 block mt-1.5">Destravada</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
