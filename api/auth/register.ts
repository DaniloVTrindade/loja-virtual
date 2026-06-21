import type { VercelRequest, VercelResponse } from '@vercel/node';
import { registerAccount } from '../_lib/store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { role, name, email, password, avatar, savedAddresses, managerId } = req.body || {};
    const account = await registerAccount({
      role,
      name,
      email,
      password,
      avatar,
      savedAddresses,
      managerId
    });
    return res.status(201).json(account);
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'register failed' });
  }
}

