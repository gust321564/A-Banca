import { ArrowRight, ShieldCheck, Truck, Scale, CheckCircle2, MessageCircle, AlertTriangle, Users2, Swords } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  currentUser: any;
  onLogout: () => void;
}

export default function LandingPage({ onNavigate, currentUser, onLogout }: LandingPageProps) {
  return (
    <div className="min-h-screen dark-gradient flex flex-col selection:bg-[#E8C96A] selection:text-[#0A0A0A]">
      
      {/* Hero Section Container */}
      <section className="relative px-4 pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
        {/* Decorative gold mesh background details */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-gradient-to-r from-amber-600/10 to-[#C9A84C]/5 blur-3xl -z-10 pointer-events-none" />

        {/* Brand Tagline Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-900/80 border border-[#C9A84C]/30 text-[#E8C96A] mb-6 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
          <ShieldCheck className="w-4 h-4 text-[#E8C96A]" /> INTERMEDIAÇÃO FÍSICA 100% GARANTIDA
        </div>

        <h1 className="text-4xl md:text-7xl font-black font-sans tracking-tight text-white leading-none">
          Plataforma <span className="gold-text-gradient font-extrabold">A Banca</span>
        </h1>
        <p className="text-lg md:text-2xl text-zinc-300 max-w-3xl mt-4 font-light tracking-wide">
          A vitrine oficial da sua coleção. Compre, venda e troque figurinhas raras com a segurança absoluta do nosso cofre de intermediação física.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center w-full max-w-md">
          {currentUser ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 py-4 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] hover:to-[#fff3d1] text-[#0A0A0A] transition-all transform hover:scale-[1.03] shadow-lg hover:shadow-[#C9A84C]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              Acessar Painel <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="flex-1 py-4 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] hover:to-[#fff3d1] text-[#0A0A0A] transition-all transform hover:scale-[1.03] shadow-lg hover:shadow-[#C9A84C]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Entrar na Conta <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex-1 py-4 px-6 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-750 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Ver Mercado
              </button>
            </>
          )}
        </div>

        {/* Floating Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mt-16 text-center">
          {[
            { value: '12.450+', label: 'Figurinhas Transacionadas', icon: <CheckCircle2 className="w-4 h-4 text-[#E8C96A]" /> },
            { value: 'Zero', label: 'Golpes ou Perdas', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
            { value: '100%', label: 'Avaliações Físicas de Autenticidade', icon: <Scale className="w-4 h-4 text-[#E8C96A]" /> },
            { value: '< 24h', label: 'Envio para a Transportadora', icon: <Truck className="w-4 h-4 text-sky-400" /> },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center gap-1 border-t border-t-zinc-850">
              <span className="flex items-center gap-1.5 text-2xl font-black text-white font-mono">
                {stat.icon} {stat.value}
              </span>
              <span className="text-xs text-zinc-400 tracking-normal font-sans font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="bg-zinc-950/40 border-t border-b border-zinc-900/60 py-20 px-4">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Como Funciona a <span className="text-[#E8C96A]">Intermediação Física?</span>
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mt-3">
            Acabe com o medo de falsificações, amassados ou sumiço de correspondências. A Banca cuida de tudo fisicamente por você.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full text-left">
            {[
              {
                step: '01',
                title: 'Vendedor Envia para A Banca',
                desc: 'Assim que a venda é fechada ou a proposta de troca é selada, as figurinhas são postadas para o nosso hub físico de autenticação.',
                highlight: 'Dinheiro ou figurinhas enviadas ficam blindados no cofre digital.'
              },
              {
                step: '02',
                title: 'Inspeção & Certificação',
                desc: 'Nossa banca de especialistas avalia as figurinhas fisicamente: testamos autenticidade holográfica, condição real da borda e qualidade do material.',
                highlight: 'Processo completo gravado em vídeo e certificado pelo selo A Banca.'
              },
              {
                step: '03',
                title: 'Destinatário Recebe e Desbloqueia',
                desc: 'Figurinhas originais certificadas são re-despachadas em embalagens de segurança máxima. O pagamento só é transferido ao vendedor no final.',
                highlight: 'Satisfação garantida ou devolução automática do valor.'
              }
            ].map((card, i) => (
              <div key={i} className="relative glass-card p-8 rounded-2xl border border-zinc-800/40 flex flex-col justify-between">
                <div>
                  <span className="text-5xl font-black text-[#E8C96A]/20 block mb-4 font-mono">{card.step}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">{card.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-900 text-xs font-semibold text-[#E8C96A] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E8C96A] shrink-0" />
                  <span>{card.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguranca Detalhes Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#E8C96A] uppercase mb-2 block">COFRE BLINDADO</span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Nenhuma figurinha sai e nenhum valor circula sem validação.
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-4 leading-relaxed font-light">
            Desenvolvemos o primeiro sistema de escrow de troca física no Brasil. Se você está negociando um Neymar de R$ 500 ou um Messi Borda de Ouro, você merece a tranquilidade de saber que receberá exatamente o que pagou.
          </p>

          <div className="space-y-4 mt-8">
            {[
              { title: 'Selo Físico Holográfico exclusivo', desc: 'Cada figurinha aprovada viaja protegida em sleeve selado com QR Code de autenticidade.' },
              { title: 'Custódia Completa de Trocas', desc: 'Para trocas 1x1 ou combos, só liberamos os envios finais quando a equipe receber os dois pacotes corretos.' },
              { title: 'Suporte de Disputas Especializado', desc: 'Em caso de discordância de estado, a Banca decide de forma técnica baseada em critérios de colecionismo.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">{item.title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Mock Showcase (Sticker & Verification Seal UI) */}
        <div className="glass-card rounded-2xl p-6 relative border border-[#C9A84C]/30 overflow-hidden">
          <div className="absolute top-0 right-0 p-3 z-10">
            <span className="text-[10px] bg-red-650 text-white font-mono font-bold px-2.5 py-1 rounded">AUDITADO FISICAMENTE</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="mx-auto w-40 h-48 rounded-xl border-2 border-[#E8C96A] bg-zinc-900/90 relative p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none opacity-20 pointer-events-none">
                <span className="text-5xl font-black text-white font-serif">A</span>
              </div>
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] font-bold text-[#E8C96A]">ARG 10</span>
                <span className="text-[9px] bg-[#E8C96A] text-black px-1 rounded font-bold uppercase">GOLD</span>
              </div>
              <div className="mx-auto w-14 h-14 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-black text-zinc-300 shadow">
                LM
              </div>
              <div className="text-center z-10">
                <div className="text-xs font-bold text-[#E8C96A] truncate">Lionel Messi</div>
                <div className="text-[9px] text-zinc-400">Argentina • Copa 22</div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <h4 className="text-base font-bold text-[#E8C96A] flex items-center gap-1.5 leading-tight">
                <ShieldCheck className="w-4 h-4" /> Laudo de Inspeção
              </h4>
              <p className="text-xs text-zinc-500">Inspeção física realizada em 04 de Junho de 2026</p>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between border-b border-zinc-850 pb-1">
                  <span className="text-zinc-400">Gramatura / Peso:</span>
                  <span className="text-emerald-400 font-mono">0.82g (APROVADO)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1">
                  <span className="text-zinc-400">Micro-holograma:</span>
                  <span className="text-emerald-400 font-mono">Original (APROVADO)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1">
                  <span className="text-zinc-400">Acabamento do verso:</span>
                  <span className="text-emerald-400 font-mono">Excelente (APROVADO)</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-zinc-400">Avaliação Visual:</span>
                  <span className="text-yellow-400 font-mono font-medium">Impecável / Mint</span>
                </div>
              </div>
              <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300 leading-normal flex gap-1.5 items-start mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Esta figurinha passou em todos os testes e foi selada no cofre número #B-9281.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="bg-zinc-950/60 py-20 px-4 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto w-full text-center">
          <span className="text-xs font-bold tracking-widest text-[#E8C96A] uppercase">COMUNIDADE COLECIONADORA</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-1">Quem usa, aprova</h2>
          <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-lg mx-auto leading-relaxed">
            Veja o depoimento de colecionadores reais que finalizaram seu álbum oficial sem dores de cabeça.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full text-left">
            {[
              {
                text: 'Eu ficava morrendo de medo de comprar o Neymar Borda de Ouro de estranhos na internet e vir réplica da China. Pela Banca, paguei R$ 450, o vendedor enviou pra eles, eles provaram que era 100% verdadeira e me mandaram no sleeve lacrado. Sensacional!',
                author: 'Felipe Dutra',
                city: 'São Paulo - SP',
                role: 'Colecionador de Lendárias'
              },
              {
                text: 'Fiz a troca do Mbappé Lendário por um Vinicius Jr e duas figurinhas especiais. É a primeira vez na vida que consigo propor uma troca física de figurinhas pelo correio sem medo de ser roubado. A Banca serve como um porto seguro de verdade.',
                author: 'Mariana Rezende',
                city: 'Belo Horizonte - MG',
                role: 'Trocadora Ativa'
              },
              {
                text: 'Como vendedor, é excelente. O comprador paga antes, o dinheiro fica reservado. Envio o envelope pra Banca, eles validam o estado da figurinha e mandam ao cliente. O saque via pix cai na hora que o comprador recebe. Zero estresse!',
                author: 'Carlos Eduardo',
                city: 'Curitiba - PR',
                role: 'Vendedor Profissional'
              }
            ].map((dep, idx) => (
              <div key={idx} className="glass-card p-6.5 rounded-2xl border border-zinc-850 flex flex-col justify-between">
                <p className="text-xs text-zinc-300 leading-relaxed font-light italic">"{dep.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center font-bold text-sm text-[#E8C96A]">
                    {dep.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-none">{dep.author}</h5>
                    <span className="text-[10px] text-zinc-500 block mt-1">{dep.city} • <span className="text-[#E8C96A]">{dep.role}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 text-center max-w-5xl mx-auto w-full relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#C9A84C]/10 blur-3xl pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-black text-white">Pronto para o próximo nível?</h2>
        <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto mt-3 font-light">
          Chega de trocar figurinhas em esquinas escuras ou acumular calotes online. Junte-se à maior banca certificadora de colecionáveis do país.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="mt-8 px-8 py-4 rounded-xl text-sm font-bold bg-[#C9A84C] hover:bg-[#E8C96A] text-[#0A0A0A] inline-flex items-center gap-2 transform hover:scale-105 transition-all shadow-lg shadow-[#C9A84C]/25 cursor-pointer"
        >
          Criar Minha Conta Grátis <ArrowRight className="w-4.5 h-4.5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 pb-12 pt-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5 tracking-tight font-sans">
              <span className="text-[#E8C96A]">A BANCA</span>
            </h3>
            <p className="text-[#E8C96A] text-xs font-semibold uppercase tracking-widest mt-1">
              A vitrine oficial da sua coleção
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed font-light mt-4">
              Primeiro sistema de intermediação física de figurinhas do Brasil. Protegendo colecionadores desde as eliminatórias.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest mb-4">Garantias</h4>
            <ul className="space-y-2 text-xs text-zinc-500 font-light">
              <li>• Perícia Física Certificada</li>
              <li>• Escrow de Fundos via PIX</li>
              <li>• Repostagem em embalagem ultra-resistente</li>
              <li>• Disputas com suporte técnico</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest mb-4">Suporte & Regras</h4>
            <ul className="space-y-2 text-xs text-zinc-500 font-light">
              <li className="hover:text-white cursor-pointer">• Termos de Uso</li>
              <li className="hover:text-white cursor-pointer">• Como funciona o envio</li>
              <li className="hover:text-white cursor-pointer">• Critérios de Avaliação</li>
              <li className="hover:text-white cursor-pointer">• Fale Conosco</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest mb-4">Acompanhe seu Pedido</h4>
            <p className="text-xs text-zinc-500 font-light leading-relaxed mb-3">
              Insira o código de rastreamento recebido para checar o status físico.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: BR-BANCA-9281A"
                className="flex-1 rounded bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#E8C96A]"
              />
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3 bg-[#C9A84C] text-[10px] uppercase font-bold text-[#0A0A0A] rounded hover:bg-[#E8C96A]"
              >
                Rastrear
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600">
          <p>© 2026 A Banca Intermediadora Ltda. CNPJ: 42.109.928/0001-90. Todos os direitos reservados.</p>
          <p className="mt-2 sm:mt-0">Desenvolvido com carinho para colecionadores exigentes.</p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5511999999999?text=Quero%20ajuda%20com%20minhas%20figurinhas!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
        title="Falar com Especialista"
      >
        <MessageCircle className="w-6 h-6 z-10" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold font-sans pr-0 group-hover:pr-1 group-hover:pl-2 whitespace-nowrap">
          Suporte A Banca
        </span>
      </a>
    </div>
  );
}
