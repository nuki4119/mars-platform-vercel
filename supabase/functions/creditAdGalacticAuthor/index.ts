// supabase/functions/creditAdGalacticAuthor/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { boost_transaction_id } = await req.json()

  const { data: boostTx, error: boostError } = await supabase
    .from('boost_transactions')
    .select('*')
    .eq('id', boost_transaction_id)
    .single()

  if (boostError || !boostTx) {
    return new Response(JSON.stringify({ error: 'Boost transaction not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data: tierData, error: tierError } = await supabase
    .from('adgalactic_tiers')
    .select('total_earned, author_id, post_id, credited')
    .eq('boost_transaction_id', boost_transaction_id)
    .single()

  if (tierError || !tierData) {
    return new Response(JSON.stringify({ error: 'AdGalactic tier not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { total_earned, author_id, credited } = tierData

  if (credited) {
    return new Response(JSON.stringify({ message: 'Already credited' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (total_earned >= 1000) {
    const { error: walletError } = await supabase.rpc('credit_wallet', {
      user_id_input: author_id,
      amount_input: 1000,
      reason_input: 'AdGalactic Tier Completion'
    })

    if (walletError) {
      return new Response(JSON.stringify({ error: 'Failed to credit wallet' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await supabase
      .from('adgalactic_tiers')
      .update({ credited: true })
      .eq('boost_transaction_id', boost_transaction_id)

    return new Response(JSON.stringify({ message: 'Author credited successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ message: 'Not yet eligible for payout' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
