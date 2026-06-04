import React, { useState } from 'react';
import { Shield, Sparkles, Key, Mail, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';
import { USERS } from '../data';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const matchedUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (matchedUser && password === '123456') {
      onLogin(matchedUser);
      // Switch to proper initial page
      if (matchedUser.role === 'admin') {
        onNavigate('admin');
      } else {
        onNavigate('dashboard');
      }
    } else {
      setError('Credenciais inválidas. Use a senha de teste: 123456');
    }
  };

  const handleAutofill = (profileEmail: string) => {
    const matchedUser = USERS.find(u => u.email === profileEmail);
    if (matchedUser) {
      setEmail(matchedUser.email);
      setPassword('123456');
      setError('');
      // Auto submit shortly for supreme UX
      setTimeout(() => {
        onLogin(matchedUser);
        if (matchedUser.role === 'admin') {
          onNavigate('admin');
        } else {
          onNavigate('dashboard');
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen dark-gradient flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Back button to Home */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 z-20 flex items-center gap-1 text-xs text-zinc-400 hover:text-[#E8C96A] transition-colors cursor-pointer bg-black/40 px-3.5 py-2.5 rounded-lg border border-zinc-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Início
      </button>

      {/* Background golden particles or glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C9A84C]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        
        {/* Brand identity */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2 tracking-tight">
            <span className="gold-text-gradient font-black">A BANCA</span>
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E8C96A]/90 mt-1">
            Espaço Seguro do Colecionador
          </p>
        </div>

        {/* Central Card Form */}
        <div className="glass-card p-8 rounded-2xl border border-[#C9A84C]/25 shadow-[0_0_40px_rgba(201,168,76,0.1)] relative">
          
          <h3 className="text-lg font-bold text-white mb-6 text-center">Acesse sua Conta</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-xs text-red-300 leading-normal">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email_field" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                E-mail de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email_field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@abanca.com"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password_field" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Senha Secreta
                </label>
                <button
                  type="button"
                  onClick={() => alert('Para este ambiente de testes, utilize as contas rápidas de demonstração mostradas no card abaixo!')}
                  className="text-[11px] text-[#E8C96A] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  id="password_field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E8C96A]/60 rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold bg-[#C9A84C] hover:bg-[#E8C96A] text-[#0A0A0A] inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#C9A84C]/10 transition-all active:scale-[0.98]"
            >
              Entrar <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Create relative account footer */}
          <div className="mt-6 pt-5 border-t border-zinc-900 text-center text-xs text-zinc-500">
            Ainda não tem cadastro?{' '}
            <button
              onClick={() => alert('Inscrições fechadas temporariamente por conta de novas cotas. Use os usuários de teste abaixo!')}
              className="text-[#E8C96A] font-bold hover:underline"
            >
              Criar nova conta
            </button>
          </div>
        </div>

        {/* Demo profiles quick access block */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-850 bg-zinc-950/80">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E8C96A]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-200">
              Acesso Rápido de Testes (Demonstração)
            </h4>
          </div>
          <p className="text-[11px] text-zinc-400 mb-4 font-light leading-normal">
            Clique em qualquer perfil para preencher os dados instantaneamente e entrar com a respectiva interface.
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              {
                role: 'Comprador',
                email: 'comprador@abanca.com',
                desc: 'Busca, compra figurinhas raras e aceita propostas.',
                color: 'hover:border-sky-500/40 hover:bg-sky-950/30 text-sky-400'
              },
              {
                role: 'Vendedor',
                email: 'vendedor@abanca.com',
                desc: 'Anuncia figurinhas e despacha encomendas físicas.',
                color: 'hover:border-amber-500/40 hover:bg-amber-950/30 text-amber-400'
              },
              {
                role: 'Administrador (Banca)',
                email: 'admin@abanca.com',
                desc: 'Audita envios, avalia estado físico e aprova listagens.',
                color: 'hover:border-rose-500/40 hover:bg-rose-950/30 text-rose-400'
              }
            ].map((prof) => (
              <button
                key={prof.email}
                type="button"
                onClick={() => handleAutofill(prof.email)}
                className={`w-full text-left p-3 rounded-xl border border-zinc-900 bg-zinc-900/40 transition-all flex items-center justify-between cursor-pointer group ${prof.color}`}
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white group-hover:text-[#E8C96A]">{prof.role}</span>
                    <span className="text-[10px] opacity-75 font-mono">({prof.email})</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 group-hover:text-zinc-450 leading-relaxed font-light">{prof.desc}</p>
                </div>
                <UserCheck className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
