import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export async function createClient() {
  const cookieStore = await cookies(); // ✅ Now works because it's imported

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => cookieStore.get(key)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
}
