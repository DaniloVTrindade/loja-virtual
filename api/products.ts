import type { VercelRequest, VercelResponse } from '@vercel/node';
import { deleteProduct, listProducts, resolveSession, upsertProduct } from './_lib/store';
import { Product } from '../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const products = await listProducts();
      return res.status(200).json({ products });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
      const session = await resolveSession(token);
      if (!session || session.role !== 'manager') {
        return res.status(401).json({ error: 'manager auth required' });
      }
      const product = req.body?.product as Product | undefined;
      if (!product) return res.status(400).json({ error: 'product is required' });
      await upsertProduct(product);
      return res.status(200).json({ ok: true, product });
    }

    if (req.method === 'DELETE') {
      const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
      const session = await resolveSession(token);
      if (!session || session.role !== 'manager') {
        return res.status(401).json({ error: 'manager auth required' });
      }
      const productId = String(req.query.id || req.body?.productId || '');
      if (!productId) return res.status(400).json({ error: 'productId is required' });
      await deleteProduct(productId);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'products failed' });
  }
}
