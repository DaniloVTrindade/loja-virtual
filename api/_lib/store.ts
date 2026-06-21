import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { MANAGERS, MOCK_ORDERS, MOCK_PRODUCTS } from '../../src/data/mockData';
import { AuthRecord, Order, Product, StoreAccount } from '../../src/types';
import { json, nowIso, parseJson, query } from './db';

type ClientRow = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password_hash: string;
  saved_addresses: string | null;
  wallet_balance: string;
  wallet_earnings: string;
  tier: string;
  favorite_ids: string | null;
  created_at: string;
  updated_at: string;
};

type ManagerRow = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password_hash: string | null;
  permissions: string | null;
  last_access: string | null;
  created_at: string;
  updated_at: string;
};

type ProductRow = {
  id: string;
  title: string;
  price: string;
  original_price: string | null;
  installments_count: number;
  installments_amount: string;
  installments_interest_free: number;
  free_shipping: number;
  full_delivery: number;
  category: string;
  brand: string;
  condition: string;
  stock: number;
  rating: string;
  reviews_count: number;
  images: string | null;
  description: string;
  attributes: string | null;
  seller: string | null;
  reviews: string | null;
  questions: string | null;
  featured: number;
  today_offer: number;
  created_at: string;
  updated_at: string;
};

type OrderRow = {
  id: string;
  account_id: string | null;
  date: string;
  items: string | null;
  total: string;
  shipping_address: string;
  payment_method: 'pix' | 'cartao' | 'boleto';
  status: Order['status'];
  estimated_delivery: string;
  tracking_steps: string | null;
  created_at: string;
  updated_at: string;
};

type SessionRow = {
  token: string;
  role: 'client' | 'manager';
  account_id: string;
  created_at: string;
};

let ensured: Promise<void> | null = null;

function productToRow(product: Product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    original_price: product.originalPrice ?? null,
    installments_count: product.installments.count,
    installments_amount: product.installments.amount,
    installments_interest_free: product.installments.interestFree ? 1 : 0,
    free_shipping: product.freeShipping ? 1 : 0,
    full_delivery: product.fullDelivery ? 1 : 0,
    category: product.category,
    brand: product.brand,
    condition: product.condition,
    stock: product.stock,
    rating: product.rating,
    reviews_count: product.reviewsCount,
    images: json(product.images),
    description: product.description,
    attributes: json(product.attributes),
    seller: json(product.seller),
    reviews: json(product.reviews),
    questions: json(product.questions),
    featured: product.featured ? 1 : 0,
    today_offer: product.todayOffer ? 1 : 0,
    created_at: nowIso(),
    updated_at: nowIso()
  };
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    installments: {
      count: row.installments_count,
      amount: Number(row.installments_amount),
      interestFree: Boolean(row.installments_interest_free)
    },
    freeShipping: Boolean(row.free_shipping),
    fullDelivery: Boolean(row.full_delivery),
    category: row.category,
    brand: row.brand,
    condition: row.condition as 'novo' | 'usado',
    stock: row.stock,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    images: parseJson<string[]>(row.images, []),
    description: row.description,
    attributes: parseJson<Record<string, string>>(row.attributes, {}),
    seller: parseJson<Product['seller']>(row.seller, {
      id: 'indigo-white',
      name: 'Indigo White Oficial',
      reputation: 'excelente',
      salesCount: 0,
      rating: 5,
      location: 'Sao Paulo, SP'
    }),
    reviews: parseJson<Product['reviews']>(row.reviews, []),
    questions: parseJson<Product['questions']>(row.questions, []),
    featured: Boolean(row.featured),
    todayOffer: Boolean(row.today_offer)
  };
}

function rowToClient(row: ClientRow): AuthRecord {
  return {
    id: row.id,
    role: 'client',
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    password: '',
    createdAt: row.created_at,
    savedAddresses: parseJson<string[]>(row.saved_addresses, [])
  };
}

