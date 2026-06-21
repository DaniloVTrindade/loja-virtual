export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

export interface Question {
  id: string;
  user: string;
  question: string;
  answer?: string;
  date: string;
  answeredDate?: string;
}

export interface Seller {
  id: string;
  name: string;
  reputation: 'excelente' | 'bom' | 'regular';
  salesCount: number;
  rating: number;
  location: string;
  badge?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  installments: {
    count: number;
    amount: number;
    interestFree: boolean;
  };
  freeShipping: boolean;
  fullDelivery: boolean; // Similar to Mercado Libre FULL
  category: string;
  brand: string;
  condition: 'novo' | 'usado';
  stock: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  attributes: { [key: string]: string };
  seller: Seller;
  reviews: Review[];
  questions: Question[];
  featured?: boolean;
  todayOffer?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  shippingAddress: string;
  paymentMethod: 'pix' | 'cartao' | 'boleto';
  status: 'pagamento_pendente' | 'pago' | 'em_separacao' | 'em_transito' | 'entregue';
  estimatedDelivery: string;
  trackingSteps: {
    status: string;
    description: string;
    date: string;
    completed: boolean;
  }[];
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  role?: 'client' | 'manager';
  walletBalance: number;
  walletEarnings: number;
  tier: 'Básico' | 'Plus' | 'VIP Índigo';
  savedAddresses: string[];
  favoriteIds: string[];
}

export interface ManagerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'manager';
  permissions: string[];
  lastAccess: string;
}

export interface StoreAccount {
  id: string;
  role: 'client' | 'manager';
  name: string;
  email: string;
  avatar: string;
}

export interface AuthRecord extends StoreAccount {
  password: string;
  createdAt: string;
  savedAddresses?: string[];
}

export interface ManagerInsight {
  label: string;
  value: string;
  detail: string;
}

export interface StorePolicy {
  slug: 'terms' | 'privacy' | 'returns' | 'legal';
  title: string;
  updatedAt: string;
  sections: {
    heading: string;
    body: string;
  }[];
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  minSpend: number;
  description: string;
  expiresIn: string;
}

export interface AccessibilitySettings {
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  highContrast: boolean;
  voiceAssist: boolean;
  screenReaderHelp: boolean;
  letterSpacing: boolean; // For dyslexia/reading comfort
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  suggestedActions?: string[];
}
