// supabase/server.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type Database } from './types/supabase'; // Optional: if you have typed DB schema

export function createClient() {
  return createServerComponentClient<Database>({
    cookies,
  });
}


