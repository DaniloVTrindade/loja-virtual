import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createOrder, listOrders, resolveSession } from './_lib/store';
import { Order } from '../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const orders = await listOrders();
      return res.status(200).json({ orders });
    }

    if (req.method === 'POST') {
      const order = req.body?.order as Order | undefined;
      if (!order) return res.status(400).json({ error: 'order is required' });
      const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
      const session = await resolveSession(token);
      await createOrder(order, req.body?.accountId ?? session?.account_id ?? null);
      return res.status(200).json({ ok: true, order });
    }

    res.setHeader('Allow', 'GET,POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'orders failed' });
  }
}
