import { createClient } from '../../supabase/server';

export async function computeUserCRV(userId: string): Promise<number> {
  const supabase = await createClient(); // ✅ REQUIRED

  const { data, error } = await supabase.rpc('compute_user_crv', {
    input_user_id: userId,
  });

  if (error) throw error;
  return data;
}
