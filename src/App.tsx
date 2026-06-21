import React, { useMemo, useState } from 'react';
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
import { useLocalStorage } from './utils/useLocalStorage';

export const App: React.FC = () => {
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
  const [clientAccounts, setClientAccounts] = useLocalStorage<AuthRecord[]>('indigo-white-client-accounts', []);
  const [managerAccounts, setManagerAccounts] = useLocalStorage<AuthRecord[]>('indigo-white-manager-accounts', []);
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
    setOrders((prev) => [newOrder, ...prev]);
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + newOrder.total * 0.01,
      walletEarnings: prev.walletEarnings + newOrder.total * 0.01
    }));
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
    setProducts((prev) => [product, ...prev]);
    triggerToast('Produto publicado no catalogo');
  };

  const handleUpdateProduct = (product: Product) => {
    setProducts((prev) => prev.map((item) => item.id === product.id ? product : item));
    setSelectedProduct((prev) => prev?.id === product.id ? product : prev);
    triggerToast('Produto atualizado');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
      setActiveView('manager');
    }
    triggerToast('Produto removido');
  };

  const handleLogin = (account: StoreAccount) => {
    setSession(account);
    if (account.role === 'client') {
      const clientRecord = clientAccounts.find((item) => item.id === account.id);
      setUser((prev) => ({
        ...prev,
        id: account.id,
        role: 'client',
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        savedAddresses: clientRecord?.savedAddresses?.length ? clientRecord.savedAddresses : prev.savedAddresses
      }));
    }
    setActiveView(account.role === 'manager' ? 'manager' : 'profile');
    triggerToast(`Bem-vindo, ${account.name.split(' ')[0]}`);
  };

  const handleRegisterClient = (account: AuthRecord) => {
    setClientAccounts((prev) => [account, ...prev]);
    setUser((prev) => ({
      ...prev,
      id: account.id,
      role: 'client',
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      walletBalance: 0,
      walletEarnings: 0,
      tier: 'Básico',
      savedAddresses: account.savedAddresses?.length ? account.savedAddresses : [],
      favoriteIds: []
    }));
  };

  const handleSaveManagerPassword = (account: AuthRecord) => {
    setManagerAccounts((prev) => {
      const exists = prev.some((item) => item.id === account.id);
      return exists ? prev.map((item) => item.id === account.id ? account : item) : [account, ...prev];
    });
  };

  const handleLogout = () => {
    setSession(null);
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
              managers={MANAGERS}
              clientAccounts={clientAccounts}
              managerAccounts={managerAccounts}
              onRegisterClient={handleRegisterClient}
              onSaveManagerPassword={handleSaveManagerPassword}
              onLogin={handleLogin}
              onBack={() => setActiveView('home')}
              highContrast={accessibilitySettings.highContrast}
            />
          )
        )}

        {activeView === 'login' && (
          <AuthPanel
            managers={MANAGERS}
            clientAccounts={clientAccounts}
            managerAccounts={managerAccounts}
            onRegisterClient={handleRegisterClient}
            onSaveManagerPassword={handleSaveManagerPassword}
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
