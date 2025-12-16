import { createClient } from '../../supabase/server'; // ✅ correct relative path


export async function computeUserCRV(userId: string) {
  const supabase = await createClient(); // ✅ THIS IS THE FIX

  const { data, error } = await supabase.rpc('compute_user_crv', {
    input_user_id: userId,
  });

  if (error) throw error;
  return data;
}


