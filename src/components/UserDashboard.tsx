import React, { useState } from 'react';
import { UserProfile, Order, Product, Coupon } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/mockData';
import { Wallet, Package, Tag, PlusCircle, Heart, Sparkles, TrendingUp, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';

interface UserDashboardProps {
  user: UserProfile;
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  onAddProduct: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
  highContrast: boolean;
  initialTab?: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  orders,
  products,
  coupons,
  onAddProduct,
  onSelectProduct,
  onAddToCart,
  onToggleFavorite,
  highContrast,
  initialTab = 'wallet'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // New Product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].id);
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState<'novo' | 'usado'>('novo');
  const [newDescription, setNewDescription] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // My published products mock state (filtered by seller name matching user or created)
  const myCreatedProducts = products.filter((p) => p.seller.name === user.name || p.id.startsWith('my-prod'));

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newProd: Product = {
      id: `my-prod-${Date.now()}`,
      title: newTitle,
      price: parseFloat(newPrice) || 99.90,
      installments: { count: 12, amount: (parseFloat(newPrice) || 99.90) / 12, interestFree: true },
      freeShipping: true,
      fullDelivery: true,
      category: newCategory,
      brand: 'Marca Independente',
      condition: newCondition,
      stock: parseInt(newStock) || 1,
      rating: 5.0,
      reviewsCount: 1,
      images: [newImageUrl],
      description: newDescription || 'Produto verificado com qualidade superior e garantia do vendedor.',
      attributes: {
        'Qualidade': 'Inspeção VIP Índigo',
        'Garantia': '90 dias direto com o vendedor',
        'Disponibilidade': 'Estoque Imediato',
      },
      seller: {
        id: 'user-seller',
        name: user.name,
        reputation: 'excelente',
        salesCount: 12,
        rating: 5.0,
        location: 'São Paulo, SP',
        badge: 'Vendedor Índigo Pro'
      },
      reviews: [
        { id: `r-${Date.now()}`, user: 'Curadoria Índigo', rating: 5, date: 'Agora', comment: 'Anúncio inspecionado e aprovado no sistema.', helpful: 1 }
      ],
      questions: []
    };

    onAddProduct(newProd);
    setShowSuccessToast(true);
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const favoriteProducts = products.filter((p) => user.favoriteIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Header Profile Summary */}
      <div className={`rounded-3xl border p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 ${
        highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-gradient-to-r from-indigo-800 via-indigo-900 to-purple-950 text-white'
      }`}>
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-purple-400 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <span className="bg-purple-600 text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border border-purple-400">
                {user.tier}
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1">{user.email}</p>
            <div className="mt-2 text-xs text-purple-100 flex items-center gap-3">
              <span>💳 Compra Garantida</span>
              <span>⭐ Vendedor Nível 5</span>
            </div>
          </div>
        </div>

        {/* Mercado Pago Indigo Summary */}
        <div className={`p-4 rounded-2xl w-full md:w-80 space-y-2 shadow-inner border ${
          highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-indigo-950/60 border-indigo-700/60 text-white'
        }`}>
          <div className="flex items-center justify-between text-xs opacity-90">
            <span className="font-bold flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-purple-300" />
              Mercado Pago Índigo
            </span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{user.walletEarnings.toFixed(2)}
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight">R$ {user.walletBalance.toFixed(2)}</p>
          <p className="text-[10px] text-slate-300">Rendimento diário de 102% do CDI garantido</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200 flex flex-wrap items-center gap-2">
        {[
          { id: 'wallet', label: 'Carteira & Cupons', icon: Wallet },
          { id: 'orders', label: 'Meus Pedidos', icon: Package },
          { id: 'listings', label: 'Meus Anúncios', icon: Tag },
          { id: 'create', label: 'Anunciar Produto', icon: PlusCircle },
          { id: 'favorites', label: `Favoritos (${favoriteProducts.length})`, icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold rounded-t-2xl transition-all border-b-2 ${
                isActive
                  ? (highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-400 font-black' : 'text-indigo-600 border-indigo-600 bg-indigo-50/50')
                  : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WALLET & COUPONS */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((coupon, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 shadow-sm ${
              highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-100 text-indigo-800 font-mono font-black text-sm px-3 py-1 rounded-xl border border-indigo-200">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-lg">
                    {coupon.expiresIn}
                  </span>
                </div>
                <h3 className="font-bold text-base pt-2">{coupon.description}</h3>
                <p className="text-xs opacity-70">
                  Válido para itens com selo FULL e compras acima de R$ {coupon.minSpend.toFixed(2)}.
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(coupon.code)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>Copiar Cupom</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="p-12 text-center border rounded-3xl bg-white shadow-sm space-y-3">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="font-bold text-base">Nenhum pedido realizado ainda.</p>
              <p className="text-xs opacity-60">Você poderá acompanhar todo o processo de entrega nesta tela.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={`rounded-3xl border p-6 space-y-6 shadow-sm ${
                highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-yellow-400 text-sm">{order.id}</span>
                    <span className="text-xs opacity-70 ml-2">Realizado em {order.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === 'entregue'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'em_transito'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status === 'entregue' ? '✓ Pedido Entregue' : order.status === 'em_transito' ? '🚚 Em Trânsito' : '⏳ Em Separação'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-16 h-16 rounded-2xl object-cover border shadow-sm shrink-0"
                      />
                      <div className="space-y-1 flex-1">
                        <h4 className="font-bold text-xs md:text-sm line-clamp-2">{item.product.title}</h4>
                        <p className="text-xs opacity-80">{item.quantity}x de R$ {item.product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => onSelectProduct(item.product)}
                        className="text-xs font-bold text-indigo-600 dark:text-yellow-300 hover:underline flex items-center gap-1"
                      >
                        <span>Comprar novamente</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tracking Progress timeline */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold mb-4 opacity-80">Rastreamento Índigo Express</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {order.trackingSteps.map((step, sIdx) => (
                      <div key={sIdx} className={`p-3 rounded-2xl border text-xs space-y-1 ${
                        step.completed
                          ? (highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-emerald-50/50 border-emerald-200 text-emerald-950')
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        <div className="flex items-center justify-between font-bold">
                          <span>{step.status}</span>
                          {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] opacity-80 leading-tight">{step.description}</p>
                        <span className="text-[10px] opacity-60 block">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: MY LISTINGS (ANÚNCIOS) */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Gerenciar Anúncios Ativos</h3>
              <p className="text-xs opacity-70">Acompanhe visualizações e estoque dos seus produtos anunciados.</p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Anúncio</span>
            </button>
          </div>

          {myCreatedProducts.length === 0 ? (
            <div className="p-12 text-center border rounded-3xl bg-white shadow-sm space-y-4">
              <Tag className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="font-bold text-base">Você ainda não tem anúncios ativos.</p>
              <p className="text-xs opacity-60 max-w-md mx-auto">Comece a vender agora mesmo no Mercado Índigo. O cadastro leva menos de um minuto e seu anúncio entra instantaneamente no catálogo do site!</p>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all ${
                  highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Anunciar Meu Primeiro Produto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCreatedProducts.map((p) => (
                <div key={p.id} className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 shadow-sm ${
                  highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
                }`}>
                  <div className="flex items-start gap-4">
                    <img src={p.images[0]} alt={p.title} className="w-20 h-20 rounded-2xl object-cover border shadow-sm shrink-0" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">ATIVO</span>
                        <span className="text-xs opacity-70">142 visitas</span>
                      </div>
                      <h4 className="font-bold text-sm line-clamp-2">{p.title}</h4>
                      <p className="text-base font-black text-indigo-600 dark:text-yellow-300">R$ {p.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => onSelectProduct(p)}
                      className={`flex-1 py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                        highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Ver no Catálogo
                    </button>
                    <button
                      onClick={() => alert(`Simulação: Anúncio "${p.title}" pausado com sucesso!`)}
                      className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-amber-50 text-slate-600 hover:text-amber-700 font-bold transition-all"
                    >
                      Pausar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CREATE PRODUCT (VENDER) */}
      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className={`rounded-3xl border p-8 space-y-6 shadow-sm ${
            highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <h2 className="text-xl font-bold tracking-tight">Crie seu Anúncio no Mercado Índigo</h2>
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            </div>

            {showSuccessToast && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 flex items-center gap-3 text-xs font-bold animate-bounce">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Parabéns! Seu produto foi anunciado com sucesso e já está disponível para todo o Brasil no catálogo ao vivo do site!</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-6 text-xs md:text-sm">
              <div className="space-y-2">
                <label className="font-bold block">Título do Produto *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: Câmera Digital Índigo Pro 4K WiFi com Lente 50mm"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300 placeholder-yellow-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold block">Categoria *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-bold block">Condição do item</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as 'novo' | 'usado')}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="novo">Novo</option>
                    <option value="usado">Usado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold block">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="ex: 349.90"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300 placeholder-yellow-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold block">Quantidade em Estoque</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold block">URL da Imagem de Capa (Recomendado Unsplash)</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold block">Descrição Detalhada</label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descreva as especificações, conteúdo da caixa e garantias do seu produto..."
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300 placeholder-yellow-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500 ring-2 ring-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Publicar Anúncio Agora</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold">Meus Produtos Favoritos</h3>
          {favoriteProducts.length === 0 ? (
            <div className="p-12 text-center border rounded-3xl bg-white shadow-sm space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-base">Sua lista de favoritos está vazia.</p>
              <p className="text-xs opacity-60">Clique no ícone de coração nos produtos para guardá-los aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  highContrast={highContrast}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
