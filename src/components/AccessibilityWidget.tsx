import React from 'react';
import { Accessibility, Moon, Sun, Type, RefreshCw, X, Check, Eye, HelpCircle } from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface AccessibilityProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export const AccessibilityWidget: React.FC<AccessibilityProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings
}) => {
  if (!isOpen) return null;

  const handleFontSize = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleLetterSpacing = () => {
    setSettings((prev) => ({ ...prev, letterSpacing: !prev.letterSpacing }));
  };

  const toggleScreenReaderHelp = () => {
    setSettings((prev) => ({ ...prev, screenReaderHelp: !prev.screenReaderHelp }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 'base',
      highContrast: false,
      voiceAssist: false,
      screenReaderHelp: false,
      letterSpacing: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="a11y-title">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl p-6 transition-all border-2 ${
        settings.highContrast 
          ? 'bg-black text-yellow-300 border-yellow-400' 
          : 'bg-white text-slate-800 border-slate-200'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-600 text-white'}`}>
              <Accessibility className="w-6 h-6" />
            </div>
            <div>
              <h2 id="a11y-title" className="text-xl font-bold tracking-tight">Painel de Acessibilidade</h2>
              <p className="text-xs opacity-80">Personalize sua experiência de compra no Mercado Índigo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${settings.highContrast ? 'hover:bg-yellow-400 hover:text-black' : 'hover:bg-slate-100 text-slate-500'}`}
            aria-label="Fechar painel de acessibilidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Font size control */}
          <div>
            <label className="text-sm font-bold flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-indigo-500" />
              Tamanho da Fonte
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['sm', 'base', 'lg', 'xl'] as const).map((size) => {
                const labels = { sm: 'Pequena', base: 'Normal', lg: 'Grande', xl: 'Extra' };
                const isActive = settings.fontSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => handleFontSize(size)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      isActive
                        ? (settings.highContrast ? 'bg-yellow-400 text-black border-yellow-400 ring-2 ring-white' : 'bg-indigo-600 text-white border-indigo-600 shadow')
                        : (settings.highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200')
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="text-base uppercase">{size}</span>
                    <span>{labels[size]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contrast control */}
          <div>
            <label className="text-sm font-bold flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-500" />
              Esquema de Cores & Visão
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={toggleHighContrast}
                className={`p-3 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
                  settings.highContrast
                    ? 'bg-yellow-400 text-black border-yellow-400 ring-2 ring-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                aria-pressed={settings.highContrast}
              >
                <span className="flex items-center gap-2">
                  {settings.highContrast ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  Alto Contraste
                </span>
                {settings.highContrast && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleLetterSpacing}
                className={`p-3 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
                  settings.letterSpacing
                    ? (settings.highContrast ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-indigo-600 text-white border-indigo-600')
                    : (settings.highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200')
                }`}
                aria-pressed={settings.letterSpacing}
              >
                <span>Modo Dislexia (Espaçado)</span>
                {settings.letterSpacing && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Screen Reader Simulation & Info */}
          <div>
            <label className="text-sm font-bold flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              Guia de Assistência & Leitores de Tela
            </label>
            <button
              onClick={toggleScreenReaderHelp}
              className={`w-full p-3 rounded-2xl border text-left text-xs space-y-2 transition-all ${
                settings.screenReaderHelp
                  ? (settings.highContrast ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-indigo-50 text-indigo-950 border-indigo-300')
                  : (settings.highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200')
              }`}
              aria-expanded={settings.screenReaderHelp}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span>🎧 Assistente em Dicas Otimizadas</span>
                {settings.screenReaderHelp ? <Check className="w-4 h-4" /> : <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-300 text-slate-800 rounded">Ativar</span>}
              </div>
              <p className="leading-relaxed">
                Quando ativado, o Mercado Índigo exibe avisos explícitos para navegação via teclado, destaca os leitores com marcações ARIA de alta prioridade e ativa a voz narrada do nosso bot assistente.
              </p>
            </button>
          </div>

          {/* Quick Shortcuts info */}
          <div className={`p-4 rounded-2xl border text-xs space-y-2 ${settings.highContrast ? 'bg-zinc-900 border-yellow-500/50' : 'bg-slate-50 border-slate-200'}`}>
            <p className="font-bold uppercase tracking-wider text-[11px]">Atalhos Principais de Teclado:</p>
            <ul className="space-y-1 list-disc list-inside opacity-90">
              <li>Use <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[10px]">TAB</kbd> para navegar entre produtos e botões</li>
              <li>Use <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[10px]">ESC</kbd> para fechar modais ou atalhos</li>
              <li>Use <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[10px]">ENTER</kbd> para abrir itens e finalizar compras</li>
            </ul>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between gap-3">
          <button
            onClick={resetSettings}
            className={`flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors ${
              settings.highContrast ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar Padrões
          </button>
          <button
            onClick={onClose}
            className={`font-bold py-2.5 px-6 rounded-xl transition-all shadow ${
              settings.highContrast ? 'bg-yellow-400 hover:bg-yellow-500 text-black font-black' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Concluir & Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
