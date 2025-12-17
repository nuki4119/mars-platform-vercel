import { createClient } from '../../supabase/server';

export async function computeUserCRV(userId: string): Promise<number> {
  const supabase = await createClient(); // ✅ must await the client

  const { data, error } = await supabase.rpc('compute_user_crv', {
    input_user_id: userId,
  });

  if (error) {
    console.error('Failed to compute CRV:', error);
    return 0;
  }

  return data || 0;
}
