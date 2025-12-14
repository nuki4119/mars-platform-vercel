'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabase/client'; // ✅ CORRECT
import Image from 'next/image';

export default function BoostPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [agreed, setAgreed] = useState(false);

  const totalCost = 110; // $100 boost + $10 service

  useEffect(() => {
    const fetchData = async () => {
      const { data: postData } = await supabase
        .from('buzz_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      setPost(postData);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: walletData, error: walletError } = await supabase
  .from('wallets')
  .select('*')
  .eq('user_id', user.id)
  .limit(1); // ✅ LIMIT the result to avoid multiple rows


        if (walletError) {
  console.error('Wallet error:', walletError.message);
} else if (walletData && walletData.length > 0) {
  setWallet(walletData[0]); // ✅ Access the first wallet
} else {
  console.warn('No wallet found for user.');
}

      }
    };

    fetchData();
  }, [slug]);

  const handleBoost = async () => {
    if (!wallet || wallet.boost_credit_balance < totalCost) {
      return setMessage('🚫 Insufficient balance to boost.');
    }

    if (!agreed) {
      return setMessage('⚠️ You must agree to the transaction terms.');
    }

    const { error } = await supabase.rpc('manualBoostWithCRV', {
      post_id_input: post.id,
      boost_amount_input: 100,
    });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Boost successful!');
    }
  };

  if (!post) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto text-white space-y-6">
      <h1 className="text-2xl font-bold">🚀 Confirm Boost</h1>

      <div className="border border-slate-600 rounded-lg p-4 space-y-3 bg-slate-900">
        {post.media_url && (
          <Image
            src={post.media_url}
            alt={post.title}
            width={600}
            height={300}
            className="rounded-lg"
            unoptimized
          />
        )}

        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="text-sm text-slate-400">
          Category: <span className="font-mono">{post.category_symbol}</span>
        </p>

        <div className="text-sm text-orange-400 mt-2 border-t border-slate-700 pt-3">
          ⚠️ A boost costs <strong>$100</strong> + <strong>$10</strong> service fee.
        </div>

        <div className="mt-4">
          <label className="text-sm block mb-1">Boost Amount</label>
          <input
            type="number"
            disabled
            value={totalCost}
            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-600 text-white"
          />
        </div>

        <div className="flex items-start gap-2 mt-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <label className="text-sm text-slate-300">
            I understand this transaction will deduct <strong>$110</strong> in credits from my balance.
          </label>
        </div>

        <button
          onClick={handleBoost}
          disabled={!agreed}
          className={`w-full mt-4 py-2 rounded-xl text-sm font-semibold transition ${
            agreed
              ? 'bg-orange-500 hover:bg-orange-600 text-black'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          🚀 Boost this Post
        </button>

        {message && <p className="text-sm mt-3 text-red-400">{message}</p>}
      </div>
    </div>
  );
}
