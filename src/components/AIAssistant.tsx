import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { AI_FAQS } from '../data/mockData';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  highContrast: boolean;
  onOpenCoupons: () => void;
  onOpenAccessibility: () => void;
  hidden?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  highContrast,
  onOpenCoupons,
  onOpenAccessibility,
  hidden = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Ola! Sou o Assistente IA da Indigo White. Como posso ajudar com pedidos, acessibilidade ou cupons?',
      time: 'Agora',
      suggestedActions: ['Ver cupons disponíveis', 'Configurar Acessibilidade', 'Regras do frete grátis']
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      time: 'Agora'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // AI simulation logic
    setTimeout(() => {
      let botResponse = 'Entendi sua solicitação! Nossa equipe de suporte está monitorando seu pedido com máxima prioridade no centro FULL.';
      let actions: string[] = [];

      const qLower = text.toLowerCase();
      if (qLower.includes('cupom') || qLower.includes('cupons') || qLower.includes('desconto')) {
        botResponse = 'Você tem acesso a ótimos cupons como INDIGO10 (10% OFF) e FRETEGRATIS (R$ 25 OFF no frete). Deseja ir para sua carteira ver todos?';
        actions = ['Abrir Carteira de Cupons'];
      } else if (qLower.includes('acessib') || qLower.includes('fonte') || qLower.includes('contraste') || qLower.includes('leitor')) {
        botResponse = 'Nosso site possui um painel avançado de acessibilidade com ajuste de contraste, modo dislexia e leitores de tela. Deseja abri-lo agora?';
        actions = ['Abrir Painel de Acessibilidade'];
      } else if (qLower.includes('frete') || qLower.includes('full') || qLower.includes('envio')) {
        botResponse = 'Todos os itens com selo FULL ou acima de R$ 79 possuem frete grátis com entrega expressa garantida em até 2 dias úteis!';
      } else {
        // match from AI_FAQS
        const found = AI_FAQS.find((f) => f.q.toLowerCase().includes(qLower) || text.toLowerCase().includes(f.q.toLowerCase()));
        if (found) {
          botResponse = found.a;
        }
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: 'Agora',
        suggestedActions: actions.length > 0 ? actions : undefined
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const handleActionClick = (action: string) => {
    if (action === 'Abrir Carteira de Cupons' || action === 'Ver cupons disponíveis') {
      onOpenCoupons();
      setIsOpen(false);
    } else if (action === 'Abrir Painel de Acessibilidade' || action === 'Configurar Acessibilidade') {
      onOpenAccessibility();
      setIsOpen(false);
    } else {
      handleSend(action);
    }
  };

  if (hidden) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 animate-bounce ${
            highContrast ? 'bg-yellow-400 text-black border-2 border-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
          }`}
          aria-label="Abrir chat do Assistente de Inteligência Artificial"
        >
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          <span className="font-bold text-xs pr-1 hidden md:inline">Ajuda IA</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`w-80 sm:w-96 rounded-3xl shadow-2xl border overflow-hidden flex flex-col h-[500px] animate-fadeIn ${
          highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
        }`}>
          {/* Top Header */}
          <div className={`p-4 flex items-center justify-between border-b ${
            highContrast ? 'bg-zinc-900 border-yellow-500/50' : 'bg-indigo-700 text-white'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center text-white font-black text-xs shadow">
                IA
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Assistente Virtual Indigo White</h3>
                <p className="text-[10px] text-purple-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Online e pronto para ajudar
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
              aria-label="Fechar janela do assistente"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? (highContrast ? 'bg-yellow-400 text-black font-bold rounded-br-none' : 'bg-indigo-600 text-white rounded-br-none shadow-sm')
                    : (highContrast ? 'bg-zinc-900 text-yellow-300 border border-yellow-500/50 rounded-bl-none' : 'bg-slate-100 text-slate-800 rounded-bl-none')
                }`}>
                  <p>{m.text}</p>
                </div>

                {/* Suggested actions */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                          highContrast ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-300 border-yellow-400' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick FAQ Chips */}
          <div className={`p-2 border-t flex items-center gap-1.5 overflow-x-auto ${
            highContrast ? 'bg-zinc-900 border-yellow-500/30' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold opacity-70 px-1">Dúvidas rápidas:</span>
            {AI_FAQS.map((f, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(f.q)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap border transition-all ${
                  highContrast ? 'bg-black text-yellow-300 border-yellow-400' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                {f.q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className={`p-3 border-t flex items-center gap-2 ${
              highContrast ? 'bg-black border-yellow-400' : 'bg-white border-slate-200'
            }`}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida aqui..."
              className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-400 placeholder-yellow-500' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
            <button
              type="submit"
              className={`p-2 rounded-xl transition-colors ${
                highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              aria-label="Enviar mensagem para IA"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
