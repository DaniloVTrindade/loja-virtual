import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loginAccount } from '../_lib/store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, role } = req.body || {};
    const account = await loginAccount({ email, password, role });
    return res.status(200).json(account);
  } catch (error) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
}
