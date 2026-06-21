import { AuthRecord, Order, Product, StoreAccount } from '../types';

const API_BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    ...init
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function loadBootstrap() {
  return request<{ products: Product[]; orders: Order[]; managers: StoreAccount[] }>('/bootstrap');
}

export async function loadSession(token: string) {
  return request<AuthRecord>('/session', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function loginAccount(email: string, password: string, role?: 'client' | 'manager') {
  return request<AuthRecord>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
}

export async function registerAccount(payload: {
  role: 'client' | 'manager';
  name: string;
  email: string;
  password: string;
  avatar: string;
  savedAddresses?: string[];
  managerId?: string;
}) {
  return request<AuthRecord>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function saveProduct(product: Product, token?: string) {
  return request<{ ok: boolean; product: Product }>('/products', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify({ product })
  });
}

export async function removeProduct(productId: string, token?: string) {
  return request<{ ok: boolean }>(`/products?id=${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
}

export async function saveOrder(order: Order, accountId?: string | null, token?: string) {
  return request<{ ok: boolean; order: Order }>('/orders', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify({ order, accountId })
  });
}
