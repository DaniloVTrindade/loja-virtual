import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { AIAssistant } from './components/AIAssistant';
import { AuthPanel } from './components/AuthPanel';
import { BannerSlider } from './components/BannerSlider';
import { CartCheckout } from './components/CartCheckout';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LegalPage } from './components/LegalPage';
import { ManagerDashboard } from './components/ManagerDashboard';
import { ProductDetail } from './components/ProductDetail';
import { ProductList } from './components/ProductList';
import { UserDashboard } from './components/UserDashboard';
import { MANAGERS, MOCK_COUPONS, MOCK_ORDERS, MOCK_PRODUCTS, STORE_POLICIES } from './data/mockData';
import { AccessibilitySettings, AuthRecord, CartItem, Order, Product, StoreAccount, StorePolicy, UserProfile } from './types';
import { loadBootstrap, loadSession, loginAccount as apiLoginAccount, registerAccount as apiRegisterAccount, removeProduct as apiRemoveProduct, saveOrder as apiSaveOrder, saveProduct as apiSaveProduct } from './services/backend';
import { useLocalStorage } from './utils/useLocalStorage';

export const App: React.FC = () => {
  const isAdminPortal = new URLSearchParams(window.location.search).get('iw') === 'admin';
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPolicySlug, setSelectedPolicySlug] = useState<StorePolicy['slug']>('terms');
  const [user, setUser] = useLocalStorage<UserProfile>('indigo-white-user', {
    id: '',
    name: 'Visitante',
    email: '',
    avatar: 'https://ui-avatars.com/api/?name=Visitante&background=312e81&color=fff&bold=true',
    role: 'client',
    walletBalance: 0,
    walletEarnings: 0,
    tier: 'Básico',
    savedAddresses: [],
    favoriteIds: []
  });
  const [products, setProducts] = useLocalStorage<Product[]>('indigo-white-products', MOCK_PRODUCTS);
  const [orders, setOrders] = useLocalStorage<Order[]>('indigo-white-orders', MOCK_ORDERS);
  const [session, setSession] = useLocalStorage<StoreAccount | null>('indigo-white-session', null);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('indigo-white-cart', [
    { product: MOCK_PRODUCTS[1], quantity: 1 }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [profileTab, setProfileTab] = useState('wallet');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 'base',
    highContrast: false,
    voiceAssist: false,
    screenReaderHelp: false,
    letterSpacing: false
  });

  useEffect(() => {
    let mounted = true;
    loadBootstrap()
      .then((data) => {
        if (!mounted) return;
        if (data.products?.length) setProducts(data.products);
        if (data.orders?.length) setOrders(data.orders);
      })
      .catch(() => {
        // Keep the local demo data if the backend is not yet available.
      });

    return () => {
      mounted = false;
    };
  }, [setOrders, setProducts]);

  useEffect(() => {
    let mounted = true;
    if (!session?.token) return;

    loadSession(session.token)
      .then((account) => {
        if (!mounted) return;
        setSession((prev) => prev ? { ...prev, ...account } : account);
        setUser((prev) => ({
          ...prev,
          id: account.id,
          role: account.role,
          name: account.name,
          email: account.email,
          avatar: account.avatar
        }));
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
      });

    return () => {
      mounted = false;
    };
  }, [session?.token, setSession, setUser]);

  const activeManager = useMemo(() => {
    if (session?.role !== 'manager') return MANAGERS[0];
    return MANAGERS.find((manager) => manager.id === session.id) || MANAGERS[0];
  }, [session]);

  const selectedPolicy = STORE_POLICIES.find((policy) => policy.slug === selectedPolicySlug) || STORE_POLICIES[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    triggerToast(`"${product.title.slice(0, 30)}..." adicionado ao carrinho`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => prev
      .map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    triggerToast('Produto removido do carrinho');
  };

  const handleClearCart = () => {
    setCartItems([]);
    triggerToast('Carrinho esvaziado');
  };

  const handleBuyNow = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      return existing ? prev : [...prev, { product, quantity: 1 }];
    });
    setActiveView('cart');
  };

  const handleCompleteOrder = (newOrder: Order) => {
    apiSaveOrder(newOrder, session?.id, session?.token)
      .then(() => {
        setOrders((prev) => [newOrder, ...prev]);
        setUser((prev) => ({
          ...prev,
          walletBalance: prev.walletBalance + newOrder.total * 0.01,
          walletEarnings: prev.walletEarnings + newOrder.total * 0.01
        }));
      })
      .catch(() => {
        setOrders((prev) => [newOrder, ...prev]);
      });
  };

  const handleToggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUser((prev) => {
      const exists = prev.favoriteIds.includes(productId);
      triggerToast(exists ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
      return {
        ...prev,
        favoriteIds: exists ? prev.favoriteIds.filter((id) => id !== productId) : [...prev.favoriteIds, productId]
      };
    });
  };

  const handleCreateProduct = (product: Product) => {
    apiSaveProduct(product, session?.token)
      .then(() => {
        setProducts((prev) => [product, ...prev.filter((item) => item.id !== product.id)]);
        triggerToast('Produto publicado no catalogo');
      })
      .catch(() => triggerToast('Falha ao salvar no banco'));
  };

  const handleUpdateProduct = (product: Product) => {
    apiSaveProduct(product, session?.token)
      .then(() => {
        setProducts((prev) => prev.map((item) => item.id === product.id ? product : item));
        setSelectedProduct((prev) => prev?.id === product.id ? product : prev);
        triggerToast('Produto atualizado');
      })
      .catch(() => triggerToast('Falha ao atualizar no banco'));
  };

  const handleDeleteProduct = (productId: string) => {
    apiRemoveProduct(productId, session?.token)
      .then(() => {
        setProducts((prev) => prev.filter((item) => item.id !== productId));
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
        if (selectedProduct?.id === productId) {
          setSelectedProduct(null);
          setActiveView('manager');
        }
        triggerToast('Produto removido');
      })
      .catch(() => triggerToast('Falha ao remover no banco'));
  };

  const handleLogin = (account: AuthRecord) => {
    setSession({
      id: account.id,
      role: account.role,
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      token: account.token
    });
    setUser((prev) => ({
      ...prev,
      id: account.id,
      role: account.role,
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      savedAddresses: prev.savedAddresses,
      favoriteIds: prev.favoriteIds
    }));
    setActiveView(account.role === 'manager' ? 'manager' : 'profile');
    triggerToast(`Bem-vindo, ${account.name.split(' ')[0]}`);
  };

  const handleRegisterAccount = (account: AuthRecord) => {
    return apiRegisterAccount({
      role: account.role,
      name: account.name,
      email: account.email,
      password: account.password,
      avatar: account.avatar,
      savedAddresses: account.savedAddresses,
      managerId: account.role === 'manager' ? account.id : undefined
    }).then((registered) => {
      handleLogin({ ...registered, password: account.password });
      setUser((prev) => ({
        ...prev,
        id: registered.id,
        role: registered.role,
        name: registered.name,
        email: registered.email,
        avatar: registered.avatar,
        walletBalance: 0,
        walletEarnings: 0,
        tier: 'Básico',
        savedAddresses: account.savedAddresses?.length ? account.savedAddresses : [],
        favoriteIds: []
      }));
      return registered;
    });
  };

  const handleLoginRequest = (role: 'client' | 'manager', email: string, password: string) => {
    return apiLoginAccount(email, password, role);
  };

  const handleLogout = () => {
    setSession(null);
    setUser({
      id: '',
      name: 'Visitante',
      email: '',
      avatar: 'https://ui-avatars.com/api/?name=Visitante&background=312e81&color=fff&bold=true',
      role: 'client',
      walletBalance: 0,
      walletEarnings: 0,
      tier: 'Básico',
      savedAddresses: [],
      favoriteIds: []
    });
    setActiveView('home');
    triggerToast('Voce saiu da conta');
  };

  const openPolicy = (slug: StorePolicy['slug']) => {
    setSelectedPolicySlug(slug);
    setActiveView('legal');
  };

  const getAccessibilityClasses = () => {
    const fontClass = accessibilitySettings.fontSize === 'sm'
      ? 'text-sm'
      : accessibilitySettings.fontSize === 'lg'
        ? 'text-lg'
        : accessibilitySettings.fontSize === 'xl'
          ? 'text-xl font-medium'
          : 'text-base';
    const spacingClass = accessibilitySettings.letterSpacing ? 'tracking-wide leading-loose' : '';
    const contrastClass = accessibilitySettings.highContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-800';
    return `${fontClass} ${spacingClass} ${contrastClass} min-h-screen font-sans antialiased transition-colors duration-200`;
  };

  return (
    <div className={getAccessibilityClasses()}>
      <Header
        user={user}
        cartItems={cartItems}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeView={activeView}
        setActiveView={setActiveView}
        toggleAccessibilityDrawer={() => setShowAccessibility(true)}
        session={session}
        onLogout={handleLogout}
      />

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-2xl shadow-2xl border border-indigo-700 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="pb-12">
        {activeView === 'home' && (
          <>
            <BannerSlider
              coupons={MOCK_COUPONS}
              onSelectCategory={(cat) => { setSelectedCategory(cat); setActiveView('home'); }}
              onOpenCoupons={() => { setProfileTab('wallet'); setActiveView('profile'); }}
              highContrast={accessibilitySettings.highContrast}
            />
            <ProductList
              products={products}
              onSelectProduct={(product) => { setSelectedProduct(product); setActiveView('detail'); }}
              onAddToCart={handleAddToCart}
              favorites={user.favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              highContrast={accessibilitySettings.highContrast}
              screenReaderHelp={accessibilitySettings.screenReaderHelp}
            />
          </>
        )}

        {activeView === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setActiveView(session?.role === 'manager' ? 'manager' : 'home')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isFavorite={user.favoriteIds.includes(selectedProduct.id)}
            onToggleFavorite={handleToggleFavorite}
            highContrast={accessibilitySettings.highContrast}
          />
        )}

        {activeView === 'cart' && (
          <CartCheckout
            cartItems={cartItems}
            user={user}
            coupons={MOCK_COUPONS}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCompleteOrder={handleCompleteOrder}
            onBackToShopping={() => setActiveView('home')}
            highContrast={accessibilitySettings.highContrast}
          />
        )}

        {activeView === 'profile' && (
          session?.role === 'client' ? (
            <UserDashboard
              user={user}
              orders={orders}
              products={products}
              coupons={MOCK_COUPONS}
              onAddProduct={handleCreateProduct}
              onSelectProduct={(product) => { setSelectedProduct(product); setActiveView('detail'); }}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              highContrast={accessibilitySettings.highContrast}
              initialTab={profileTab}
            />
          ) : (
            <AuthPanel
              portal={isAdminPortal ? 'admin' : 'public'}
              managers={MANAGERS}
              onRegisterAccount={handleRegisterAccount}
              onLoginRequest={handleLoginRequest}
              onLogin={handleLogin}
              onBack={() => setActiveView('home')}
              highContrast={accessibilitySettings.highContrast}
            />
          )
        )}

        {activeView === 'login' && (
          <AuthPanel
            portal={isAdminPortal ? 'admin' : 'public'}
            managers={MANAGERS}
            onRegisterAccount={handleRegisterAccount}
            onLoginRequest={handleLoginRequest}
            onLogin={handleLogin}
            onBack={() => setActiveView('home')}
            highContrast={accessibilitySettings.highContrast}
          />
        )}

        {activeView === 'manager' && (
          <ManagerDashboard
            manager={activeManager}
            managers={MANAGERS}
            products={products}
            orders={orders}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onSelectProduct={(product) => { setSelectedProduct(product); setActiveView('detail'); }}
            highContrast={accessibilitySettings.highContrast}
          />
        )}

        {activeView === 'legal' && (
          <LegalPage
            policy={selectedPolicy}
            onBack={() => setActiveView('home')}
            highContrast={accessibilitySettings.highContrast}
          />
        )}
      </div>

      <AIAssistant
        highContrast={accessibilitySettings.highContrast}
        onOpenCoupons={() => { setProfileTab('wallet'); setActiveView('profile'); }}
        onOpenAccessibility={() => setShowAccessibility(true)}
        hidden={activeView === 'manager'}
      />

      <AccessibilityWidget
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
        settings={accessibilitySettings}
        setSettings={setAccessibilitySettings}
      />

      <Footer highContrast={accessibilitySettings.highContrast} onOpenPolicy={openPolicy} />
    </div>
  );
};

export default App;
