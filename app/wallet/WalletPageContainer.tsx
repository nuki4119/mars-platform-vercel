'use client';

import React, { useEffect, useState } from 'react';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import WalletOverview from '../../components/blocks/WalletOverview';
import { Banknote, Upload, Download } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'credit' | 'boost' | 'affiliate' | 'payout';
  amount: number;
  description: string;
  created_at: string;
}

export default function WalletPageContainer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    // ✅ Mock data - Replace with Supabase call later
    setTransactions([
      {
        id: 'txn1',
        type: 'credit',
        amount: 18.75,
        description: 'CRV earned from post',
        created_at: '2025-12-07',
      },
      {
        id: 'txn2',
        type: 'boost',
        amount: -4.50,
        description: 'Boosted @user123',
        created_at: '2025-12-06',
      },
      {
        id: 'txn3',
        type: 'affiliate',
        amount: 50,
        description: 'Affiliate payout from @creatorhub',
        created_at: '2025-12-06',
      },
    ]);
  }, []);

  const mainContent = (
    <div className="p-4 space-y-8 text-white">
      <h1 className="text-2xl font-bold">Your Wallet</h1>

      {/* Wallet Summary Widget */}
      <WalletOverview />

      {/* Transfer Actions (Coming Soon) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-marsRed hover:bg-marsRedDark text-white rounded-lg shadow">
          <Upload size={18} /> Add Credit (Boosts)
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shadow">
          <Download size={18} /> Request Payout (Earnings)
        </button>
      </div>

      {/* Full Transaction History */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-3">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          {transactions.map((txn) => (
            <li key={txn.id} className="border-b border-slate-700 pb-2">
              <div className="flex justify-between">
                <span>{txn.description}</span>
                <span className={txn.amount >= 0 ? 'text-green-400' : 'text-pink-400'}>
                  {txn.amount >= 0 ? '+' : ''}${txn.amount.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-slate-500">{txn.created_at}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="p-4 text-sm text-slate-400 space-y-4">
      <div>
        <Banknote className="text-green-400 inline mr-1" />
        <strong>Financial Info:</strong> Withdrawals are processed manually. KYC required for payouts.
      </div>
      <div>
        🚀 Soon: Stripe integrations and bank transfer support.
      </div>
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} sidebarContent={sidebarContent} />;
}
