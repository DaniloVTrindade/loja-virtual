import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/mockData';
import { SlidersHorizontal, ArrowUpDown, X, Zap, HelpCircle, AlertCircle } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  favorites: string[];
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  highContrast: boolean;
  screenReaderHelp: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  highContrast,
  screenReaderHelp,
}) => {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [onlyFreeShipping, setOnlyFreeShipping] = useState<boolean>(false);
  const [onlyFull, setOnlyFull] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search term filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== '') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price filters
    if (minPrice !== '' && !isNaN(Number(minPrice))) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Free shipping
    if (onlyFreeShipping) {
      result = result.filter((p) => p.freeShipping);
    }

    // Full delivery
    if (onlyFull) {
      result = result.filter((p) => p.fullDelivery);
    }

    // Condition
    if (condition !== '') {
      result = result.filter((p) => p.condition === condition);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } // default is relevance (mock order)

    return result;
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice, onlyFreeShipping, onlyFull, condition, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setOnlyFreeShipping(false);
    setOnlyFull(false);
    setCondition('');
    setSortBy('relevance');
  };

  const hasActiveFilters =
    selectedCategory !== '' ||
    searchTerm !== '' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    onlyFreeShipping ||
    onlyFull ||
    condition !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Screen reader help badge if enabled */}
      {screenReaderHelp && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed font-medium ${
          highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-indigo-50 border-indigo-200 text-indigo-950'
        }`}>
          <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Dica de Acessibilidade (Leitor Ativo):</p>
            <p>Você está na seção principal de catálogo. O painel à esquerda contém os filtros de preço, categoria e envio. Para pular direto para a lista de produtos, pressione a tecla <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded font-mono text-[10px]">TAB</kbd> consecutivamente. Os produtos listados têm botões de compra rápida acessíveis por leitores de tela.</p>
          </div>
        </div>
      )}

      {/* Header bar: Title and Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {selectedCategory
              ? CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Produtos'
              : searchTerm
              ? `Resultados para "${searchTerm}"`
              : 'Destaques e Ofertas do Dia'}
          </h2>
          <p className={`text-xs mt-1 ${highContrast ? 'text-yellow-400' : 'text-slate-500'}`}>
            Encontramos <strong className="font-bold">{filteredProducts.length}</strong> produtos disponíveis para você
          </p>
        </div>

        {/* Action buttons (Mobile filter trigger + Sort select) */}
        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className={`lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              highContrast ? 'bg-zinc-900 text-yellow-300 border-yellow-400' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros {hasActiveFilters && '✨'}</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${
                highContrast
                  ? 'bg-zinc-900 text-yellow-300 border-yellow-400'
                  : 'bg-white text-slate-800 border-slate-200 shadow-sm'
              }`}
              aria-label="Ordenar produtos por"
            >
              <option value="relevance">Mais relevantes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="rating">Mais bem avaliados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:block ${showFiltersMobile ? 'block' : 'hidden'} space-y-6`}>
          <div className={`p-6 rounded-3xl border space-y-6 ${
            highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Filtros
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpar
                </button>
              )}
            </div>

            {/* Categories list */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Categorias</p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    selectedCategory === ''
                      ? (highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-indigo-50 text-indigo-700 font-bold')
                      : (highContrast ? 'hover:bg-zinc-900 text-yellow-300' : 'hover:bg-slate-100 text-slate-700')
                  }`}
                >
                  Todas as Categorias
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? (highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-indigo-50 text-indigo-700 font-bold')
                        : (highContrast ? 'hover:bg-zinc-900 text-yellow-300' : 'hover:bg-slate-100 text-slate-700')
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping filters */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Envio e Garantia</p>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFreeShipping}
                    onChange={(e) => setOnlyFreeShipping(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-yellow-400 border-slate-300"
                  />
                  <span>Frete Grátis</span>
                </label>
                <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFull}
                    onChange={(e) => setOnlyFull(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-yellow-400 border-slate-300"
                  />
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Envios FULL
                  </span>
                </label>
              </div>
            </div>

            {/* Price Range Inputs */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Faixa de Preço</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Mínimo (R$)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Máximo (R$)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="5000"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-1 mt-3">
                <button
                  onClick={() => { setMinPrice('0'); setMaxPrice('100'); }}
                  className="w-full text-left text-xs text-slate-500 hover:text-indigo-600 py-1 font-medium"
                >
                  Até R$ 100
                </button>
                <button
                  onClick={() => { setMinPrice('100'); setMaxPrice('500'); }}
                  className="w-full text-left text-xs text-slate-500 hover:text-indigo-600 py-1 font-medium"
                >
                  R$ 100 a R$ 500
                </button>
                <button
                  onClick={() => { setMinPrice('500'); setMaxPrice(''); }}
                  className="w-full text-left text-xs text-slate-500 hover:text-indigo-600 py-1 font-medium"
                >
                  Acima de R$ 500
                </button>
              </div>
            </div>

            {/* Condition */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Condição do item</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={condition === ''}
                    onChange={() => setCondition('')}
                    className="w-4 h-4 text-indigo-600 focus:ring-yellow-400 border-slate-300"
                  />
                  <span>Todos</span>
                </label>
                <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={condition === 'novo'}
                    onChange={() => setCondition('novo')}
                    className="w-4 h-4 text-indigo-600 focus:ring-yellow-400 border-slate-300"
                  />
                  <span>Novo</span>
                </label>
                <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={condition === 'usado'}
                    onChange={() => setCondition('usado')}
                    className="w-4 h-4 text-indigo-600 focus:ring-yellow-400 border-slate-300"
                  />
                  <span>Usado</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className={`p-12 rounded-3xl border text-center space-y-4 ${
              highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-400' : 'bg-white text-slate-800 border-slate-200 shadow-sm'
            }`}>
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold">Nenhum produto encontrado</h3>
              <p className="text-xs max-w-md mx-auto opacity-80">
                Não encontramos produtos que correspondam à sua busca ou aos filtros selecionados. Tente buscar por palavras-chave mais simples ou limpe os filtros.
              </p>
              <button
                onClick={clearAllFilters}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  highContrast={highContrast}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
