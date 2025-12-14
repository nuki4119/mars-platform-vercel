'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../../hooks/useUser';
import { supabase } from '../../../supabase/client';
import Topbar from '../../../components/Layout/Topbar';

export default function Page() {
  const user = useUser();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchWallet() {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (data) setBalance(data.balance || 0);
    }
    fetchWallet();
  }, [user]);

  const handleWithdraw = async () => {
    setLoading(true);
    setMessage('');

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0 || transferAmount > balance) {
      setMessage('Invalid transfer amount.');
      setLoading(false);
      return;
    }

    const newBalance = balance - transferAmount;

    const { error } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', user?.id);

    if (error) {
      setMessage('Failed to process transfer.');
    } else {
      setMessage(`$${transferAmount.toFixed(2)} scheduled for transfer.`);
      setBalance(newBalance);
      setAmount('');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <Topbar />
      <div className="max-w-xl mx-auto mt-12 px-4">
        <h1 className="text-2xl font-bold mb-4">Wire Transfer Form</h1>

        <div className="bg-[#121826] p-6 rounded-lg border border-gray-700 space-y-4">
          <p className="text-sm text-gray-300">Available balance for transfer: <strong>${balance.toFixed(2)}</strong></p>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Transfer amount</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-md bg-[#1a2131] text-white border border-gray-600 focus:outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$50"
            />
          </div>

          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="px-5 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-900/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit transfer request'}
          </button>

          {message && <div className="text-sm text-gray-300 mt-2">{message}</div>}

          <p className="text-xs text-gray-400 pt-4">
            This form will integrate with Stripe or wire transfer services. Funds will be deducted from your main earnings balance.
          </p>
        </div>
      </div>
    </div>
  );
}