import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Edit3,
  PackagePlus,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  Users
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { ManagerProfile, Order, Product } from '../types';

interface ChatMsg {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface ManagerDashboardProps {
  manager: ManagerProfile;
  managers: ManagerProfile[];
  products: Product[];
  orders: Order[];
  onCreateProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  highContrast: boolean;
}

type ProductForm = {
  id?: string;
  title: string;
  category: string;
  brand: string;
  price: string;
  originalPrice: string;
  stock: string;
  image: string;
  description: string;
};

const emptyForm: ProductForm = {
  title: '',
  category: 'eletronicos',
  brand: 'Indigo White',
  price: '',
  originalPrice: '',
  stock: '10',
  image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop&q=80',
  description: ''
};

const ts = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  manager,
  managers,
  products,
  orders,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onSelectProduct,
  highContrast
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'ai'>('overview');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [aiInput, setAiInput] = useState('');
  const [chat, setChat] = useState<ChatMsg[]>([
    { id: 'init', role: 'ai', text: 'Olá! Eu sou a IA do painel gerencial. Você pode me pedir para **adicionar produtos**, **remover produtos**, consultar **estoque**, **faturamento**, **pedidos** e muito mais. É só conversar comigo!', timestamp: ts() }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const revenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const itemsSold = useMemo(
    () => orders.reduce((sum, order) => sum + order.items.reduce((inner, item) => inner + item.quantity, 0), 0),
    [orders]
  );
  const lowStock = products.filter((product) => product.stock <= 10);
  const averageTicket = orders.length ? revenue / orders.length : 0;

  const filteredProducts = products.filter((product) => {
    const text = `${product.title} ${product.brand} ${product.category}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const buildProduct = (): Product => {
    const price = Number(form.price) || 99.9;
    const originalPrice = form.originalPrice ? Number(form.originalPrice) : undefined;
    return {
      id: form.id || `prod-${Date.now()}`,
      title: form.title,
      price,
      originalPrice,
      installments: { count: 12, amount: price / 12, interestFree: true },
      freeShipping: true,
      fullDelivery: true,
      category: form.category,
      brand: form.brand,
      condition: 'novo',
      stock: Number(form.stock) || 0,
      rating: 5,
      reviewsCount: 0,
      images: [form.image],
      description: form.description || 'Produto selecionado pela curadoria Indigo White, com foco em qualidade media-alta e boa experiencia de compra.',
      attributes: {
        'Curadoria': 'Indigo White',
        'Garantia': '90 dias',
        'SEO': 'Descricao propria revisada'
      },
      seller: {
        id: 'indigo-white',
        name: 'Indigo White Oficial',
        reputation: 'excelente',
        salesCount: 0,
        rating: 5,
        location: 'Sao Paulo, SP',
        badge: 'Loja Oficial'
      },
      reviews: [],
      questions: [],
      featured: true
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) return;
    const product = buildProduct();
    if (form.id) {
      onUpdateProduct(product);
    } else {
      onCreateProduct(product);
    }
    setForm(emptyForm);
  };

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id,
      title: product.title,
      category: product.category,
      brand: product.brand,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stock: String(product.stock),
      image: product.images[0] || emptyForm.image,
      description: product.description
    });
    setActiveTab('products');
  };

  const addMsg = (role: 'ai' | 'user', text: string) => {
    setChat((prev) => [...prev, { id: `m-${Date.now()}-${Math.random()}`, role, text, timestamp: ts() }]);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const parseAndExecute = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();

    // --- ADD PRODUCT ---
    if (lower.startsWith('adicione') || lower.startsWith('adicionar') || lower.startsWith('crie') || lower.startsWith('criar') || lower.startsWith('cadastre') || lower.startsWith('cadastrar') || lower.startsWith('novo produto')) {
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      let title = '';
      let category = 'eletronicos';
      let brand = 'Indigo White';
      let price = '';
      let originalPrice = '';
      let stock = '10';
      let image = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop&q=80';
      let description = '';

      for (const line of lines) {
        const l = line.toLowerCase();
        if (l.startsWith('título:') || l.startsWith('titulo:') || l.startsWith('nome:')) title = line.split(':').slice(1).join(':').trim();
        else if (l.startsWith('categoria:')) {
          const catName = l.replace('categoria:', '').trim();
          const found = CATEGORIES.find((c) => c.name.toLowerCase().includes(catName) || c.id.includes(catName));
          if (found) category = found.id;
        }
        else if (l.startsWith('marca:')) brand = line.split(':').slice(1).join(':').trim();
        else if (l.startsWith('preço:') || l.startsWith('preco:')) price = line.replace(/preço:|preco:/i, '').replace(/[^0-9.,]/g, '').trim().replace(',', '.');
        else if (l.startsWith('de:') || l.startsWith('preço original:') || l.startsWith('preco original:')) originalPrice = line.replace(/de:|preço original:|preco original:/i, '').replace(/[^0-9.,]/g, '').trim().replace(',', '.');
        else if (l.startsWith('estoque:')) stock = line.replace(/[^0-9]/g, '');
        else if (l.startsWith('imagem:') || l.startsWith('url:')) {
          const url = line.split(':').slice(1).join(':').trim();
          if (url.startsWith('http')) image = url;
        }
        else if (l.startsWith('descrição:') || l.startsWith('descricao:')) description = line.split(':').slice(1).join(':').trim();
      }

      // If only one line, try to parse intelligently
      if (lines.length === 1) {
        // "adicione iPhone 15 por 4999, 10 em estoque, imagem: https://..."
        const imgMatch = text.match(/https?:\/\/[^\s,]+/);
        if (imgMatch) {
          image = imgMatch[0];
          // Remove the URL from parsing
          const clean = text.replace(imgMatch[0], '');
          // Try to extract price: "por 4999" or "4999"
          const priceMatch = clean.match(/[Pp]or\s*R?\$?\s*([0-9]+[.,][0-9]+)/);
          if (priceMatch) {
            price = priceMatch[1].replace(',', '.');
          } else {
            const nums = clean.match(/([0-9]+)[.,]?([0-9]{2})?/g);
            if (nums) {
              const candidates = nums.filter((n) => parseFloat(n.replace(',', '.')) > 10);
              if (candidates.length > 0) price = candidates[0].replace(',', '.');
            }
          }
          // Estoque: number after "estoque"
          const stockMatch = clean.match(/estoque\s*[:\s]*(\d+)/i);
          if (stockMatch) stock = stockMatch[1];
          // Título: everything before "por" or "imagem"
          const titleParts = clean.split(/[Pp]or\s*R?\$?/);
          if (titleParts[0].trim()) title = titleParts[0].trim();
          // Remove trailing commas/spaces
          title = title.replace(/^adicione\s+|^adicionar\s+|^crie\s+|^criar\s+|^cadastre\s+|^cadastrar\s+|^novo\s+produto\s+/i, '').trim();
          title = title.replace(/[,;]+$/, '').trim();
        } else {
          title = text.replace(/^adicione\s+|^adicionar\s+|^crie\s+|^criar\s+|^cadastre\s+|^cadastrar\s+|^novo\s+produto\s+/i, '').trim();
          // Try to extract price with "por" or just number
          const priceMatch = text.match(/[Pp]or\s*R?\$?\s*([0-9]+[.,][0-9]+)/);
          if (priceMatch) {
            price = priceMatch[1].replace(',', '.');
            title = title.replace(/[Pp]or\s*R?\$?\s*[0-9]+[.,][0-9]+/, '').trim();
          }
          const stockMatch = text.match(/estoque\s*[:\s]*(\d+)/i);
          if (stockMatch) stock = stockMatch[1];
        }
        title = title.replace(/[,;]+$/, '').trim();
      }

      if (!title) {
        addMsg('ai', '❌ Para adicionar um produto, informe ao menos o **título** (ex: "Adicione iPhone 15 por 4999" ou use o formato:\n\n```\nTítulo: Nome do Produto\nPreço: 199,90\nCategoria: Eletrônicos\nEstoque: 10\nImagem: https://...\n```');
        return;
      }

      if (!price) price = '99.90';

      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        installments: { count: 12, amount: parseFloat(price) / 12, interestFree: true },
        freeShipping: true,
        fullDelivery: true,
        category,
        brand,
        condition: 'novo',
        stock: parseInt(stock) || 10,
        rating: 5,
        reviewsCount: 0,
        images: [image],
        description: description || `Produto adicionado via IA: ${title}`,
        attributes: { 'Curadoria': 'Indigo White', 'Garantia': '90 dias', 'Cadastro': 'Via IA Gerencial' },
        seller: {
          id: 'indigo-white',
          name: 'Indigo White Oficial',
          reputation: 'excelente',
          salesCount: 0,
          rating: 5,
          location: 'Sao Paulo, SP',
          badge: 'Loja Oficial'
        },
        reviews: [],
        questions: [],
        featured: true
      };

      onCreateProduct(newProd);
      addMsg('ai', `✅ Produto adicionado com sucesso!\n\n**${title}**\n💰 R$ ${parseFloat(price).toFixed(2)}${originalPrice ? ` ~~R$ ${parseFloat(originalPrice).toFixed(2)}~~` : ''}\n📦 Estoque: ${stock}\n🏷️ Categoria: ${CATEGORIES.find((c) => c.id === category)?.name || category}\n🖼️ [Ver imagem](${image})`);
      return;
    }

    // --- REMOVE / DELETE PRODUCT ---
    if (lower.startsWith('remova') || lower.startsWith('remover') || lower.startsWith('delete') || lower.startsWith('exclua') || lower.startsWith('excluir') || lower.startsWith('apague') || lower.startsWith('apagar')) {
      // Try to match product name after the command
      const searchName = text.replace(/^(remova|remover|delete|exclua|excluir|apague|apagar)\s+/i, '').trim().toLowerCase();
      if (!searchName) {
        addMsg('ai', '❌ Informe qual produto remover. Ex: "Remova iPhone 15"');
        return;
      }
      const matches = products.filter((p) => p.title.toLowerCase().includes(searchName));
      if (matches.length === 0) {
        addMsg('ai', `❌ Nenhum produto encontrado com "${searchName}".`);
        return;
      }
      if (matches.length === 1) {
        onDeleteProduct(matches[0].id);
        addMsg('ai', `🗑️ Produto removido: **${matches[0].title}**`);
        return;
      }
      // Multiple matches
      let msg = `⚠️ Encontrei ${matches.length} produtos com "${searchName}":\n\n`;
      matches.forEach((p, i) => {
        msg += `${i + 1}. **${p.title}** — R$ ${p.price.toFixed(2)}\n`;
      });
      msg += '\nDigite "Remova [número]" ou seja mais específico.';
      addMsg('ai', msg);
      return;
    }

    // --- REMOVE BY NUMBER (after listing) ---
    if (/^remova\s+\d+$/i.test(lower) || /^remover\s+\d+$/i.test(lower) || /^exclua\s+\d+$/i.test(lower) || /^apague\s+\d+$/i.test(lower)) {
      addMsg('ai', '❌ Primeiro busque o produto pelo nome para eu saber qual remover. Ex: "Remova iPhone 15"');
      return;
    }

    // --- SEARCH / FIND PRODUCTS ---
    if ((lower.startsWith('busque') || lower.startsWith('buscar') || lower.startsWith('encontre') || lower.startsWith('ache') || lower.startsWith('onde está') || lower.startsWith('onde esta') || lower.startsWith('produto')) && !lower.startsWith('produtos')) {
      const searchTerm = text.replace(/^(busque|buscar|encontre|ache|onde\s+est[áa]|onde\s+esta|produto)\s+/i, '').trim();
      if (!searchTerm) {
        addMsg('ai', '❌ Digite o nome do produto que deseja buscar.');
        return;
      }
      const found = products.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
      if (found.length === 0) {
        addMsg('ai', `❌ Nenhum produto encontrado para "${searchTerm}".`);
        return;
      }
      let msg = `🔍 Encontrei ${found.length} produto(s):\n\n`;
      found.forEach((p) => {
        msg += `• **${p.title}** — R$ ${p.price.toFixed(2)} — Estoque: ${p.stock} — [🖼️](${p.images[0]})\n`;
      });
      addMsg('ai', msg);
      return;
    }

    // --- STOCK QUERY ---
    if (lower.includes('estoque') || lower.includes('baixo')) {
      if (lowStock.length === 0) {
        addMsg('ai', '✅ Todos os produtos estão com estoque adequado (acima de 10 unidades).');
      } else {
        let msg = `⚠️ ${lowStock.length} produto(s) com estoque baixo:\n\n`;
        lowStock.forEach((p) => {
          msg += `• **${p.title}** — apenas ${p.stock} unidade(s)\n`;
        });
        addMsg('ai', msg);
      }
      return;
    }

    // --- REVENUE / SALES QUERY ---
    if (lower.includes('faturamento') || lower.includes('rendimento') || lower.includes('venda') || lower.includes('fatura') || lower.includes('receita') || lower.includes('vendido')) {
      addMsg('ai', `📊 **Faturamento total:** R$ ${revenue.toFixed(2)}\n📦 **Itens vendidos:** ${itemsSold}\n🎫 **Ticket médio:** R$ ${averageTicket.toFixed(2)}\n📋 **Total de pedidos:** ${orders.length}`);
      return;
    }

    // --- PRODUCT COUNT ---
    if (lower.includes('produtos') && (lower.includes('quantos') || lower.includes('total') || lower.includes('ativos') || lower.includes('cadastrado'))) {
      addMsg('ai', `📦 Total de produtos no catálogo: **${products.length}**\n⚠️ Com estoque baixo: **${lowStock.length}**`);
      return;
    }

    // --- HELP ---
    if (lower.includes('ajuda') || lower.includes('help') || lower.includes('o que você') || lower.includes('comandos') || lower.includes('pode fazer')) {
      addMsg('ai', '🤖 **Comandos que entendo:**\n\n' +
        '📌 **Adicionar produto**\n' +
        '   `Adicione Nome por 199,90 estoque: 10 imagem: https://...`\n' +
        '   Ou no formato:\n' +
        '   ```\n   Título: Nome\n   Preço: 199,90\n   Categoria: Eletrônicos\n   Estoque: 10\n   Imagem: https://...\n   ```\n' +
        '🗑️ **Remover produto** — `Remova iPhone 15`\n' +
        '🔍 **Buscar produto** — `Busque iPhone`\n' +
        '📊 **Faturamento** — "Qual o faturamento?"\n' +
        '⚠️ **Estoque baixo** — "Quais produtos estão com estoque baixo?"\n' +
        '📦 **Total produtos** — "Quantos produtos ativos?"');
      return;
    }

    // --- FALLBACK: try to be helpful with data context ---
    addMsg('ai', `Desculpe, não entendi seu comando. Digite "ajuda" para ver o que posso fazer.\n\n📊 **Dados atuais da loja:**\n• ${products.length} produtos ativos\n• R$ ${revenue.toFixed(2)} em faturamento\n• ${orders.length} pedidos realizados\n• ${lowStock.length} produtos com estoque baixo`);
  }, [products, orders, lowStock, revenue, itemsSold, averageTicket, onCreateProduct, onDeleteProduct]);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = aiInput.trim();
    if (!text || processing) return;
    setAiInput('');
    addMsg('user', text);
    setProcessing(true);
    // Small delay so the user message appears instantly
    setTimeout(() => {
      parseAndExecute(text);
      setProcessing(false);
    }, 200);
  };

  const handleImagePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string;
          // Pre-fill the input with an "Adicione" command hint
          setAiInput((prev) => prev + ` imagem: ${dataUrl}`);
          addMsg('ai', '🖼️ Imagem detectada! A URL foi adicionada ao seu texto. Complete o comando com o nome, preço e outros detalhes.');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAiInput((prev) => prev + ` imagem: ${dataUrl}`);
      addMsg('ai', '🖼️ Imagem carregada! A URL em base64 foi adicionada ao seu texto. Complete o comando.');
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const panelClass = highContrast ? 'bg-black text-yellow-300 border-yellow-400' : 'bg-white text-slate-800 border-slate-200';

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left">
      <section className={`rounded-3xl border p-6 shadow-sm ${highContrast ? panelClass : 'bg-slate-950 text-white border-slate-900'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img src={manager.avatar} alt={manager.name} className="w-16 h-16 rounded-2xl object-cover border border-white/20" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-indigo-300">Painel de gerente</p>
              <h1 className="text-2xl font-black tracking-tight">{manager.name}</h1>
              <p className="text-xs opacity-75">{manager.email} - ultimo acesso: {manager.lastAccess}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-200 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Acesso completo
            </span>
            <span className="px-3 py-2 rounded-xl bg-indigo-500/15 text-indigo-100 font-bold flex items-center gap-1">
              <Users className="w-4 h-4" />
              {managers.length} gerentes
            </span>
          </div>
        </div>
      </section>

      <nav className="flex flex-wrap gap-2 border-b border-slate-200">
        {([
          ['overview', 'Rendimento'],
          ['products', 'Produtos'],
          ['orders', 'Pedidos'],
          ['ai', 'IA Gerencial']
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-5 py-3 rounded-t-2xl text-xs font-black border-b-2 ${
              activeTab === id ? 'border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Faturamento', value: `R$ ${revenue.toFixed(2)}`, detail: `${orders.length} pedidos`, icon: TrendingUp },
            { label: 'Ticket medio', value: `R$ ${averageTicket.toFixed(2)}`, detail: 'Baseado nos pedidos', icon: Sparkles },
            { label: 'Produtos ativos', value: String(products.length), detail: `${lowStock.length} com estoque baixo`, icon: PackagePlus },
            { label: 'Itens vendidos', value: String(itemsSold), detail: 'Pedidos do prototipo', icon: ShieldCheck }
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className={`p-6 rounded-3xl border shadow-sm ${panelClass}`}>
                <Icon className="w-5 h-5 text-indigo-600 mb-4" />
                <p className="text-xs font-bold text-slate-500">{metric.label}</p>
                <p className="text-2xl font-black mt-1">{metric.value}</p>
                <p className="text-xs opacity-70 mt-1">{metric.detail}</p>
              </div>
            );
          })}
        </section>
      )}

      {activeTab === 'products' && (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <form onSubmit={handleSubmit} className={`xl:col-span-5 p-6 rounded-3xl border shadow-sm space-y-4 ${panelClass}`}>
            <h2 className="text-lg font-black">{form.id ? 'Editar produto' : 'Adicionar produto'}</h2>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titulo SEO do produto" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Marca" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" step="0.01" placeholder="Preco" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
              <input value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} type="number" step="0.01" placeholder="De" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
              <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} type="number" placeholder="Estoque" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
            </div>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL da imagem" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} placeholder="Descricao propria para SEO" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Salvar produto
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm(emptyForm)} className="px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold">
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="xl:col-span-7 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produto no inventario" className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm" />
            </div>
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <article key={product.id} className={`p-4 rounded-2xl border flex gap-4 items-center ${panelClass}`}>
                  <img src={product.images[0]} alt={product.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black truncate">{product.title}</h3>
                    <p className="text-xs opacity-70">{product.brand} - estoque {product.stock} - R$ {product.price.toFixed(2)}</p>
                    {product.stock <= 10 && <p className="text-xs text-amber-600 font-bold flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" /> Estoque baixo</p>}
                  </div>
                  <button onClick={() => onSelectProduct(product)} className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold">Ver</button>
                  <button onClick={() => handleEdit(product)} className="p-2 rounded-xl bg-indigo-50 text-indigo-700"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => onDeleteProduct(product.id)} className="p-2 rounded-xl bg-rose-50 text-rose-600"><Trash2 className="w-4 h-4" /></button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className={`p-5 rounded-3xl border shadow-sm ${panelClass}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-black text-indigo-600">{order.id}</p>
                  <p className="text-xs opacity-70">{order.date} - {order.shippingAddress}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black">R$ {order.total.toFixed(2)}</p>
                  <p className="text-xs font-bold capitalize">{order.status.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'ai' && (
        <section className={`max-w-4xl mx-auto rounded-3xl border shadow-sm flex flex-col ${panelClass}`} style={{ maxHeight: '75vh' }}>
          {/* Header */}
          <div className="flex items-center gap-3 p-6 pb-4 border-b border-slate-200">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black">IA Gerencial</h2>
              <p className="text-xs opacity-70">Adicione e remova produtos, consulte dados da loja — sem limites.</p>
            </div>
            <button
              type="button"
              onClick={() => setChat([
                { id: 'init', role: 'ai', text: 'Olá! Sou a IA do painel gerencial. Como posso ajudar?', timestamp: ts() }
              ])}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50"
            >
              Limpar chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '50vh' }}>
            {chat.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : highContrast
                      ? 'bg-zinc-900 text-yellow-300 border border-yellow-400 rounded-bl-md'
                      : 'bg-slate-100 text-slate-800 rounded-bl-md'
                }`}>
                  {msg.text.split('\n').map((line, i) => {
                    // Render inline markdown: **bold**, [text](url)
                    const parts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
                    return (
                      <Fragment key={i}>
                        {i > 0 && <br />}
                        {parts.map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.slice(2, -2)}</strong>;
                          }
                          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                          if (linkMatch) {
                            return (
                              <a key={j} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
                                className="underline font-bold opacity-80 hover:opacity-100">
                                {linkMatch[1]}
                              </a>
                            );
                          }
                          return <span key={j}>{part}</span>;
                        })}
                      </Fragment>
                    );
                  })}
                  <div className={`text-[10px] mt-1.5 opacity-50 ${msg.role === 'user' ? 'text-right text-indigo-200' : ''}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {processing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-md px-5 py-3 text-sm italic">
                  Pensando...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-slate-200 p-4">
            <form onSubmit={handleAiSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onPaste={handleImagePaste}
                  placeholder='Ex: "Adicione iPhone 15 por R$ 4999 estoque: 10 imagem: https://..." ou "Remova iPhone"'
                  className={`w-full px-4 py-3 rounded-2xl border text-sm pr-10 ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300 placeholder-yellow-600'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  disabled={processing}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                  title="Enviar imagem"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <button
                type="submit"
                disabled={processing || !aiInput.trim()}
                className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </form>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Digite "ajuda" para ver os comandos disponíveis | Cole ou faça upload de imagem
            </p>
          </div>
        </section>
      )}
    </main>
  );
};