function rowToManager(row: ManagerRow): AuthRecord {
  return {
    id: row.id,
    role: 'manager',
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    password: '',
    createdAt: row.created_at
  };
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    date: row.date,
    items: parseJson<Order['items']>(row.items, []),
    total: Number(row.total),
    shippingAddress: row.shipping_address,
    paymentMethod: row.payment_method,
    status: row.status,
    estimatedDelivery: row.estimated_delivery,
    trackingSteps: parseJson<Order['trackingSteps']>(row.tracking_steps, [])
  };
}

async function createSession(accountId: string, role: 'client' | 'manager') {
  const token = crypto.randomUUID();
  await query('INSERT INTO sessions (token, role, account_id, created_at) VALUES (?, ?, ?, ?)', [token, role, accountId, nowIso()]);
  return token;
}

export async function resolveSession(token?: string | null) {
  await ensureSchema();
  if (!token) return null;
  const rows = await query<SessionRow>('SELECT * FROM sessions WHERE token = ? LIMIT 1', [token]);
  return (rows as SessionRow[])[0] || null;
}

async function ensureSchema() {
  if (!ensured) {
    ensured = (async () => {
      await query(`
        CREATE TABLE IF NOT EXISTS clients (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          avatar TEXT NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          saved_addresses JSON NULL,
          wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
          wallet_earnings DECIMAL(12,2) NOT NULL DEFAULT 0,
          tier VARCHAR(64) NOT NULL DEFAULT 'Básico',
          favorite_ids JSON NULL,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS managers (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          avatar TEXT NOT NULL,
          password_hash VARCHAR(255) NULL,
          permissions JSON NULL,
          last_access VARCHAR(64) NULL,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(64) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          price DECIMAL(12,2) NOT NULL,
          original_price DECIMAL(12,2) NULL,
          installments_count INT NOT NULL,
          installments_amount DECIMAL(12,2) NOT NULL,
          installments_interest_free TINYINT(1) NOT NULL DEFAULT 1,
          free_shipping TINYINT(1) NOT NULL DEFAULT 0,
          full_delivery TINYINT(1) NOT NULL DEFAULT 0,
          category VARCHAR(64) NOT NULL,
          brand VARCHAR(128) NOT NULL,
          `condition` VARCHAR(32) NOT NULL,
          stock INT NOT NULL DEFAULT 0,
          rating DECIMAL(3,1) NOT NULL DEFAULT 0,
          reviews_count INT NOT NULL DEFAULT 0,
          images JSON NOT NULL,
          description TEXT NOT NULL,
          attributes JSON NOT NULL,
          seller JSON NOT NULL,
          reviews JSON NOT NULL,
          questions JSON NOT NULL,
          featured TINYINT(1) NOT NULL DEFAULT 0,
          today_offer TINYINT(1) NOT NULL DEFAULT 0,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(64) PRIMARY KEY,
          account_id VARCHAR(64) NULL,
          date VARCHAR(64) NOT NULL,
          items JSON NOT NULL,
          total DECIMAL(12,2) NOT NULL,
          shipping_address TEXT NOT NULL,
          payment_method VARCHAR(16) NOT NULL,
          status VARCHAR(32) NOT NULL,
          estimated_delivery VARCHAR(64) NOT NULL,
          tracking_steps JSON NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS sessions (
          token VARCHAR(64) PRIMARY KEY,
          role VARCHAR(16) NOT NULL,
          account_id VARCHAR(64) NOT NULL,
          created_at DATETIME NOT NULL
        )
      `);

      const managers = await query<ManagerRow>('SELECT * FROM managers');
      if ((managers as ManagerRow[]).length === 0) {
        const now = nowIso();
        for (const manager of MANAGERS) {
          await query(
            `INSERT INTO managers (id, name, email, avatar, password_hash, permissions, last_access, created_at, updated_at)
             VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?)`,
            [manager.id, manager.name, manager.email, manager.avatar, json(manager.permissions), manager.lastAccess, now, now]
          );
        }
      }

      const products = await query<ProductRow>('SELECT * FROM products');
      if ((products as ProductRow[]).length === 0) {
        for (const product of MOCK_PRODUCTS) {
          const row = productToRow(product);
          await query(
            `INSERT INTO products
              (id, title, price, original_price, installments_count, installments_amount, installments_interest_free, free_shipping, full_delivery,
               category, brand, \`condition\`, stock, rating, reviews_count, images, description, attributes, seller, reviews, questions,
               featured, today_offer, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              row.id, row.title, row.price, row.original_price, row.installments_count, row.installments_amount,
              row.installments_interest_free, row.free_shipping, row.full_delivery, row.category, row.brand, row.condition,
              row.stock, row.rating, row.reviews_count, row.images, row.description, row.attributes, row.seller,
              row.reviews, row.questions, row.featured, row.today_offer, row.created_at, row.updated_at
            ]
          );
        }
      }

      const orders = await query<OrderRow>('SELECT * FROM orders');
      if ((orders as OrderRow[]).length === 0) {
        for (const order of MOCK_ORDERS) {
          await query(
            `INSERT INTO orders
              (id, account_id, date, items, total, shipping_address, payment_method, status, estimated_delivery, tracking_steps, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              order.id,
              null,
              order.date,
              json(order.items),
              order.total,
              order.shippingAddress,
              order.paymentMethod,
              order.status,
              order.estimatedDelivery,
              json(order.trackingSteps),
              nowIso(),
              nowIso()
            ]
          );
        }
      }
    })();
  }

  return ensured;
}

