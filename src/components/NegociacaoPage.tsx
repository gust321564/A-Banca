import React, { useState, useEffect, useRef } from 'react';
import { Negotiation, User, ChatMessage } from '../types';
import { ShieldCheck, Truck, PackageCheck, Send, CheckCircle2, MessageSquare, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

interface NegociacaoPageProps {
  currentUser: User;
  negotiations: Negotiation[];
  onSetNegotiations: (negs: Negotiation[]) => void;
  onUpdateUserBalance: (userId: string, delta: number) => void;
  onNavigate: (page: string) => void;
}

export default function NegociacaoPage({
  currentUser,
  negotiations,
  onSetNegotiations,
  onUpdateUserBalance,
  onNavigate,
}: NegociacaoPageProps) {
  
  // Choose which negotiation to display (default to first active, or allow switching)
  const [activeNegId, setActiveNegId] = useState<string>(negotiations[0]?.id || '');
  const [typedMessage, setTypedMessage] = useState('');
  const [showLabel, setShowLabel] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeNeg = negotiations.find(n => n.id === activeNegId);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeNeg?.chatMessages]);

  if (!activeNeg) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 pt-12 text-center">
        <div className="glass-card p-12 max-w-lg mx-auto rounded-2xl border border-dashed border-zinc-800">
          <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-300">Nenhum Pedido Selecionado</h3>
          <p className="text-xs text-zinc-500 mt-1">Vá ao mercado e compre uma figurinha para iniciar um pedido físico.</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="mt-4 px-4 py-2 bg-[#C9A84C] text-xs font-bold text-black rounded-lg"
          >
            Ir para Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isBuyer = activeNeg.buyerId === currentUser.id;
  const isSeller = activeNeg.sellerId === currentUser.id;
  const isPendingConf = activeNeg.step === 5; // Step 5 = Entregue / Aguardando Aprovação
  const isConcluida = activeNeg.step === 6; // Step 6 = Concluído

  // 6 structural steps
  const stepsTimeline = [
    { num: 1, label: 'Compra Registrada', desc: 'Sua transação foi aceita e o pagamento está seguro no escrow.' },
    { num: 2, label: 'Vendedor Postando', desc: 'Vendedor está empacotando e despachando para os peritos d\'A Banca.' },
    { num: 3, label: 'Inspeção na Banca', desc: 'Cromo físico recebido em nossa filial para teste óptico e validação.' },
    { num: 4, label: 'Selo & Postagem', desc: 'Figurinha aprovada, selada no sleeve protetor e enviada ao comprador.' },
    { num: 5, label: 'Entrega no Destino', desc: 'Pacote entregue no destino do comprador para análise final de recebimento.' },
    { num: 6, label: 'Negócio Concluído', desc: 'Transferência aprovada do escrow direto à conta do vendedor.' }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: isBuyer ? 'Comprador' : 'Vendedor',
      senderName: currentUser.name,
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedNegs = negotiations.map(n => {
      if (n.id === activeNeg.id) {
        return {
          ...n,
          chatMessages: [...n.chatMessages, newMsg]
        };
      }
      return n;
    });

    onSetNegotiations(updatedNegs);
    setTypedMessage('');

    // Trigger funny automated responsive reply from "Banca" after 1.5 seconds
    setTimeout(() => {
      const respMsg: ChatMessage = {
        id: `msg_resp_${Date.now()}`,
        sender: 'Banca',
        senderName: 'Robô d\'A Banca',
        text: `Olá ${currentUser.name}! Suas mensagens estão sendo monitoradas no canal seguro da transação #${activeNeg.id}. A intermediação garante que as duas partes ajam em conformidade.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      onSetNegotiations(updatedNegs.map(n => {
        if (n.id === activeNeg.id) {
          return {
            ...n,
            chatMessages: [...n.chatMessages, newMsg, respMsg]
          };
        }
        return n;
      }));
    }, 1800);
  };

  const handleConfirmReceipt = () => {
    // 1. Advance step to 6 "Concluído"
    // 2. Transfer money to seller (value delta on user balance)
    const updatedNegs = negotiations.map(n => {
      if (n.id === activeNeg.id) {
        return {
          ...n,
          step: 6,
          status: 'Concluído' as any,
          chatMessages: [
            ...n.chatMessages,
            {
              id: `msg_auto_${Date.now()}`,
              sender: 'Banca' as any,
              senderName: 'Intermediador Privado',
              text: 'PARABÉNS! Comprador confirmou o recebimento físico em mãos e liberou a liquidação. Transação concluída com sucesso. R$ ' + activeNeg.value.toFixed(2) + ' foi creditado na conta de ' + activeNeg.sellerName + '.',
              timestamp: 'Agora'
            }
          ]
        };
      }
      return n;
    });

    onSetNegotiations(updatedNegs);
    // pay seller
    onUpdateUserBalance(activeNeg.sellerId, activeNeg.value);
    
    // Alert nicely
    alert('Sucesso absoluto! Cromo recebido e selado. O dinheiro foi transferido ao vendedor. Obrigado por usar A Banca!');
  };

  const handleDispatchCustomCorreios = () => {
    // 1. Set step to 3 (Inspeção na Banca)
    // 2. Set trackingId to "QC981402805BR"
    // 3. Append automated chat message for inspection dispatch
    const updatedNegs = negotiations.map(n => {
      if (n.id === activeNeg.id) {
        return {
          ...n,
          step: 3, // step 3 = Inspeção na Banca
          trackingId: 'QC981402805BR',
          chatMessages: [
            ...n.chatMessages,
            {
              id: `msg_system_ship_${Date.now()}`,
              sender: 'Banca' as any,
              senderName: 'Robô de Logística',
              text: 'SISTEMA: Envio iniciado pelo vendedor sob rastreamento integrado QC981402805BR. Pacote recebido na mesa de nossos peritos em São Paulo/SP para aferição.',
              timestamp: 'Agora'
            }
          ]
        };
      }
      return n;
    });

    onSetNegotiations(updatedNegs);
    alert('Despacho simulado com sucesso! Cromo despachado para inspeção técnica nos peritos d\'A Banca.');
    setShowLabel(false);
  };

  const handleAdvanceStepGeneral = () => {
    const nextStep = Math.min(activeNeg.step + 1, 6);
    let messageText = '';
    
    if (nextStep === 3) {
      messageText = 'SISTEMA: Pacote recebido para perícia física. Teste óptico sob lente microscópica atestou 100% de integridade e autenticidade!';
    } else if (nextStep === 4) {
      messageText = 'SISTEMA: Cromo fisicamente selado em sleeve acrílico d\'A Banca premium. Pacote enviado sob trâmite expresso ao endereço do comprador.';
    } else if (nextStep === 5) {
      messageText = 'SISTEMA: Carteiro dos Correios realizou a entrega garantida no domicílio do comprador.';
    } else if (nextStep === 6) {
      messageText = 'SISTEMA: Transação finalizada com sucesso absoluto. Fundos liquidados.';
    }

    const updatedNegs = negotiations.map(n => {
      if (n.id === activeNeg.id) {
        return {
          ...n,
          step: nextStep,
          chatMessages: [
            ...n.chatMessages,
            {
              id: `msg_advance_${Date.now()}`,
              sender: 'Banca' as any,
              senderName: 'Perícia Técnica',
              text: messageText || `Transação evoluiu para a etapa ${nextStep} do fluxo de custódia física da Banca.`,
              timestamp: 'Agora'
            }
          ]
        };
      }
      return n;
    });

    onSetNegotiations(updatedNegs);
    if (nextStep === 6) {
      onUpdateUserBalance(activeNeg.sellerId, activeNeg.value);
    }
  };

  return (
    <div className="flex-1 bg-zinc-950/20 pt-6 pb-24 px-4 max-w-7xl mx-auto w-full">
      
      {/* Switcher bar of active negotiations if multiple */}
      {negotiations.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-900 overflow-x-auto">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-2 pr-1 shrink-0">Contratos:</span>
          {negotiations.map(n => (
            <button
              key={n.id}
              onClick={() => setActiveNegId(n.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${activeNegId === n.id ? 'bg-[#C9A84C]/15 border border-[#C9A84C]/50 text-[#E8C96A]' : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/30'}`}
            >
              #{n.id} ({n.type})
            </button>
          ))}
        </div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column A: Process Timeline Tracker (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Info */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-850">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase font-mono px-2.5 py-0.5 rounded bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E8C96A]">
                  Intermediação Segura
                </span>
                <h2 className="text-xl font-black text-white mt-1.5">{activeNeg.items}</h2>
                <p className="text-xs text-zinc-500 mt-1">Valor do escrow transacionado: <strong className="text-[#E8C96A] font-mono">R$ {activeNeg.value.toFixed(2)}</strong></p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Rastreamento Físico</span>
                <span className="text-xs font-mono font-bold text-white block mt-0.5 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-850">
                  {activeNeg.trackingId || 'N/D'}
                </span>
              </div>
            </div>
          </div>

          {/* LOGÍSTICA INTEGRADA CORREIOS VIRTUAL VOUCHER */}
          {activeNeg.step < 3 && (
            <div className="glass-card p-5 rounded-2xl border border-zinc-850 space-y-4" id="correios-logistica-panel">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="text-[#C9A84C] w-4 h-4" />
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">
                    Logística Reversa Integrada Correios
                  </h4>
                </div>
                <span className="text-[9px] uppercase font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-bold">
                  Seguro Conveniado Ativo
                </span>
              </div>

              <div className="text-xs text-zinc-400 leading-normal font-light">
                {isSeller ? (
                  <p>Você é o <strong>Vendedor</strong>. Para enviar os cromos físicos sob perícia d'A Banca gratuitamente e com segurança, emita a etiqueta oficial e simule a entrega em qualquer agência conveniada dos Correios.</p>
                ) : (
                  <p>Você é o <strong>Comprador</strong>. O vendedor está preparando o envio. Acompanhe a emissão da etiqueta de postagem garantida com rastreamento eletrônico.</p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={() => setShowLabel(!showLabel)}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold text-[#E8C96A] bg-zinc-900 hover:bg-zinc-800 border border-[#C9A84C]/35 cursor-pointer flex items-center gap-1.5 transition-all text-center"
                >
                  {showLabel ? 'Ocultar Cobertura' : 'Visualizar Etiqueta Oficial d\'A Banca'}
                </button>

                {isSeller && (
                  <button
                    type="button"
                    onClick={handleDispatchCustomCorreios}
                    className="px-4 py-2.5 rounded-lg text-xs font-black bg-gradient-to-r from-amber-400 to-[#E8C96A] text-black cursor-pointer shadow-md hover:brightness-110 active:scale-95 transition-all text-center"
                  >
                    🚀 Simular Entrega na Agência Correios
                  </button>
                )}
              </div>

              {/* Physical Voucher Mock overlay */}
              {showLabel && (
                <div className="p-5 rounded-xl bg-white text-black font-sans space-y-4 border border-zinc-350 shadow-2xl max-w-sm mx-auto text-left relative mt-4 transform scale-100 transition-all duration-300">
                  {/* Stamp */}
                  <span className="absolute top-4 right-4 border-2 border-black px-2 py-0.5 font-mono text-[9px] font-black uppercase text-center rotate-6">
                    A BANCA<br/>ESCROW SEDEX
                  </span>

                  <div className="border-b-[3px] border-black pb-2 text-center">
                    <span className="text-xs font-extrabold tracking-wider block font-sans">CORREIOS BRASIL</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 block mt-0.5 font-mono">Etiqueta de Logística Reversa Conveniada</span>
                  </div>

                  {/* Destination */}
                  <div className="space-y-1 py-1">
                    <span className="text-[8px] uppercase tracking-widest font-extrabold text-zinc-600 block">Destinatário (Central de Triagem d'A Banca):</span>
                    <span className="text-xs font-black block text-zinc-900">A BANCA BRASIL S/A - DEPARTAMENTO DE PERÍCIA ÓPTICA</span>
                    <span className="text-[11px] font-semibold block text-zinc-800">Rua das Flores, 400 - Conjunto 12, Bela Vista</span>
                    <span className="text-xs font-bold block text-zinc-900 font-mono">São Paulo / SP — CEP: 01311-000</span>
                  </div>

                  {/* Origin */}
                  <div className="space-y-1 pt-2 border-t border-dashed border-zinc-400">
                    <span className="text-[8px] uppercase tracking-widest font-extrabold text-zinc-600 block font-sans">Remetente (Colecionador Credenciado):</span>
                    <span className="text-xs font-bold block text-zinc-950">{activeNeg.sellerName}</span>
                    <span className="text-[11px] text-zinc-700 block text-zinc-750">Endereço de Cadastro Ativo nas Diretrizes do Sindicato</span>
                    <span className="text-[11px] text-zinc-800 font-mono font-medium block">Contrato Eletrônico d\'A Banca Garantido</span>
                  </div>

                  {/* Simulated SVG Barcode element */}
                  <div className="pt-4 flex flex-col items-center justify-center space-y-1">
                    <svg className="h-12 w-full text-black" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <rect x="0" y="0" width="2" height="30" fill="currentColor"/>
                      <rect x="3" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="6" y="0" width="4" height="30" fill="currentColor"/>
                      <rect x="12" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="15" y="0" width="3" height="30" fill="currentColor"/>
                      <rect x="20" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="23" y="0" width="2" height="30" fill="currentColor"/>
                      <rect x="27" y="0" width="4" height="30" fill="currentColor"/>
                      <rect x="33" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="36" y="0" width="3" height="30" fill="currentColor"/>
                      <rect x="41" y="0" width="2" height="30" fill="currentColor"/>
                      <rect x="45" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="48" y="0" width="4" height="30" fill="currentColor"/>
                      <rect x="54" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="57" y="0" width="3" height="30" fill="currentColor"/>
                      <rect x="62" y="0" width="2" height="30" fill="currentColor"/>
                      <rect x="66" y="0" width="4" height="30" fill="currentColor"/>
                      <rect x="72" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="75" y="0" width="3" height="30" fill="currentColor"/>
                      <rect x="80" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="83" y="0" width="2" height="30" fill="currentColor"/>
                      <rect x="87" y="0" width="4" height="30" fill="currentColor"/>
                      <rect x="93" y="0" width="1" height="30" fill="currentColor"/>
                      <rect x="96" y="0" width="3" height="30" fill="currentColor"/>
                    </svg>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#0A0A0A]">QC 981 402 805 BR</span>
                  </div>

                  <p className="text-[8px] text-zinc-500 font-normal leading-normal italic text-center pt-2">
                    Declarado sob inspeção fiscal e autenticado com selos holográficos d\'A Banca Brasil. Peso máx: 30g.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* SIMULATE PIPELINE STEP ADVANCER DEV-CONSOLE ON TOP OF TIMELINE */}
          {!isConcluida && (
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 flex justify-between items-center flex-wrap gap-2" id="advance-step-simulator">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Sparkles className="w-4 h-4 text-[#E8C96A] animate-spin-slow" />
                <span>Simulador de Resolução d\'A Banca (Perícia Central)</span>
              </div>
              <button
                type="button"
                onClick={handleAdvanceStepGeneral}
                className="px-3.5 py-1.5 rounded bg-[#C9A84C]/15 border border-[#C9A84C]/45 hover:bg-[#C9A84C] hover:text-black transition-all text-[#E8C96A] text-[10px] font-extrabold uppercase tracking-widest cursor-pointer"
              >
                Avançar Etapa de Custódia ➔
              </button>
            </div>
          )}

          {/* Timeline steps visualization */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-zinc-850 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <PackageCheck className="text-[#E8C96A] w-5 h-5" /> Linha do Tempo de Custódia Física
            </h3>

            {/* Stepper display stack */}
            <div className="relative pl-6 border-l border-zinc-850 space-y-6 ml-3">
              {stepsTimeline.map((step) => {
                const isPassed = activeNeg.step > step.num;
                const isCurrent = activeNeg.step === step.num;
                const isFuture = activeNeg.step < step.num;

                return (
                  <div key={step.num} className="relative">
                    
                    {/* Stepper Dot circle icon */}
                    <div className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border font-mono text-[10px] font-bold transition-all ${
                      isPassed ? 'bg-emerald-500 border-emerald-400 text-black' :
                      isCurrent ? 'bg-[#C9A84C] border-[#E8C96A] text-black shadow-[0_0_10px_rgba(201,168,76,0.35)]' :
                      'bg-zinc-900 border-zinc-700 text-zinc-500'
                    }`}>
                      {step.num}
                    </div>

                    {/* Step description detail */}
                    <div className="space-y-1">
                      <h4 className={`text-xs font-bold ${
                        isPassed ? 'text-zinc-400' :
                        isCurrent ? 'text-[#E8C96A] font-extrabold gold-glow' :
                        'text-zinc-500'
                      }`}>
                        {step.label}
                        {isPassed && <span className="text-[10px] text-emerald-400 font-normal italic ml-2">(Concluído)</span>}
                        {isCurrent && <span className="text-[10px] text-yellow-400 font-bold uppercase ml-2 animate-pulse">● Etapa Atual</span>}
                      </h4>
                      <p className={`text-[11px] leading-relaxed font-light ${
                        isFuture ? 'text-zinc-650' : 'text-zinc-400'
                      }`}>
                        {step.desc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Chat interface */}
          <div className="glass-card rounded-2xl border border-zinc-850 flex flex-col overflow-hidden h-[360px]">
            {/* Header info */}
            <div className="p-4 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold text-zinc-200">Canal de Conversação Protegido</h4>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Transação #{activeNeg.id}</span>
            </div>

            {/* Chat message display area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-950/25">
              {activeNeg.chatMessages.map((msg) => {
                const isBanca = msg.sender === 'Banca';
                const isMe = (msg.sender === 'Comprador' && isBuyer) || (msg.sender === 'Vendedor' && isSeller);

                if (isBanca) {
                  return (
                    <div key={msg.id} className="mx-auto max-w-lg p-3 rounded-xl bg-amber-950/15 border border-[#C9A84C]/20 text-center space-y-1 text-[11px] text-[#E8C96A]">
                      <div className="font-bold flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> COMUNICADO OFICIAL DA BANCA
                      </div>
                      <p className="font-light leading-relaxed">{msg.text}</p>
                      <span className="text-[9px] text-zinc-500 block mt-1">{msg.timestamp}</span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <span className="text-[10px] text-zinc-500 font-bold mb-1 pl-1 pr-1">{msg.senderName}</span>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-[#C9A84C] text-[#0A0A0A] rounded-tr-none' : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-850'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-zinc-650 mt-1 pl-1 pr-1">{msg.timestamp}</span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Send component */}
            <form onSubmit={handleSendMessage} className="p-3 bg-zinc-950/80 border-t border-zinc-900 flex gap-2">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Discuta detalhes de envio, embalagem ou dúvidas..."
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl px-3.5 py-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-3 rounded-xl bg-[#C9A84C] hover:bg-[#E8C96A] text-black cursor-pointer transition-colors"
                title="Enviar Mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

        {/* Column B: Order Summary Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Order Summary card */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Ficha do Contrato
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Número do Pedido:</span>
                <span className="font-mono font-bold text-white">#{activeNeg.id}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Procedimento de:</span>
                <span className="font-bold text-white">{activeNeg.type === 'Compra' ? 'Compra e Venda' : 'Escambo de Câmbio'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Vendedor:</span>
                <span className="font-semibold text-zinc-300">{activeNeg.sellerName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Comprador:</span>
                <span className="font-semibold text-zinc-300">{activeNeg.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Data de Abertura:</span>
                <span className="text-zinc-300 font-mono font-medium">{new Date(activeNeg.createdAt).toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 flex justify-between items-center mt-6">
              <span className="text-xs text-zinc-450">Custódia Segura:</span>
              <span className="text-base font-mono font-extrabold text-[#E8C96A]">
                R$ {activeNeg.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Comprador confirmation button */}
            {isBuyer && isPendingConf && (
              <button
                type="button"
                onClick={handleConfirmReceipt}
                className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black cursor-pointer shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirmar Recebimento Físico
              </button>
            )}

            {isBuyer && !isPendingConf && !isConcluida && (
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-500 text-center leading-normal">
                Você é o <strong>comprador</strong>. O recebimento poderá ser confirmado assim que a Banca aprovar a inspeção e os correios efetuarem a entrega em seu endereço.
              </div>
            )}

            {isSeller && !isConcluida && (
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-500 text-center leading-normal">
                Você é o <strong>vendedor</strong>. Realize a remessa física até nossa matriz d'A Banca. O saque será desbloqueado em sua conta Pix assim que o comprador confirmar a inspeção positiva.
              </div>
            )}

            {isConcluida && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-400 text-center flex items-center justify-center gap-1.5 font-bold leading-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> CONTRATO FINALIZADO E LIQUIDADO PERFEITAMENTE
              </div>
            )}

          </div>

          {/* Quick tips about shipping */}
          <div className="glass-card p-5 rounded-2xl border border-zinc-800/40 text-[11px] text-zinc-500 space-y-2.5 font-light">
            <h4 className="text-xs font-bold text-[#E8C96A] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Segurança de Encarte
            </h4>
            <p>
              Qualquer discordância de estado na triagem d'A Banca é analisada por especialistas independentes. Nós catalogamos os riscos de ponta, marcas do vinco ou ranhuras no alumínio da figurinha.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
