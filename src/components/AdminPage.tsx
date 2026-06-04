import { useState } from 'react';
import { Sticker, User, Negotiation } from '../types';
import { ShieldAlert, BarChart3, Users, Scale, FileCheck2, ArrowRightLeft, Check, X, ShieldCheck, Play, HelpCircle } from 'lucide-react';

interface AdminPageProps {
  currentUser: User;
  stickers: Sticker[];
  negotiations: Negotiation[];
  onSetStickers: (stickers: Sticker[]) => void;
  onSetNegotiations: (negotiations: Negotiation[]) => void;
  onNavigate: (page: string) => void;
  onAddNotification: (
    title: string,
    text: string,
    type: 'proposta' | 'envio' | 'pagamento' | 'inspeção' | 'geral',
    userId: string,
    linkPage?: string
  ) => void;
}

export default function AdminPage({
  currentUser,
  stickers,
  negotiations,
  onSetStickers,
  onSetNegotiations,
  onNavigate,
  onAddNotification,
}: AdminPageProps) {
  
  const [activeTab, setActiveTab] = useState<'geral' | 'cadastros' | 'inspecoes'>('geral');

  // Hardcoded Users list for sim
  const [adminUsersList, setAdminUsersList] = useState<any[]>([
    { id: 'u_1', name: 'Thiago Admin', email: 'admin@abanca.com', role: 'Administrador', status: 'Ativo' },
    { id: 'u_2', name: 'Marcos Vendedor', email: 'vendedor@abanca.com', role: 'Vendedor', status: 'Ativo' },
    { id: 'u_3', name: 'Enzo Comprador', email: 'comprador@abanca.com', role: 'Comprador', status: 'Ativo' },
    { id: 'u_4', name: 'Felipe Dutra', email: 'felipe@gmail.com', role: 'Comprador', status: 'Ativo' },
    { id: 'u_5', name: 'Mariana Rezende', email: 'mariana@hotmail.com', role: 'Trocadora', status: 'Ativo' }
  ]);

  // Statistics
  const totalUsers = adminUsersList.length;
  const activeEscrowsCount = negotiations.filter(n => n.step < 6).length;
  const totalVolumeAmount = negotiations.reduce((acc, curr) => acc + curr.value, 0) + 12450.00; // adding baseline history
  const pendingApprovalsList = stickers.filter(s => !s.approved);
  const openDisputesCount = negotiations.filter(n => n.status === 'Em Disputa').length;

  const handleToggleUserBlock = (userId: string) => {
    setAdminUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'Ativo' ? 'Bloqueado' : 'Ativo'
        };
      }
      return u;
    }));
  };

  const handleApproveSticker = (stickerId: string) => {
    const matched = stickers.find(s => s.id === stickerId);
    const updated = stickers.map(s => {
      if (s.id === stickerId) {
        return { ...s, approved: true };
      }
      return s;
    });
    onSetStickers(updated);

    if (matched) {
      onAddNotification(
        'Anúncio Homologado!',
        `Seu cromo ${matched.playerName} (${matched.code}) foi auditado eletronicamente e liberado para o mercado d'A Banca.`,
        'geral',
        matched.sellerId,
        'dashboard'
      );
    }

    alert('Anúncio aprovado! A figurinha já está listada publicamente no mercado de compra.');
  };

  const handleRejectSticker = (stickerId: string) => {
    const matched = stickers.find(s => s.id === stickerId);
    const updated = stickers.map(s => {
      if (s.id === stickerId) {
        return { ...s, approved: false, sellerId: 'rejected' }; // simulated soft-deleted
      }
      return s;
    });
    onSetStickers(updated.filter(s => s.sellerId !== 'rejected'));

    if (matched) {
      onAddNotification(
        'Anúncio Rejeitado',
        `Seu cromo ${matched.playerName} (${matched.code}) foi reprovado por nossa equipe de moderação.`,
        'geral',
        matched.sellerId,
        'vender'
      );
    }

    alert('Anúncio rejeitado com sucesso. O vendedor será alertado.');
  };

  // Helper inside physical validation: avance the step of escrow
  const handleAdvanceEscrowStep = (negId: string) => {
    const matched = negotiations.find(n => n.id === negId);
    if (!matched) return;

    let nextStep = matched.step + 1;
    let nextStatus = matched.status;

    if (nextStep === 2) {
      nextStatus = 'Recebido pela Banca (Em Triagem)' as any;
    } else if (nextStep === 3) {
      nextStatus = 'Recebido pela Banca (Em Triagem)' as any;
    } else if (nextStep === 4) {
      nextStatus = 'Inspeção Aprovada - Produto em Trânsito para Comprador' as any;
    } else if (nextStep === 5) {
      nextStatus = 'Aguardando confirmação de recebimento' as any;
    } else if (nextStep === 6) {
      nextStatus = 'Concluído' as any;
    }

    const updated = negotiations.map(n => {
      if (n.id === negId) {
        const adminChatMsg = {
          id: `msg_admin_${Date.now()}`,
          sender: 'Banca' as any,
          senderName: 'Intermediador Privado',
          text: `A BANCA ATUALIZOU O RASTREAMENTO FÍSICO: Transação avançou para a etapa #${nextStep}: ${nextStatus}.`,
          timestamp: 'Agora'
        };

        return {
          ...n,
          step: nextStep,
          status: nextStatus,
          chatMessages: [...n.chatMessages, adminChatMsg]
        };
      }
      return n;
    });

    onSetNegotiations(updated);

    // Alert both members
    onAddNotification(
      'Custódia Física Atualizada',
      `O contrato #${negId} (${matched.items}) avançou para Etapa ${nextStep}: ${nextStatus}.`,
      'inspeção',
      matched.buyerId,
      'negociacao'
    );

    if (matched.sellerId) {
      onAddNotification(
        'Custódia Física Atualizada',
        `O contrato de venda #${negId} (${matched.items}) avançou para Etapa ${nextStep}: ${nextStatus}.`,
        'inspeção',
        matched.sellerId,
        'negociacao'
      );
    }

    alert(`Contrato #${negId} avançado para Etapa ${nextStep}!`);
  };

  return (
    <div className="flex-1 bg-zinc-950/20 pt-6 pb-24 px-4 max-w-7xl mx-auto w-full selection:bg-[#E8C96A] selection:text-black">
      
      {/* Tab select banner header */}
      <section className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[#E8C96A] text-2xl font-black flex items-center gap-2">
            <Scale className="w-6 h-6" /> Central de Moderação e Auditoria Física
          </h2>
          <p className="text-zinc-500 text-xs">Visão exclusiva do painel de intermediadores d'A Banca</p>
        </div>

        <div className="flex bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-850">
          {[
            { id: 'geral', label: 'Monitor Geral' },
            { id: 'cadastros', label: `Cadastros (${pendingApprovalsList.length})` },
            { id: 'inspecoes', label: 'Inspeções no Cofre' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'text-zinc-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Overview Analytics row */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { value: totalUsers, label: 'Usuários Cadastros', icon: <Users className="w-4 h-4 text-sky-400" /> },
          { value: activeEscrowsCount, label: 'Custódias Ativas', icon: <Scale className="w-4 h-4 text-[#E8C96A]" /> },
          { value: `R$ ${totalVolumeAmount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, label: 'Volume Faturado', icon: <BarChart3 className="w-4 h-4 text-[#E8C96A]" /> },
          { value: pendingApprovalsList.length, label: 'Aprovações Pendentes', icon: <FileCheck2 className="w-4 h-4 text-yellow-400" /> },
          { value: openDisputesCount, label: 'Disputas Abertas', icon: <ShieldAlert className="w-4 h-4 text-rose-500" /> },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4.5 rounded-xl flex items-center gap-3.5 border-t border-t-zinc-800">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[#E8C96A] shrink-0">
              {stat.icon}
            </div>
            <div>
              <span className="text-base font-black text-white font-mono block leading-none">{stat.value}</span>
              <span className="text-[10px] text-zinc-500 block mt-1 tracking-normal font-medium">{stat.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Main Dynamic Workspace Panel */}
      <div className="glass-card p-6 rounded-2xl border border-zinc-850">
        
        {/* TAB 1: Monitor Geral dashboards */}
        {activeTab === 'geral' && (
          <div className="space-y-8">
            
            {/* User Lists Table */}
            <div className="space-y-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-[#E8C96A]" /> Quadro Administrativo de Perfis
              </h3>
              
              <div className="overflow-x-auto border border-zinc-900 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#0A0A0A] text-zinc-500 font-bold border-b border-zinc-900">
                    <tr>
                      <th className="p-4 uppercase tracking-wider">Nome</th>
                      <th className="p-4 uppercase tracking-wider">E-mail</th>
                      <th className="p-4 uppercase tracking-wider">Permissão</th>
                      <th className="p-4 uppercase tracking-wider">Estado</th>
                      <th className="p-4 uppercase tracking-wider text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 bg-zinc-950/20">
                    {adminUsersList.map(u => (
                      <tr key={u.id} className="hover:bg-zinc-900/35 transition-colors">
                        <td className="p-4 font-bold text-white">{u.name}</td>
                        <td className="p-4 font-mono text-zinc-400">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border ${
                            u.role === 'Administrador' ? 'bg-rose-950/30 text-rose-300 border-rose-500/20' :
                            u.role === 'Vendedor' ? 'bg-amber-950/30 text-amber-300 border-amber-500/20' :
                            'bg-sky-950/30 text-sky-300 border-sky-500/20'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 font-bold ${u.status === 'Ativo' ? 'text-emerald-400' : 'text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Ativo' ? 'bg-emerald-400' : 'bg-red-400'}`} /> {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleUserBlock(u.id)}
                            disabled={u.id === 'u_1'}
                            className="text-[11px] font-bold text-[#E8C96A] hover:underline cursor-pointer disabled:opacity-30 disabled:no-underline"
                          >
                            {u.status === 'Ativo' ? 'Suspender' : 'Reabilitar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* General Contracts Dashboard */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRightLeft className="w-4.5 h-4.5 text-[#E8C96A]" /> Fluxo Geral de Custódias Ativas
              </h3>

              <div className="overflow-x-auto border border-zinc-900 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#0A0A0A] text-zinc-500 font-bold border-b border-zinc-900">
                    <tr>
                      <th className="p-4 uppercase tracking-wider">Código</th>
                      <th className="p-4 uppercase tracking-wider">Item Transacionado</th>
                      <th className="p-4 uppercase tracking-wider">Envolvidos</th>
                      <th className="p-4 uppercase tracking-wider">Preço Escrow</th>
                      <th className="p-4 uppercase tracking-wider">Status Físico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 bg-zinc-950/20">
                    {negotiations.map(neg => (
                      <tr key={neg.id} className="hover:bg-zinc-900/35 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#E8C96A]">#{neg.id}</td>
                        <td className="p-4 font-semibold text-white">{neg.items}</td>
                        <td className="p-4">
                          <span className="block text-zinc-400">De: <strong className="text-zinc-200">{neg.sellerName}</strong></span>
                          <span className="block text-zinc-400">Para: <strong className="text-zinc-200">{neg.buyerName}</strong></span>
                        </td>
                        <td className="p-4 font-mono font-bold">R$ {neg.value.toFixed(2)}</td>
                        <td className="p-4 transition-all">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            neg.step === 6 ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/20' : 'bg-yellow-950/40 text-yellow-300 border border-yellow-500/20'
                          }`}>
                            {neg.status} (Passo {neg.step}/6)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Approve / Reject Newly Registered stickers */}
        {activeTab === 'cadastros' && (
          <div className="space-y-4">
            
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4.5 h-4.5 text-[#E8C96A]" /> Homologação de Novos Cromos Anunciados
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5">Analise as especificidades das figurinhas recém cadastradas e autorize a exibição pública.</p>
            </div>

            {pendingApprovalsList.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/10">
                <ShieldCheck className="w-10 h-10 text-emerald-500/30 mx-auto mb-3" />
                <p className="text-sm font-bold text-zinc-300">Tudo limpo por aqui!</p>
                <p className="text-xs text-zinc-550 mt-1">Nenhum anúncio externo aguardando aprovação técnica nesta fila.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingApprovalsList.map(st => (
                  <div key={st.id} className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/30 flex justify-between gap-4 items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E8C96A] px-2 py-0.5 rounded">
                        {st.code}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">{st.playerName}</h4>
                      <p className="text-[11px] text-zinc-400">
                        Seleção: <strong className="text-zinc-300">{st.team}</strong> • Edição: {st.edition}
                      </p>
                      <div className="flex gap-2 text-[10px] text-zinc-400 font-mono pt-1">
                        <span>Estado: <strong className="text-zinc-200 capitalize">{st.condition}</strong></span>
                        <span>•</span>
                        <span>Valor: <strong className="text-[#E8C96A]">R$ {st.price.toFixed(2)}</strong></span>
                      </div>
                      <p className="text-[10px] text-zinc-550 pt-1 leading-none">Cadastrado por: {st.sellerName}</p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRejectSticker(st.id)}
                        className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-red-500/20 text-red-400 cursor-pointer"
                        title="Rejeitar anúncio"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveSticker(st.id)}
                        className="p-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer"
                        title="Aprovar anúncio"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: Inspeções em Andamento (escrow timeline flow simulator) */}
        {activeTab === 'inspecoes' && (
          <div className="space-y-4">
            
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4.5 h-4.5 text-[#E8C96A]" /> Simulador de Triagem Física de Custódia
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5">Use os disparadores abaixo para simular o recebimento do correio em nosso laboratório físico e avançar os fluxos d'A Banca.</p>
            </div>

            {negotiations.filter(n => n.step < 6).length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-8 text-center">Nenhum contrato ativo pendente de triagem física nesta sessão.</p>
            ) : (
              <div className="space-y-4">
                {negotiations.filter(n => n.step < 6).map(neg => (
                  <div key={neg.id} className="p-5 rounded-xl border border-zinc-850 bg-zinc-950/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#E8C96A]">CTR: #{neg.id}</span>
                        <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-zinc-400 font-mono rounded">
                          Físico: {neg.trackingId || 'N/A'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{neg.items}</h4>
                      <p className="text-xs text-zinc-400">
                        Status Atual do Contrato: <strong className="text-[#E8C96A]">{neg.status}</strong> (Etapa {neg.step}/6)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdvanceEscrowStep(neg.id)}
                      className="px-4 py-2.5 rounded-lg text-xs font-bold bg-[#C9A84C] hover:bg-[#E8C96A] text-black cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" /> Avançar Etapa Física
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