export async function bootstrapStore() {
  await ensureSchema();

  const [products, orders, clients, managers] = await Promise.all([
    query<ProductRow>('SELECT * FROM products ORDER BY created_at DESC'),
    query<OrderRow>('SELECT * FROM orders ORDER BY created_at DESC'),
    query<ClientRow>('SELECT * FROM clients ORDER BY created_at DESC'),
    query<ManagerRow>('SELECT * FROM managers ORDER BY created_at DESC')
  ]);

  return {
    products: (products as ProductRow[]).map(rowToProduct),
    orders: (orders as OrderRow[]).map(rowToOrder),
    clients: (clients as ClientRow[]).map(rowToClient),
    managers: (managers as ManagerRow[]).map(rowToManager)
  };
}

export async function registerAccount(input: {
  role: 'client' | 'manager';
  name: string;
  email: string;
  avatar: string;
  password: string;
  savedAddresses?: string[];
  managerId?: string;
}) {
  await ensureSchema();

  const passwordHash = await bcrypt.hash(input.password, 10);
  const now = nowIso();

  if (input.role === 'client') {
    const id = `client-${crypto.randomUUID()}`;
    await query(
      `INSERT INTO clients
        (id, name, email, avatar, password_hash, saved_addresses, wallet_balance, wallet_earnings, tier, favorite_ids, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0, 'Básico', ?, ?, ?)`,
      [id, input.name, input.email, input.avatar, passwordHash, json(input.savedAddresses ?? []), json([]), now, now]
    );
    return { id, role: 'client' as const, name: input.name, email: input.email, avatar: input.avatar, token: await createSession(id, 'client') };
  }

  if (!input.managerId) throw new Error('managerId is required for manager registration');
  await query(
    `UPDATE managers
     SET name = ?, email = ?, avatar = ?, password_hash = ?, updated_at = ?
     WHERE id = ?`,
    [input.name, input.email, input.avatar, passwordHash, now, input.managerId]
  );

  return { id: input.managerId, role: 'manager' as const, name: input.name, email: input.email, avatar: input.avatar, token: await createSession(input.managerId, 'manager') };
}

