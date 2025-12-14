'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../supabase/client';
import Topbar from '../../components/Layout/Topbar';
import Link from 'next/link';

export default function WalletPage() {
  const user = useUser();
  const [wallet, setWallet] = useState({
    balance: 0,
    boost_credit_balance: 0,
    auto_boost_enabled: false,
  });

  useEffect(() => {
    async function fetchWallet() {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('wallets')
        .select('balance, boost_credit_balance, auto_boost_enabled')
        .eq('user_id', user.id)
        .single();

      if (data) setWallet(data);
    }
    fetchWallet();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <Topbar />
      <div className="max-w-4xl mx-auto mt-12 px-4 space-y-8">
        <h1 className="text-2xl font-bold">Wallet Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#121826] p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Boost Credit Balance</h2>
            <p className="text-3xl font-bold text-green-400">${wallet.boost_credit_balance.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-2">Use this balance to boost your posts.</p>
            <Link href="/wallet/topup">
              <button className="mt-4 px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-900/20">
                Add Credits
              </button>
            </Link>
          </div>

          <div className="bg-[#121826] p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Earnings Balance</h2>
            <p className="text-3xl font-bold text-red-400">${wallet.balance.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-2">This includes earnings from AdGalactic, Author, Affiliate, and more.</p>
            <Link href="/wallet/payouts">
              <button className="mt-4 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-900/20">
                Withdraw
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-[#121826] p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Auto Boosting</h2>
          <p className="text-sm text-gray-300">
            Status: <strong className={wallet.auto_boost_enabled ? 'text-green-500' : 'text-red-500'}>
              {wallet.auto_boost_enabled ? 'Enabled' : 'Disabled'}
            </strong>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Mars AI can boost your posts automatically based on your available boost credit balance.
          </p>
        </div>
      </div>
    </div>
  );
}
