'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import { Zap, Banknote, Rocket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WalletSummary {
  boost_credit: number;
  earned_credit: number;
  recent_transactions: {
    id: string;
    type: 'boost' | 'credit';
    amount: number;
    description: string;
    created_at: string;
  }[];
}

export default function DashboardPageContainer() {
  const [wallet, setWallet] = useState<WalletSummary>({
    boost_credit: 50,
    earned_credit: 72.45,
    recent_transactions: [
      {
        id: 'txn1',
        type: 'credit',
        amount: 12.00,
        description: 'CRV reward from boosted post',
        created_at: '2025-12-07',
      },
      {
        id: 'txn2',
        type: 'boost',
        amount: -5.00,
        description: 'Boosted @diy_crafts',
        created_at: '2025-12-07',
      },
      {
        id: 'txn3',
        type: 'credit',
        amount: 60.45,
        description: 'Affiliate payout',
        created_at: '2025-12-06',
      },
    ],
  });

  const mainContent = (
    <div className="p-4 space-y-8 text-white">
      <h1 className="text-2xl font-bold">Welcome back to your Dashboard</h1>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Boost Credit */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm uppercase tracking-wider text-slate-400">Boost Credit</span>
            <Rocket className="text-pink-400" size={20} />
          </div>
          <div className="text-3xl font-bold">{wallet.boost_credit.toFixed(2)} CRV</div>
          <p className="text-sm text-slate-400">Balance available for boosting content.</p>
        </div>

        {/* Earned Credit */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm uppercase tracking-wider text-slate-400">Earned Credit</span>
            <Banknote className="text-green-400" size={20} />
          </div>
          <div className="text-3xl font-bold">${wallet.earned_credit.toFixed(2)}</div>
          <p className="text-sm text-slate-400">Credit eligible for transfer to bank.</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Link href="/wallet" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          {wallet.recent_transactions.map((txn) => (
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

      {/* Mars AI Launch */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-wider text-slate-400">Mars AI Assistant</span>
          <Zap className="text-yellow-400" size={20} />
        </div>
        <p className="text-slate-300">Ask Mars AI to create content, analyze your reach, or summarize buzz.</p>
        <Link href="/assistant">
          <button className="mt-2 px-4 py-2 bg-marsRed hover:bg-marsRedDark text-white rounded-lg text-sm">
            ⚡ Launch Mars AI
          </button>
        </Link>
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="p-4 space-y-4 text-sm text-slate-400">
      <p>This sidebar is reserved for future widgets like:</p>
      <ul className="list-disc list-inside">
        <li>AI-powered CRV Forecasts</li>
        <li>Referral Program Progress</li>
        <li>Mission Goal Tracker</li>
      </ul>
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} sidebarContent={sidebarContent} />;
}
