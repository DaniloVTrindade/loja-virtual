import React, { useState } from 'react';
import {
  Accessibility,
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  User,
  X
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CartItem, StoreAccount, UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  cartItems: CartItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  toggleAccessibilityDrawer: () => void;
  session: StoreAccount | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  cartItems,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  activeView,
  setActiveView,
  toggleAccessibilityDrawer,
  session,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const identity = session || {
    id: 'guest',
    role: 'client' as const,
    name: 'Visitante',
    email: 'cadastre-se para acessar sua conta',
    avatar: 'https://ui-avatars.com/api/?name=Visitante&background=312e81&color=fff&bold=true'
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('home');
  };

  const goHome = () => {
    setActiveView('home');
    setSelectedCategory('');
    setSearchTerm('');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-md">
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-indigo-100 flex justify-between items-center border-b border-indigo-900/70">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <span className="flex items-center gap-1 font-medium text-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span className="font-bold">Indigo White</span>
            <span>: produtos selecionados, checkout seguro e gestao integrada</span>
          </span>
          <span className="hidden md:flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Compra garantida e devolucao acompanhada
          </span>
        </div>
        <button
          onClick={toggleAccessibilityDrawer}
          className="flex items-center gap-1 bg-indigo-900 hover:bg-indigo-800 text-white font-medium py-1 px-2.5 rounded-full transition-colors focus:ring-2 focus:ring-yellow-400 outline-none"
          aria-label="Opcoes de acessibilidade"
        >
          <Accessibility className="w-4 h-4 text-yellow-300" />
          <span className="font-semibold">Acessibilidade</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <button onClick={goHome} className="flex items-center gap-2 group focus:ring-2 focus:ring-yellow-400 outline-none rounded-lg p-1">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-950 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                IW
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-200 bg-clip-text text-transparent">
                Indigo White
              </h1>
              <p className="text-[10px] text-indigo-200 font-semibold tracking-wider uppercase">Premium acessivel</p>
            </div>
          </button>

          <div className="flex items-center space-x-2 md:hidden">
            <button onClick={() => setActiveView('cart')} className="relative p-2 rounded-lg bg-indigo-700 hover:bg-indigo-600" aria-label="Ver carrinho">
              <ShoppingCart className="w-6 h-6 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-indigo-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
            <button onClick={() => setShowCategoryMobile(!showCategoryMobile)} className="p-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white" aria-label="Menu de categorias">
              {showCategoryMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 max-w-2xl px-2 md:px-6">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (activeView !== 'home') setActiveView('home');
              }}
              placeholder="Buscar produtos, marcas e categorias..."
              className="w-full bg-white text-slate-900 pl-11 pr-10 py-2.5 rounded-xl shadow-inner text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent placeholder-slate-400"
              aria-label="Barra de busca de produtos"
            />
            <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')} className="absolute right-3 text-slate-400 hover:text-slate-600 p-1" aria-label="Limpar busca">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="hidden md:flex items-center space-x-5">
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 hover:bg-indigo-800/80 p-1.5 rounded-xl transition-colors focus:ring-2 focus:ring-yellow-400 outline-none">
              <img src={identity.avatar} alt={identity.name} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300 shadow" />
              <div className="text-left leading-tight">
                <p className="text-xs text-indigo-200">Ola, <span className="font-bold text-white">{identity.name.split(' ')[0]}</span></p>
                <div className="flex items-center gap-1 text-[11px] bg-indigo-950/70 px-1.5 py-0.5 rounded text-indigo-100 font-semibold mt-0.5">
                  <span>{!session ? 'Entrar ou cadastrar' : identity.role === 'manager' ? 'Acesso interno' : `Carteira: R$ ${user.walletBalance.toFixed(2)}`}</span>
                  <ChevronDown className="w-3 h-3 text-indigo-300" />
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl py-3 text-slate-800 border border-slate-200 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-sm text-slate-900">{identity.name}</p>
                  <p className="text-xs text-slate-500">{identity.email}</p>
                  <div className="mt-2 bg-gradient-to-r from-slate-950 to-indigo-700 text-white rounded-lg p-2.5 text-xs shadow-sm">
                    <div className="flex justify-between font-bold">
                      <span>{!session ? 'Conta Indigo White' : identity.role === 'manager' ? 'Area interna' : 'Carteira Indigo'}</span>
                      <span>{!session ? 'Acesso' : identity.role === 'manager' ? 'Equipe' : `R$ ${user.walletBalance.toFixed(2)}`}</span>
                    </div>
                    <p className="text-[10px] text-indigo-100 mt-1">
                      {!session ? 'Crie sua conta de cliente ou entre' : identity.role === 'manager' ? 'Produtos, pedidos, precos, politicas e IA' : `Rendimento de R$ ${user.walletEarnings.toFixed(2)} este mes`}
                    </p>
                  </div>
                </div>

                <div className="py-1">
                  {identity.role === 'manager' ? (
                    <button onClick={() => { setActiveView('manager'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 font-medium flex items-center gap-2.5 text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Painel de Gerente
                    </button>
                  ) : (
                    <>
                      <button onClick={() => { setActiveView('profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 font-medium flex items-center gap-2.5 text-slate-700">
                        <User className="w-4 h-4 text-indigo-600" />
                        Meu Perfil & Compras
                      </button>
                      <button onClick={() => { setActiveView('profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 font-medium flex items-center gap-2.5 text-slate-700">
                        <Heart className="w-4 h-4 text-rose-500" />
                        Meus Favoritos ({user.favoriteIds.length})
                      </button>
                    </>
                  )}

                  <button onClick={() => { setActiveView('login'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50 font-medium flex items-center gap-2.5 text-purple-700">
                    <LogIn className="w-4 h-4 text-purple-600" />
                    Entrar / Trocar perfil
                  </button>

                  {session && (
                    <button onClick={() => { onLogout(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 font-medium flex items-center gap-2.5 text-rose-700">
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setActiveView('cart')} className="relative flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white px-3.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 focus:ring-2 focus:ring-yellow-400 outline-none" aria-label={`Carrinho com ${totalCartCount} itens`}>
            <ShoppingCart className="w-5 h-5 text-indigo-100" />
            <span className="text-xs font-bold hidden lg:inline">Carrinho</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-indigo-950 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className={`bg-indigo-950 border-t border-indigo-900/70 ${showCategoryMobile ? 'block' : 'hidden md:block'}`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center gap-2 md:gap-6 text-xs md:text-sm font-medium">
          <button onClick={() => { setSelectedCategory(''); setActiveView('home'); setShowCategoryMobile(false); }} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === '' && activeView === 'home' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-indigo-200 hover:text-white hover:bg-indigo-900'}`}>
            Todas as Categorias
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setActiveView('home'); setShowCategoryMobile(false); }} className={`px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === cat.id && activeView === 'home' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-indigo-100 hover:text-white hover:bg-indigo-900'}`}>
              {cat.name}
            </button>
          ))}
          <div className="ml-auto hidden xl:flex items-center space-x-4 text-xs text-indigo-200 font-semibold">
            <button onClick={() => setActiveView('profile')} className="hover:text-white">Cupons & Promos</button>
            <button onClick={() => setActiveView('login')} className="hover:text-white flex items-center gap-1 bg-indigo-700/80 px-2 py-1 rounded-md text-white">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Minha conta</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
