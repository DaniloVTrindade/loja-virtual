import mysql from 'mysql2/promise';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

declare global {
  // eslint-disable-next-line no-var
  var __iwPool: mysql.Pool | undefined;
  // eslint-disable-next-line no-var
  var __iwReady: Promise<void> | undefined;
}

export const pool =
  globalThis.__iwPool ||
  mysql.createPool({
    uri: databaseUrl,
    connectionLimit: 5,
    namedPlaceholders: true,
    dateStrings: true
  });

globalThis.__iwPool = pool;

export async function query<T = any>(sql: string, params: any[] = []) {
  const [rows] = await pool.query<T[]>(sql, params);
  return rows;
}

export function json<T>(value: T) {
  return JSON.stringify(value ?? null);
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value as T;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

export function nowIso() {
  return new Date().toISOString();
}