export async function loginAccount(input: { email: string; password: string; role?: 'client' | 'manager' }) {
  await ensureSchema();

  if (!input.role || input.role === 'client') {
    const clientRows = await query<ClientRow>('SELECT * FROM clients WHERE email = ? LIMIT 1', [input.email]);
    if ((clientRows as ClientRow[]).length > 0) {
      const client = (clientRows as ClientRow[])[0];
      const ok = await bcrypt.compare(input.password, client.password_hash);
      if (ok) {
        return { id: client.id, role: 'client' as const, name: client.name, email: client.email, avatar: client.avatar, token: await createSession(client.id, 'client') };
      }
    }
  }

  if (!input.role || input.role === 'manager') {
    const managerRows = await query<ManagerRow>('SELECT * FROM managers WHERE email = ? LIMIT 1', [input.email]);
    if ((managerRows as ManagerRow[]).length > 0) {
      const manager = (managerRows as ManagerRow[])[0];
      if (manager.password_hash) {
        const ok = await bcrypt.compare(input.password, manager.password_hash);
        if (ok) {
          return { id: manager.id, role: 'manager' as const, name: manager.name, email: manager.email, avatar: manager.avatar, token: await createSession(manager.id, 'manager') };
        }
      }
    }
  }

  throw new Error('invalid credentials');
}

export async function listProducts() {
  await ensureSchema();
  const rows = await query<ProductRow>('SELECT * FROM products ORDER BY created_at DESC');
  return (rows as ProductRow[]).map(rowToProduct);
}

export async function upsertProduct(product: Product) {
  await ensureSchema();
  const now = nowIso();
  const row = productToRow(product);
  await query(
    `INSERT INTO products
      (id, title, price, original_price, installments_count, installments_amount, installments_interest_free, free_shipping, full_delivery,
       category, brand, \`condition\`, stock, rating, reviews_count, images, description, attributes, seller, reviews, questions,
       featured, today_offer, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       price = VALUES(price),
       original_price = VALUES(original_price),
       installments_count = VALUES(installments_count),
       installments_amount = VALUES(installments_amount),
       installments_interest_free = VALUES(installments_interest_free),
       free_shipping = VALUES(free_shipping),
       full_delivery = VALUES(full_delivery),
       category = VALUES(category),
       brand = VALUES(brand),
       \`condition\` = VALUES(\`condition\`),
       stock = VALUES(stock),
       rating = VALUES(rating),
       reviews_count = VALUES(reviews_count),
       images = VALUES(images),
       description = VALUES(description),
       attributes = VALUES(attributes),
       seller = VALUES(seller),
       reviews = VALUES(reviews),
       questions = VALUES(questions),
       featured = VALUES(featured),
       today_offer = VALUES(today_offer),
       updated_at = VALUES(updated_at)`,
    [
      row.id, row.title, row.price, row.original_price, row.installments_count, row.installments_amount,
      row.installments_interest_free, row.free_shipping, row.full_delivery, row.category, row.brand, row.condition,
      row.stock, row.rating, row.reviews_count, row.images, row.description, row.attributes, row.seller,
      row.reviews, row.questions, row.featured, row.today_offer, now, now
    ]
  );
  return product;
}

export async function deleteProduct(productId: string) {
  await ensureSchema();
  await query('DELETE FROM products WHERE id = ?', [productId]);
}

export async function createOrder(order: Order, accountId?: string | null) {
  await ensureSchema();
  await query(
    `INSERT INTO orders
      (id, account_id, date, items, total, shipping_address, payment_method, status, estimated_delivery, tracking_steps, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.id,
      accountId || null,
      order.date,
      json(order.items),
      order.total,
      order.shippingAddress,
      order.paymentMethod,
      order.status,
      order.estimatedDelivery,
      json(order.trackingSteps),
      nowIso(),
      nowIso()
    ]
  );
  return order;
}

export async function listOrders() {
  await ensureSchema();
  const rows = await query<OrderRow>('SELECT * FROM orders ORDER BY created_at DESC');
  return (rows as OrderRow[]).map(rowToOrder);
}

export async function getManagerProfiles() {
  const state = await bootstrapStore();
  return state.managers.map((manager) => ({
    id: manager.id,
    name: manager.name,
    email: manager.email,
    avatar: manager.avatar,
    role: manager.role,
    permissions: ['dashboard', 'products', 'orders', 'prices', 'policies', 'ai'],
    lastAccess: 'Agora'
  }));
}
