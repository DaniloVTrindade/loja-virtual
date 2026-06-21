import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSessionAccount } from './_lib/store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    const account = await getSessionAccount(token);
    if (!account) {
      return res.status(401).json({ error: 'session not found' });
    }
    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'session failed' });
  }
}
