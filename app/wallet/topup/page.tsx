'use client';

import { useState } from 'react';
import { useUser } from '../../../hooks/useUser';
import { supabase } from '../../../supabase/client';
import Topbar from '../../../components/Layout/Topbar';

export default function Page() {
  const user = useUser();
  const [amount, setAmount] = useState('');
  const [autoBoost, setAutoBoost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTopUp = async () => {
    setLoading(true);
    setMessage('');

    const creditAmount = parseFloat(amount);
    if (!creditAmount || creditAmount <= 0) {
      setMessage('Please enter a valid credit amount.');
      setLoading(false);
      return;
    }

    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('boost_credit_balance')
      .eq('user_id', user?.id)
      .single();

    if (error || !wallet) {
      setMessage('Wallet not found.');
      setLoading(false);
      return;
    }

    const newBalance = wallet.boost_credit_balance + creditAmount;

    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        boost_credit_balance: newBalance,
        auto_boost_enabled: autoBoost,
        last_topup_at: new Date().toISOString(),
      })
      .eq('user_id', user?.id);

    if (updateError) {
      setMessage('Failed to update wallet.');
    } else {
      setMessage(`Successfully added $${creditAmount.toFixed(2)} to your Boost Credit Balance.`);
      setAmount('');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <Topbar />
      <div className="max-w-xl mx-auto mt-12 px-4">
        <h1 className="text-2xl font-bold mb-4">Pay as you go</h1>

        <div className="bg-[#121826] p-6 rounded-lg border border-gray-700 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Credit amount</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-2 rounded-md bg-[#1a2131] text-white border border-gray-600 focus:outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$100"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoBoost}
              onChange={() => setAutoBoost(!autoBoost)}
              className="accent-red-600"
            />
            <span className="text-sm">Enable Mars AI Daily Auto Boosting</span>
          </div>

          <button
            onClick={handleTopUp}
            disabled={loading}
            className="px-5 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-900/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Add to credit balance'}
          </button>

          {message && <div className="text-sm text-gray-300 mt-2">{message}</div>}

          <p className="text-xs text-gray-400 pt-4">
            When your credit balance reaches $0, your daily auto boosting will stop working.
          </p>
        </div>
      </div>
    </div>
  );
}