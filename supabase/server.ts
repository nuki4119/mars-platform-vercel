// supabase/server.ts

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies, // ✅ Don't call it! Just pass the reference
    }
  );
}


