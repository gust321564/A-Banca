import React, { useState } from 'react';
import { Camera, RefreshCw, Check, Compass, Layers, AlertCircle, Sparkles, Wand2, Upload } from 'lucide-react';

interface ScannerAlbumProps {
  onAddStickerToWishlist?: (code: string) => void;
}

interface AlbumSection {
  title: string;
  stickers: { code: string; player: string; status: 'completado' | 'faltando' | 'repetido' }[];
}

export default function ScannerAlbum({}: ScannerAlbumProps) {
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeCollection, setActiveCollection] = useState<'Copa 2026' | 'Futebol Retro' | 'NBA 2026'>('Copa 2026');
  
  // Sections data checklist
  const [albumData, setAlbumData] = useState<AlbumSection[]>([
    {
      title: 'Brasil (BRA)',
      stickers: [
        { code: 'BRA-01', player: 'Alisson Becker', status: 'completado' },
        { code: 'BRA-10', player: 'Neymar Jr', status: 'repetido' },
        { code: 'BRA-09', player: 'Richarlison', status: 'completado' },
        { code: 'BRA-20', player: 'Vinicius Jr', status: 'faltando' },
      ]
    },
    {
      title: 'Argentina (ARG)',
      stickers: [
        { code: 'ARG-01', player: 'Emi Martínez', status: 'completado' },
        { code: 'ARG-10', player: 'Lionel Messi', status: 'faltando' },
        { code: 'ARG-11', player: 'Di María', status: 'completado' },
      ]
    },
    {
      title: 'França (FRA)',
      stickers: [
        { code: 'FRA-01', player: 'Maignan', status: 'completado' },
        { code: 'FRA-10', player: 'Kylian Mbappé', status: 'completado' },
        { code: 'FRA-07', player: 'Griezmann', status: 'faltando' },
      ]
    }
  ]);

  const [scanResult, setScanResult] = useState<{
    missingFound: string[];
    duplicatesFound: string[];
  } | null>(null);

  const handleToggleSticker = (sectionIndex: number, stickerIndex: number) => {
    const backup = [...albumData];
    const item = backup[sectionIndex].stickers[stickerIndex];
    if (item.status === 'completado') {
      item.status = 'faltando';
    } else if (item.status === 'faltando') {
      item.status = 'repetido';
    } else {
      item.status = 'completado';
    }
    setAlbumData(backup);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoSelected(event.target.result as string);
          setScanResult(null);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerDynamicScan = () => {
    if (!photoSelected) {
      alert('Selecione ou tire uma foto primeiro!');
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      // AI scan simulates finding missing and duplicates
      setScanResult({
        missingFound: ['BRA-20 (Vinicius Jr)', 'ARG-10 (Lionel Messi)'],
        duplicatesFound: ['BRA-10 (Neymar Jr)'],
      });

      // Automatically update the state to match the scanned items
      const backup = [...albumData];
      // update Brazil and Argentina
      backup[0].stickers[3].status = 'faltando'; // BRA-20
      backup[1].stickers[1].status = 'faltando'; // ARG-10
      backup[0].stickers[1].status = 'repetido'; // BRA-10 duplicate
      setAlbumData(backup);

      alert('Escaneamento concluído! Identificamos 2 figurinhas faltantes e 1 repetida no seu álbum. Suas listas e checklists foram integrados.');
    }, 2500);
  };

  // Stats
  const totalStickers = albumData.reduce((acc, s) => acc + s.stickers.length, 0);
  const completedCount = albumData.reduce(
    (acc, s) => acc + s.stickers.filter(st => st.status === 'completado' || st.status === 'repetido').length,
    0
  );
  const percent = Math.round((completedCount / totalStickers) * 100) || 0;

  return (
    <div className="space-y-8 animate-fade-in" id="scanner-album-container">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-[#E8C96A] text-lg font-black uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#E8C96A]" />
            SCANNER INTELIGENTE DE ÁLBUM
          </h3>
          <p className="text-zinc-500 text-xs font-light max-w-xl">
            Tire uma foto das páginas do seu álbum físico. Nossa inteligência artificial em visão computacional detectará instantaneamente as figurinhas seladas e catalogará o que falta!
          </p>
        </div>

        {/* Collection toggle */}
        <div className="flex bg-zinc-900/50 rounded-xl p-1 border border-zinc-850">
          {(['Copa 2026', 'Futebol Retro', 'NBA 2026'] as const).map(c => (
            <button
              key={c}
              onClick={() => setActiveCollection(c)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeCollection === c ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Progress widgets bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-500 block">Progresso do Álbum</span>
            <span className="text-xl font-bold text-white mt-1 block font-mono">{percent}% Completado</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#C9A84C]/20 border-t-[#C9A84C] flex items-center justify-center font-bold text-xs text-[#E8C96A]">
            {completedCount}/{totalStickers}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-500 block">Figurinhas Faltantes</span>
            <span className="text-xl font-extrabold text-red-400 mt-1 block font-mono">
              {albumData.reduce((acc, s) => acc + s.stickers.filter(st => st.status === 'faltando').length, 0)}
            </span>
          </div>
          <Compass className="w-6 h-6 text-red-400" />
        </div>

        <div className="glass-card p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-500 block">Figurinhas Repetidas</span>
            <span className="text-xl font-extrabold text-indigo-400 mt-1 block font-mono">
              {albumData.reduce((acc, s) => acc + s.stickers.filter(st => st.status === 'repetido').length, 0)}
            </span>
          </div>
          <Layers className="w-6 h-6 text-indigo-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Photo simulation container (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-zinc-850 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#E8C96A]" /> Captura de Imagem / Lentes
            </h4>

            {/* Live screen box */}
            <div className="relative aspect-video rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col justify-center items-center p-4">
              
              {photoSelected ? (
                <div className="relative w-full h-full">
                  <img 
                    src={photoSelected} 
                    alt="Upload Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center space-y-2">
                      {/* Laser Line Animation */}
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent w-full top-0 animate-scanning shadow-[0_0_8px_#E8C96A]" />
                      <RefreshCw className="w-8 h-8 text-[#E8C96A] animate-spin" />
                      <span className="text-xs uppercase tracking-widest font-bold text-[#E8C96A] animate-pulse">
                        Sindicando Imagem eletrônica...
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Upload className="w-8 h-8 text-zinc-650 mx-auto animate-pulse" />
                  <p className="text-xs text-zinc-400 font-bold">Nenhuma página capturada</p>
                  <p className="text-[10px] text-zinc-550 max-w-[220px]">
                    Faça o upload de uma foto da página dupla do seu álbum para reconhecer as figurinhas em tempo recorde.
                  </p>
                </div>
              )}

            </div>

            {/* Input triggers */}
            <div className="space-y-4">
              <div className="relative border border-dashed border-zinc-800 rounded-xl p-4 text-center bg-zinc-950/20 hover:bg-zinc-900/30 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-xs font-bold text-zinc-400">Arraste ou Selecione Foto da Página do Álbum</span>
                <span className="text-[9px] text-[#C9A84C] block mt-0.5 uppercase tracking-wider font-semibold">Tamanho Recomendado: 1280x720</span>
              </div>

              {photoSelected && !isScanning && (
                <button
                  type="button"
                  onClick={triggerDynamicScan}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Wand2 className="w-4 h-4 shrink-0" /> Iniciar Reconhecimento Óptico (OCR)
                </button>
              )}
            </div>

            {/* Scanner results panel */}
            {scanResult && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> Resultados Reconhecidos
                </h5>
                <div className="space-y-1 text-[11px] text-zinc-400 leading-normal">
                  <p>• <strong>Em Falta Detectadas:</strong> {scanResult.missingFound.join(', ')}</p>
                  <p>• <strong>Repetidas Detectadas:</strong> {scanResult.duplicatesFound.join(', ')}</p>
                  <div className="mt-2 text-[10px] text-[#E8C96A] italic bg-black/40 p-2 rounded">
                    Sugerimos 5 parceiros no mercado d'A Banca prontos para permutar essas figurinhas com garantia!
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Interactive digital Checklist grid (7 columns) */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-6">
            
            <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest block">Checklist Completo de Cromos</h4>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">Clique nos itens para alternar o status: Falta, Tenho, Repetida.</p>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-805 px-2 py-0.5 rounded">
                Edição 2026
              </span>
            </div>

            <div className="space-y-6">
              {albumData.map((section, sIdx) => (
                <div key={section.title} className="space-y-2.5">
                  <span className="text-[10px] font-bold text-[#E8C96A] uppercase tracking-wider block">
                    {section.title}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {section.stickers.map((item, stIdx) => (
                      <div
                        key={item.code}
                        onClick={() => handleToggleSticker(sIdx, stIdx)}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer select-none transition-all ${
                          item.status === 'completado'
                            ? 'bg-zinc-900/40 border-zinc-850 text-zinc-300'
                            : item.status === 'faltando'
                            ? 'bg-red-950/20 border-red-500/20 text-red-300 font-medium'
                            : 'bg-indigo-950/20 border-indigo-500/20 text-indigo-300 font-bold'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs">{item.player}</span>
                          <span className="text-[9px] font-mono text-zinc-500 mt-0.5 font-bold">{item.code}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          {item.status === 'completado' && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[9px] font-bold">
                              <Check className="w-3 h-3 text-emerald-400" />
                            </span>
                          )}
                          {item.status === 'faltando' && (
                            <span className="text-[8px] uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded block text-red-400 font-extrabold font-mono">
                              FALTA
                            </span>
                          )}
                          {item.status === 'repetido' && (
                            <span className="text-[8px] uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded block text-indigo-400 font-extrabold font-mono">
                              DUP
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl items-start">
              <AlertCircle className="w-4 h-4 text-[#E8C96A] shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-400 font-light leading-relaxed">
                Todas as alterações efetuadas em seu acervo ou checklist digital são salvas localmente e integradas com a inteligência artificial Tinder Matcher de figurinhas raras.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
