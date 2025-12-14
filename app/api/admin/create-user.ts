// pages/api/admin/create-user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Make sure this is set in your environment
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, metadata } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata || {},
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'User created successfully', user: data.user });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
