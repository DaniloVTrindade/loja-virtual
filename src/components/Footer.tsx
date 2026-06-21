import React from 'react';
import { CreditCard, ExternalLink, Headphones, Heart, ShieldCheck, Truck } from 'lucide-react';

interface FooterProps {
  highContrast: boolean;
  onOpenPolicy?: (slug: 'terms' | 'privacy' | 'returns' | 'legal') => void;
}

export const Footer: React.FC<FooterProps> = ({ highContrast, onOpenPolicy }) => {
  return (
    <footer className={`border-t mt-20 transition-colors ${
      highContrast ? 'bg-black text-yellow-300 border-yellow-400' : 'bg-slate-950 text-indigo-100 border-slate-900'
    }`}>
      <div className={`border-b ${highContrast ? 'border-yellow-500/40 bg-zinc-900' : 'border-slate-900 bg-indigo-950/30'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { title: 'Pagamento Seguro', desc: 'Pix, cartao e boleto no fluxo de checkout', icon: CreditCard },
            { title: 'Entrega e Rastreio', desc: 'Status do pedido e acompanhamento pelo perfil', icon: Truck },
            { title: 'Compra Garantida', desc: 'Politica de troca e devolucao no rodape', icon: ShieldCheck },
            { title: 'Atendimento 24/7', desc: 'Suporte por IA e estrutura para canais futuros', icon: Headphones }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-800 text-indigo-200'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{item.title}</h4>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left text-xs">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-900 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
              IW
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Indigo White</span>
          </div>
          <p className="opacity-80 leading-relaxed max-w-sm">
            Loja online de produtos selecionados com curadoria de qualidade media-alta, checkout seguro e gestao integrada para operacao e crescimento.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="bg-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-800 font-bold text-[11px] text-white">
              SSL Seguro
            </span>
            <span className="bg-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-800 font-bold text-[11px] text-white">
              Acessibilidade
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white mb-4">Institucional</h4>
          <ul className="space-y-2.5 opacity-80">
            <li><button onClick={() => onOpenPolicy?.('terms')} className="hover:underline">Termos de uso</button></li>
            <li><button onClick={() => onOpenPolicy?.('privacy')} className="hover:underline">Privacidade</button></li>
            <li><button onClick={() => onOpenPolicy?.('returns')} className="hover:underline">Troca e devolucao</button></li>
            <li><button onClick={() => onOpenPolicy?.('legal')} className="hover:underline">Aviso legal</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white mb-4">Gestao da loja</h4>
          <ul className="space-y-2.5 opacity-80">
            <li><a href="#" className="hover:underline">Produtos e estoque</a></li>
            <li><a href="#" className="hover:underline">Precos e promocoes</a></li>
            <li><a href="#" className="hover:underline">Pedidos e rastreio</a></li>
            <li><a href="#" className="hover:underline">IA operacional</a></li>
            <li><a href="#" className="hover:underline">SEO de produtos</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white mb-4">Atendimento</h4>
          <ul className="space-y-2.5 opacity-80">
            <li><a href="#" className="hover:underline flex items-center gap-1">Ajuda inteligente <ExternalLink className="w-3 h-3" /></a></li>
            <li><a href="#" className="hover:underline">Cancelar pedido</a></li>
            <li><a href="#" className="hover:underline">Codigo de Defesa do Consumidor</a></li>
            <li><a href="#" className="hover:underline">Preferencias de contraste</a></li>
          </ul>
        </div>
      </div>

      <div className={`border-t py-6 text-center text-xs opacity-70 ${highContrast ? 'border-yellow-500/40' : 'border-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Indigo White. Dados fiscais e endereco definitivo devem ser preenchidos na formalizacao da empresa.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Feito com <Heart className="w-3.5 h-3.5 fill-current text-rose-500" /> para uma operacao clara e escalavel.
          </p>
        </div>
      </div>
    </footer>
  );
};
