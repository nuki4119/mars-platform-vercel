import { createClient } from '../../supabase/server'; // ✅ relative to your file


export async function computeUserCRV(userId: string): Promise<number> {
  const supabase = createClient(); // ✅ use your existing server-side instance

  const { data, error } = await supabase.rpc('compute_user_crv', {
    input_user_id: userId,
  });

  if (error || !data) {
    console.error('❌ Error computing CRV:', error);
    return 0;
  }

  return data as number;
}
