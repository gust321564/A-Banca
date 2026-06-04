import { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import VenderPage from './components/VenderPage';
import TrocarPage from './components/TrocarPage';
import NegociacaoPage from './components/NegociacaoPage';
import AdminPage from './components/AdminPage';

import { Sticker, User, Negotiation, TradeProposal, AppNotification } from './types';
import { INITIAL_STICKERS, INITIAL_NEGOTIATIONS, INITIAL_PROPOSALS, USERS, INITIAL_NOTIFICATIONS } from './data';

export default function App() {
  
  // Storage keys
  const STORAGE_USER = 'abanca_user';
  const STORAGE_STICKERS = 'abanca_stickers';
  const STORAGE_NEGOTIATIONS = 'abanca_negotiations';
  const STORAGE_PROPOSALS = 'abanca_proposals';
  const STORAGE_THEME = 'abanca_theme';
  const STORAGE_NOTIFICATIONS = 'abanca_notifications';

  // State definitions with lazy local persistent initializer
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const raw = localStorage.getItem(STORAGE_THEME);
    return (raw === 'light' || raw === 'dark') ? raw : 'dark';
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const raw = localStorage.getItem(STORAGE_NOTIFICATIONS);
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
  });

  const [stickers, setStickers] = useState<Sticker[]>(() => {
    const raw = localStorage.getItem(STORAGE_STICKERS);
    return raw ? JSON.parse(raw) : INITIAL_STICKERS;
  });

  const [negotiations, setNegotiations] = useState<Negotiation[]>(() => {
    const raw = localStorage.getItem(STORAGE_NEGOTIATIONS);
    return raw ? JSON.parse(raw) : INITIAL_NEGOTIATIONS;
  });

  const [proposals, setProposals] = useState<TradeProposal[]>(() => {
    const raw = localStorage.getItem(STORAGE_PROPOSALS);
    return raw ? JSON.parse(raw) : INITIAL_PROPOSALS;
  });

  // Target sticker for pre-filled checkboxes inside target trading column
  const [targetSticker, setTargetSticker] = useState<Sticker | null>(null);

  // Active hash route / state page path
  const [activePage, setActivePage] = useState<string>('landing');

  // Sync state changes with local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_USER, currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_THEME, theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_STICKERS, JSON.stringify(stickers));
  }, [stickers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_NEGOTIATIONS, JSON.stringify(negotiations));
  }, [negotiations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PROPOSALS, JSON.stringify(proposals));
  }, [proposals]);

  // Notification action handlers
  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n =>
        n.userId === currentUser.id || n.userId === 'all_users'
          ? { ...n, read: true }
          : n
      )
    );
  };

  const handleAddNotification = (
    title: string,
    text: string,
    type: 'proposta' | 'envio' | 'pagamento' | 'inspeção' | 'geral',
    userId: string,
    linkPage?: string
  ) => {
    const newNotif: AppNotification = {
      id: `not_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      text,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      linkPage
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Auth actions
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Add helpful sign-in greeting notification!
    handleAddNotification(
      'Bem-vindo d\'A Banca!',
      `Olá, ${user.name}! Painel carregado com sucesso. Boas trocas.`,
      'geral',
      user.id,
      'dashboard'
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('landing');
  };

  // Balance modifiers helper (escrow subtraction)
  const handleUpdateUserBalance = (userId: string, delta: number) => {
    // If updating currently logged in user, refresh profile state
    if (currentUser && currentUser.id === userId) {
      const updatedProfile = { ...currentUser, balance: currentUser.balance + delta };
      setCurrentUser(updatedProfile);
    }
    // Update credentials simulation in USERS mock db so reload carries over
    const matched = USERS.find(u => u.id === userId);
    if (matched) {
      matched.balance += delta;
    }
  };

  // BUY STICKER ACTION: triggers escrow contract directly
  const handleBuySticker = (sticker: Sticker) => {
    if (!currentUser) {
      setActivePage('login');
      return;
    }

    if (currentUser.balance < sticker.price) {
      alert(`Saldo insuficiente! O cromo custa R$ ${sticker.price.toFixed(2)}, mas você tem apenas R$ ${currentUser.balance.toFixed(2)}. Utilize as opções de testes ou recarregue.`);
      return;
    }

    // Process transaction escrow holding
    handleUpdateUserBalance(currentUser.id, -sticker.price);

    // Create realistic contract
    const newContract: Negotiation = {
      id: `neg_${Date.now().toString().slice(-4)}`,
      type: 'Compra',
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: sticker.sellerId,
      sellerName: sticker.sellerName,
      items: `${sticker.playerName} (${sticker.code}) - ${sticker.rarity}`,
      value: sticker.price,
      step: 1, // Step 1: Compra Registrada
      status: 'Aguardando postagem pelo vendedor',
      createdAt: new Date().toISOString(),
      trackingId: `BR-BANCA-${Math.floor(1000 + Math.random() * 9000)}B`,
      chatMessages: [
        {
          id: `msg_init_${Date.now()}`,
          sender: 'Banca',
          senderName: 'Intermediador Privado',
          text: `A transação foi iniciada com garantia d'A Banca! R$ ${sticker.price.toFixed(2)} foram depositados fiduciariamente pelo comprador e encontram-se retidos no cofre. Vendedor: providencie a postagem do cromo físico.`,
          timestamp: 'Agora'
        }
      ]
    };

    // Append to negotiations
    setNegotiations(prev => [newContract, ...prev]);

    // Remove bought sticker from public feed listings
    setStickers(prev => prev.filter(s => s.id !== sticker.id));

    // Dispatch notifications
    handleAddNotification(
      'Pagamento Custodiado',
      `O pagamento de R$ ${sticker.price.toFixed(2)} por ${sticker.playerName} está sob custódia d'A Banca.`,
      'pagamento',
      currentUser.id,
      'negociacao'
    );

    handleAddNotification(
      'Cromo Vendido!',
      `${currentUser.name} comprou seu cromo ${sticker.playerName} por R$ ${sticker.price.toFixed(2)}. Providencie o envio.`,
      'envio',
      sticker.sellerId,
      'negociacao'
    );

    alert(`Sucesso! Pagamento de R$ ${sticker.price.toFixed(2)} debitado e garantido em custódia. Redirecionando para o painel de entrega.`);
    
    // Jump to timeline dashboard
    setActivePage('negociacao');
  };

  // ADD STICKER FLOW
  const handleAddSticker = (newSticker: Omit<Sticker, 'id' | 'sellerId' | 'sellerName' | 'approved'>) => {
    if (!currentUser) return;

    const formatted: Sticker = {
      ...newSticker,
      id: `st_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      approved: false, // Must be approved by Admin page
    };

    setStickers(prev => [...prev, formatted]);

    // Notification of catalog
    handleAddNotification(
      'Anúncio em Triagem',
      `Seu cromo ${newSticker.playerName} (${newSticker.code}) foi catalogado e aguarda homologação do Sindicato Administrador.`,
      'geral',
      currentUser.id,
      'dashboard'
    );
  };

  // TRADE PROPOSALS MANAGER
  const handleAddProposal = (newProposal: Omit<TradeProposal, 'id' | 'proposerId' | 'proposerName' | 'status' | 'createdAt'>) => {
    if (!currentUser) return;

    const formatted: TradeProposal = {
      ...newProposal,
      id: `prop_${Date.now().toString().slice(-4)}`,
      proposerId: currentUser.id,
      proposerName: currentUser.name,
      status: 'Pendente',
      createdAt: new Date().toISOString()
    };

    setProposals(prev => [formatted, ...prev]);

    // Notification of proposal sent to destination receiver
    handleAddNotification(
      'Nova Proposta de Câmbio',
      `${currentUser.name} propôs trocar: ${newProposal.offeredStickers.map(s => s.playerName).join(', ')} por seu ${newProposal.requestedStickers.map(s => s.playerName).join(', ')}.`,
      'proposta',
      newProposal.receiverId,
      'dashboard'
    );

    // Confirmation for self
    handleAddNotification(
      'Proposta Enviada',
      `Sua proposta de troca para ${newProposal.receiverName} foi enviada e aguarda confirmação.`,
      'geral',
      currentUser.id,
      'dashboard'
    );
  };

  const handleAcceptProposal = (proposalId: string) => {
    const matched = proposals.find(p => p.id === proposalId);
    if (!matched) return;

    const updated = proposals.map(p => {
      if (p.id === proposalId) return { ...p, status: 'Aceita' as any };
      return p;
    });
    setProposals(updated);

    // Automatically create a reciprocal Exchange Negotiation Escrow Contract!
    const contractItemsSummary = `${matched.offeredStickers.map(s => s.playerName).join(', ')} por ${matched.requestedStickers.map(s => s.playerName).join(', ')}`;
    
    const exchangeEscrow: Negotiation = {
      id: `neg_x_${Date.now().toString().slice(-3)}`,
      type: 'Troca',
      buyerId: matched.proposerId,
      buyerName: matched.proposerName,
      sellerId: matched.receiverId,
      sellerName: matched.receiverName,
      items: `Câmbio: ${contractItemsSummary}`,
      value: 0, // exchanges have no financial transacts
      step: 1, // Step 1: Compra Registrada
      status: 'Aguardando postagem pelo vendedor',
      createdAt: new Date().toISOString(),
      trackingId: `BR-EXCH-${Math.floor(1000 + Math.random() * 9000)}X`,
      chatMessages: [
        {
          id: `msg_auto_${Date.now()}`,
          sender: 'Banca',
          senderName: 'Intermediador Privado',
          text: `A proposta de câmbio física #prop_${proposalId} foi acordada! Ambas as partes devem remeter seus envelopes lacrados para triagem física conjunta na central d'A Banca.`,
          timestamp: 'Agora'
        }
      ]
    };

    setNegotiations(prev => [exchangeEscrow, ...prev]);

    // Remove affected stickers from overall database since they are locked in escrow
    const lockedIds = [...matched.offeredStickers.map(s => s.id), ...matched.requestedStickers.map(s => s.id)];
    setStickers(prev => prev.filter(s => !lockedIds.includes(s.id)));

    // Send alerts to both users
    handleAddNotification(
      'Troca Acordada!',
      `Sua proposta de troca foi ACEITA por ${matched.receiverName}. Envie seu cromo para triagem d'A Banca.`,
      'proposta',
      matched.proposerId,
      'negociacao'
    );

    handleAddNotification(
      'Contrato de Troca Gerado',
      `Câmbio aceito com sucesso. Poste seus itens para nossa inspeção conjunta.`,
      'geral',
      matched.receiverId,
      'negociacao'
    );

    alert('Proposta aceita! O contrato de custódia mútua foi registrado. Redirecionando para acompanhamento.');
    setActivePage('negociacao');
  };

  const handleDeclineProposal = (proposalId: string) => {
    const matched = proposals.find(p => p.id === proposalId);
    const updated = proposals.map(p => {
      if (p.id === proposalId) return { ...p, status: 'Recusada' as any };
      return p;
    });
    setProposals(updated);

    if (matched) {
      // Send notification of refusal
      handleAddNotification(
        'Proposta Recusada',
        `${currentUser?.name || 'O destinatário'} recusou seu convite de troca.`,
        'proposta',
        matched.proposerId,
        'dashboard'
      );
    }
    alert('Proposta recusada.');
  };

  return (
    <div className="min-h-screen dark-gradient flex flex-col font-sans select-none antialiased">
      
      {/* Sticky glass Header */}
      <Header
        currentUser={currentUser}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Render relative Sub-View page based on current Router state */}
      <main className="flex-1 flex flex-col">
        {activePage === 'landing' && (
          <LandingPage
            onNavigate={setActivePage}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'dashboard' && (
          currentUser ? (
            <Dashboard
              currentUser={currentUser}
              stickers={stickers}
              negotiations={negotiations}
              proposals={proposals}
              onBuySticker={handleBuySticker}
              onNavigate={setActivePage}
              onInitTrade={setTargetSticker}
              onAcceptProposal={handleAcceptProposal}
              onDeclineProposal={handleDeclineProposal}
              onAddProposal={handleAddProposal}
            />
          ) : (
            <LoginPage onLogin={handleLogin} onNavigate={setActivePage} />
          )
        )}

        {activePage === 'vender' && (
          currentUser ? (
            <VenderPage
              currentUserId={currentUser.id}
              onNavigate={setActivePage}
              onAddSticker={handleAddSticker}
            />
          ) : (
            <LoginPage onLogin={handleLogin} onNavigate={setActivePage} />
          )
        )}

        {activePage === 'trocar' && (
          currentUser ? (
            <TrocarPage
              currentUser={currentUser}
              stickers={stickers}
              proposals={proposals}
              targetSticker={targetSticker}
              onNavigate={setActivePage}
              onAddProposal={handleAddProposal}
              onClearTargetSticker={() => setTargetSticker(null)}
            />
          ) : (
            <LoginPage onLogin={handleLogin} onNavigate={setActivePage} />
          )
        )}

        {activePage === 'negociacao' && (
          currentUser ? (
            <NegociacaoPage
              currentUser={currentUser}
              negotiations={negotiations}
              onSetNegotiations={setNegotiations}
              onUpdateUserBalance={handleUpdateUserBalance}
              onNavigate={setActivePage}
            />
          ) : (
            <LoginPage onLogin={handleLogin} onNavigate={setActivePage} />
          )
        )}

        {activePage === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminPage
              currentUser={currentUser}
              stickers={stickers}
              negotiations={negotiations}
              onSetStickers={setStickers}
              onSetNegotiations={setNegotiations}
              onNavigate={setActivePage}
              onAddNotification={handleAddNotification}
            />
          ) : (
            /* Soft permission fallback: alert first then display anyway for demonstration convenience */
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 text-center max-w-md mx-auto space-y-6">
              <span className="p-3 bg-rose-950/40 border border-rose-500/20 text-rose-400 rounded-full">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Privilégios Administrativos Requeridos</h3>
                <p className="text-zinc-500 text-xs leading-relaxed font-light">
                  A página d'A Banca requer credenciais de Administrador. Para demonstração rápida, deseja simular o login do Administrador agora mesmo?
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const adminUser = USERS.find(u => u.role === 'admin');
                  if (adminUser) {
                    setCurrentUser(adminUser);
                    setActivePage('admin');
                  }
                }}
                className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-500/80 to-pink-500/80 text-white cursor-pointer shadow-lg hover:shadow-rose-500/10"
              >
                Super-Acesso Rápido de Admin
              </button>
            </div>
          )
        )}
      </main>

    </div>
  );
}

// Simple placeholder icon just in case of missing fallback
function ShieldAlert(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  );
}
