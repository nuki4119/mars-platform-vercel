// supabase/server.ts

import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies as getCookies } from 'next/headers';

export function createClient() {
  const cookieStore = getCookies(); // ✅ get the actual cookie store object

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => cookieStore.get(key)?.value,
        set: () => {}, // noop for now (needed by type)
        remove: () => {}, // noop for now (needed by type)
      },
    }
  );
}


