import { useState } from 'react';
import { User, AppNotification } from '../types';
import { ShieldCheck, LogOut, Coins, User as UserIcon, Bell, Sun, Moon, Check, CheckCheck, Inbox } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function Header({
  currentUser,
  activePage,
  onNavigate,
  onLogout,
  theme,
  onToggleTheme,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter notifications relevant to current user or public broadcasts
  const userNotifications = currentUser
    ? notifications.filter(n => n.userId === currentUser.id || n.userId === 'all_users')
    : [];

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleNotificationClick = (n: AppNotification) => {
    onMarkAsRead(n.id);
    if (n.linkPage) {
      onNavigate(n.linkPage);
    }
    setShowNotifications(false);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Agora';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#C9A84C]/15 px-4 py-3.5 select-none transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand identity */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 cursor-pointer group"
          id="header-brand"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] flex items-center justify-center text-black font-black font-serif shadow-lg group-hover:scale-105 transition-all">
            B
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black text-white tracking-widest leading-none">
              A BANCA
            </h1>
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#E8C96A] block mt-0.5">
              Cofre de Colecionáveis
            </span>
          </div>
        </div>

        {/* Action Controls Column */}
        <div className="flex items-center gap-3">
          
          {currentUser && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-900 text-xs" id="header-balance">
              <Coins className="w-3.5 h-3.5 text-[#E8C96A]" />
              <span className="text-zinc-400 font-light">Saldo:</span>
              <span className="font-mono font-bold text-[#E8C96A]">
                R$ {currentUser.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Quick link button to Dashboard */}
          {currentUser && activePage !== 'dashboard' && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-semibold text-[#E8C96A] hover:underline cursor-pointer px-2.5 py-1.5"
              id="btn-ver-mercado"
            >
              Ver Mercado
            </button>
          )}

          {/* Theme Dynamic Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-805 text-zinc-400 hover:text-[#E8C96A] border border-zinc-850 hover:border-zinc-800 cursor-pointer transition-all duration-300 active:scale-95 flex items-center justify-center p-2.5"
            title={theme === 'dark' ? 'Ativar Tema Claro' : 'Ativar Tema Escuro'}
            id="theme-toggle-button"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-sky-500 hover:rotate-12 transition-transform" />
            )}
          </button>

          {/* Notification System Toggle Bell (With relative Dropdown portal) */}
          {currentUser && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl relative transition-all duration-300 cursor-pointer border ${
                  showNotifications 
                    ? 'bg-zinc-900 text-[#E8C96A] border-[#C9A84C]/45 shadow-[0_0_12px_rgba(201,168,76,0.15)]' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-[#E8C96A] border-zinc-850'
                }`}
                title="Notificações d'A Banca"
                id="notification-bell"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white min-w-4 h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center border border-zinc-950 animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* GLASSMORPHISM DROPDOWN DRAWER */}
              {showNotifications && (
                <>
                  {/* Click-away overlay wrapper */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setShowNotifications(false)}
                  />
                  
                  <div 
                    className="absolute right-0 mt-3.5 w-80 sm:w-96 z-50 rounded-2xl p-4 glass-card border border-[#C9A84C]/35 animate-in fade-in slide-in-from-top-3 duration-200"
                    id="notification-dropdown"
                  >
                    {/* Header bar */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#C9A84C]/15">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-[#E8C96A]" />
                        <h3 className="font-bold text-xs uppercase tracking-wider text-white">Notificações</h3>
                        <span className="bg-[#C9A84C]/10 text-[#E8C96A] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount} novas
                        </span>
                      </div>
                      
                      {unreadCount > 0 && (
                        <button
                          onClick={() => onMarkAllAsRead()}
                          className="text-[10px] font-bold text-[#E8C96A] hover:text-[#fff3d1] transition-colors flex items-center gap-1 cursor-pointer"
                          title="Marcar todas como vistas"
                        >
                          <CheckCheck className="w-3.5 h-3.5 text-[#E8C96A]" />
                          Ler todas
                        </button>
                      )}
                    </div>

                    {/* Scrollable listing box */}
                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-0.5" id="notification-scroll-container">
                      {userNotifications.length === 0 ? (
                        <div className="py-8 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
                          <Inbox className="w-8 h-8 text-zinc-650 animate-pulse" />
                          <p className="text-xs font-medium">Bolsa vazia. Nenhuma notificação recente.</p>
                        </div>
                      ) : (
                        userNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 rounded-xl border cursor-pointer hover:bg-zinc-900/60 transition-all flex flex-col gap-1 text-left ${
                              notif.read
                                ? 'bg-zinc-950/20 border-zinc-900/40 text-zinc-400'
                                : 'bg-[#C9A84C]/5 border-[#C9A84C]/35 hover:border-[#E8C96A] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                            }`}
                            id={`notif-item-${notif.id}`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className={`text-[11px] font-extrabold uppercase tracking-wide leading-none ${notif.read ? 'text-zinc-400' : 'text-[#E8C96A]'}`}>
                                {notif.title}
                              </span>
                              <div className="flex items-center gap-1">
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8C96A] animate-ping" />
                                )}
                                <span className="text-[9px] font-mono text-zinc-500 font-bold">
                                  {formatTime(notif.createdAt)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-[11px] leading-relaxed font-light mt-0.5">
                              {notif.text}
                            </p>

                            {/* Mark as read helper icon indicator */}
                            {!notif.read && (
                              <div className="flex justify-end mt-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead(notif.id);
                                  }}
                                  className="text-[9px] font-bold text-[#E8C96A] hover:text-[#fff3d1] hover:underline flex items-center gap-0.5"
                                >
                                  <Check className="w-3 h-3 text-[#E8C96A]" /> Marcar lida
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer guide banner */}
                    <div className="mt-3 pt-2 text-center text-[9px] text-[#E8C96A]/60 uppercase tracking-widest border-t border-[#C9A84C]/15 font-bold">
                      Central Protegida A Banca Escrow
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Connected User Profile Avatar banner */}
          {currentUser ? (
            <div className="flex items-center gap-2 md:gap-3" id="header-avatar-banner">
              <div className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-850 px-2.5 py-1.5 rounded-xl">
                <div className="w-6 h-6 rounded-md bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-[#E8C96A]" />
                </div>
                <div className="text-left hidden md:block">
                  <span className="text-[11px] font-bold text-white block leading-none">{currentUser.name}</span>
                  <span className="text-[9px] font-medium text-zinc-500 block capitalize mt-0.5">{currentUser.role}</span>
                </div>
              </div>

              {/* Explicit Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-850 cursor-pointer transition-colors p-2.5"
                title="Sair da Conta"
                id="header-logout-button"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Sign in redirection CTA button on standard header for Guests */
            activePage !== 'login' && (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] hover:to-[#fff3d1] text-[#0A0A0A] cursor-pointer shadow-md transition-all active:scale-[0.98]"
                id="header-login-button"
              >
                Entrar / Criar Conta
              </button>
            )
          )}

          {/* THE SECRET DISCRETE BUTTON: ENGRENAGEM OU ESCUDO NO CANTO DIREITO (Icon only, no text) */}
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className={`p-2.5 rounded-xl text-zinc-500 hover:text-[#E8C96A] transition-colors border border-transparent hover:border-zinc-850 cursor-pointer ${
              activePage === 'admin' ? 'text-[#E8C96A] bg-zinc-900 border-zinc-850 shadow' : 'bg-transparent'
            }`}
            title="Sindicato Administrativo (Banca)"
            aria-label="Administração"
            id="header-admin-button"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
          </button>

        </div>

      </div>
    </header>
  );
}
