import type { VercelRequest, VercelResponse } from '@vercel/node';
import { bootstrapStore, getManagerProfiles } from './_lib/store';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const state = await bootstrapStore();
    const managers = await getManagerProfiles();
    res.status(200).json({
      products: state.products,
      orders: state.orders,
      managers
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'bootstrap failed' });
  }
}

