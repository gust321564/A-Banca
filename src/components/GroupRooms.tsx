import React, { useState } from 'react';
import { MessageSquare, Users, MapPin, Calendar, PlusCircle, CheckCircle, HelpCircle, Heart, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface GroupRoomsProps {
  currentUser: User;
}

interface MessageSim {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

interface SwapEvent {
  id: string;
  title: string;
  location: string;
  city: string;
  date: string;
  time: string;
  rsvps: number;
}

export default function GroupRooms({ currentUser }: GroupRoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<'copa_sp' | 'pokemon_rj' | 'nba_mg'>('copa_sp');
  const [inputText, setInputText] = useState('');
  
  // RSVP list track
  const [myRsvps, setMyRsvps] = useState<string[]>(['event_1']);

  // Local Events lists
  const [events, setEvents] = useState<SwapEvent[]>([
    {
      id: 'event_1',
      title: 'X Encontro de Colecionadores d\'A Banca SP (Shopping El Dorado)',
      location: 'Praça de Alimentação Central - Av. Rebouças, São Paulo',
      city: 'São Paulo',
      date: 'Sábado, 12 de Junho',
      time: '14:00 às 18:00',
      rsvps: 42,
    },
    {
      id: 'event_2',
      title: 'Feira Carioca de Figurinhas e Cards RPG (Parque Lage)',
      location: 'Área da Piscina Central - Rio de Janeiro',
      city: 'Rio de Janeiro',
      date: 'Domingo, 13 de Junho',
      time: '10:00 às 15:00',
      rsvps: 28,
    },
    {
      id: 'event_3',
      title: 'Sabadão de Troca de Figurinhas Pokémon & NBA (Shopping Estação)',
      location: 'Espaço Arena Game, Piso L2 - Belo Horizonte',
      city: 'Belo Horizonte',
      date: 'Sábado, 19 de Junho',
      time: '13:00 às 17:00',
      rsvps: 19,
    }
  ]);

  // Chat messages simulation
  const [messages, setMessages] = useState<Record<string, MessageSim[]>>({
    copa_sp: [
      { id: '1', sender: 'Lucas Andrade', text: 'Alguém tem repetida a BRA-20 (Vinicius Jr)? Troco por Mbappé e de volta.', time: '12:35' },
      { id: '2', sender: 'Mariana Lima', text: 'Eu tenho! Mas só aceito se vier com cromo de borda de ouro.', time: '12:38' },
      { id: '3', sender: 'Enzo Comprador', text: 'Vou colocar a minha na checklist d\'A Banca agora para trocarmos com escrow físico garantido!', time: '12:40' }
    ],
    pokemon_rj: [
      { id: '1', sender: 'Arthur Card', text: 'Alguém trocando Charizard brilhante da versão retro de 1999?', time: '10:05' },
      { id: '2', sender: 'Juliana Gomez', text: 'Eu tenho um em estado Usado. Aceitaria trocar pelo Pikachu holográfico de 1ª edição?', time: '10:14' }
    ],
    nba_mg: [
      { id: '1 font', sender: 'Gabriel Hoop', text: 'Bora organizar o encontro presencial em BH esse final de semana!', time: '11:10' },
      { id: '2', sender: 'Felipe NBA', text: 'Estarei lá no Shopping Estação no sábado com dezenas de repetidas.', time: '11:15' }
    ]
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: MessageSim = {
      id: Date.now().toString(),
      sender: currentUser.name,
      text: inputText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedRoom]: [...(prev[selectedRoom] || []), newMessage]
    }));

    setInputText('');
  };

  const handleToggleRsvp = (eventId: string) => {
    if (myRsvps.includes(eventId)) {
      setMyRsvps(prev => prev.filter(id => id !== eventId));
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, rsvps: e.rsvps - 1 } : e));
    } else {
      setMyRsvps(prev => [...prev, eventId]);
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, rsvps: e.rsvps + 1 } : e));
      alert('Presença confirmada! Você ganhou +15 pontos de confiabilidade e garantiu seu convite no Sindicato de Eventos d\'A Banca!');
    }
  };

  const getRoomTitle = () => {
    if (selectedRoom === 'copa_sp') return '⚽ Copa do Mundo - Sala São Paulo';
    if (selectedRoom === 'pokemon_rj') return '🔥 Pokémon TCG - Sala Rio de Janeiro';
    return '🏀 NBA Collectors - Sala Minas Gerais';
  };

  return (
    <div className="space-y-8 animate-fade-in" id="group-rooms-container">
      
      {/* Intro info heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-[#E8C96A] text-lg font-black uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            TROCAS EM GRUPO & ENCONTROS LOCAIS
          </h3>
          <p className="text-zinc-500 text-xs font-light max-w-xl">
            Encontre salas temáticas por coleção ou grupos locais de colecionadores perto de você para facilitar a permuta. Participe e confirme presença em eventos de trocas físicas presenciais organizados em grandes centros!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Room selection navigator (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4 rounded-xl border border-zinc-850 space-y-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">CONVERSAS ATIVAS</span>
            
            <div className="space-y-1">
              {[
                { id: 'copa_sp', label: 'Copa do Mundo - SP', members: '145 online', isSoccer: true },
                { id: 'pokemon_rj', label: 'Pokémon TCG - RJ', members: '88 online', isSoccer: false },
                { id: 'nba_mg', label: 'NBA Collectors - MG', members: '52 online', isSoccer: false }
              ].map(rm => (
                <button
                  key={rm.id}
                  onClick={() => setSelectedRoom(rm.id as any)}
                  className={`w-full p-3 rounded-lg text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    selectedRoom === rm.id
                      ? 'bg-[#C9A84C]/10 border border-[#C9A84C]/45 text-[#E8C96A] font-bold'
                      : 'bg-transparent border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/45'
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block truncate font-bold text-left">{rm.label}</span>
                    <span className="text-[9px] text-zinc-500 font-normal block text-left">{rm.members}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900 text-[11px] text-zinc-400 space-y-1.5 font-light">
            <span className="font-bold text-[#E8C96A] block mb-0.5">Segurança em Encontros:</span>
            Para trocas presenciais, prefira locais públicos e movimentados como praças de alimentação de shoppings. Se preferir 100% de segurança, utilize o envio físico assegurado sob nosso contrato d'A Banca.
          </div>
        </div>

        {/* Center column: Interactive chat simulation container (5 columns) */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-2xl border border-zinc-850 h-[460px] flex flex-col overflow-hidden">
            
            {/* Chat header */}
            <div className="p-4 border-b border-zinc-900 bg-zinc-950/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-white">{getRoomTitle()}</span>
              </div>
              <span className="text-[9px] uppercase font-mono font-bold text-zinc-400">Escrow Chat</span>
            </div>

            {/* Messages box */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 pr-2 scrollbar-none">
              {(messages[selectedRoom] || []).map(msg => {
                const isMyMessage = msg.isSelf || msg.sender === currentUser.name;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${
                      isMyMessage ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <span className="text-[9px] text-zinc-500 font-bold mb-0.5">{msg.sender}</span>
                    <div 
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isMyMessage 
                          ? 'bg-gradient-to-r from-[#C9A84C]/90 to-[#E8C96A]/90 text-black font-medium rounded-tr-none'
                          : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-850'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-zinc-550 mt-1 font-mono">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Message input bar */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-zinc-900 bg-zinc-950/40 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escreva sua mensagem pública..."
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Enviar
              </button>
            </form>

          </div>
        </div>

        {/* Right column: Local physical meetups event RSVP directory (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-zinc-850 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E8C96A]" /> Encontros Agendados
            </h4>

            <div className="space-y-4">
              {events.map(ev => {
                const checked = myRsvps.includes(ev.id);
                return (
                  <div 
                    key={ev.id} 
                    className={`p-3.5 rounded-xl border space-y-2.5 transition-all text-left ${
                      checked 
                        ? 'bg-[#C9A84C]/5 border-[#C9A84C]/40 text-white' 
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-400'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block">Encontro Presencial</span>
                      <h5 className="font-bold text-xs text-white mt-1 leading-normal">{ev.title}</h5>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-start gap-1.5 text-[10px] text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-[#E8C96A] shrink-0 mt-0.5" />
                        <span>{ev.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-[#E8C96A]" />
                        <span>{ev.date} às {ev.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                      <span className="text-[10px] text-zinc-500 font-mono">{ev.rsvps} confirmados</span>
                      
                      <button
                        onClick={() => handleToggleRsvp(ev.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                          checked 
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                            : 'bg-zinc-900 hover:bg-zinc-800 text-[#E8C96A] border border-zinc-800'
                        }`}
                      >
                        {checked ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Confirmado
                          </>
                        ) : (
                          'Vou de graça'
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
