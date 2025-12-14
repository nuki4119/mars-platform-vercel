// supabase/functions/adGalacticAuthorPayout/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { postId, transactionId } = await req.json();

  if (!postId || !transactionId) {
    return new Response(JSON.stringify({ error: 'Missing postId or transactionId' }), { status: 400 });
  }

  const { data: transactions, error: txError } = await supabase
    .from('boost_transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (txError || !transactions) {
    return new Response(JSON.stringify({ error: 'Transaction not found' }), { status: 404 });
  }

  const { author_id, post_total_earned } = transactions;

  if (post_total_earned < 1000) {
    return new Response(JSON.stringify({ message: 'Cap not reached. No payout.' }), { status: 200 });
  }

  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', author_id)
    .single();

  if (walletError || !wallet) {
    return new Response(JSON.stringify({ error: 'Wallet not found' }), { status: 404 });
  }

  const updatedBalance = wallet.balance + 1000;

  const { error: updateError } = await supabase
    .from('wallets')
    .update({ balance: updatedBalance })
    .eq('user_id', author_id);

  if (updateError) {
    return new Response(JSON.stringify({ error: 'Failed to credit wallet' }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Author credited with $1000 after cap reached.' }), { status: 200 });
});