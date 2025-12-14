'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import UniversalPageLayout from '@/components/Layout/UniversalPageLayout';

interface Referral {
  id: string;
  referred_email: string;
  created_at: string;
  joined: boolean;
}

export default function ReferralsPageContainer() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      const { data, error } = await supabase.from('referrals').select('*').order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching referrals:', error);
      } else {
        setReferrals(data as Referral[]);
      }
      setLoading(false);
    };

    fetchReferrals();
  }, []);

  const mainContent = (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">Your Referrals</h1>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : referrals.length === 0 ? (
        <p className="text-slate-400">No referrals yet.</p>
      ) : (
        <div className="overflow-x-auto border border-slate-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-slate-300">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id} className="border-t border-slate-700">
                  <td className="px-4 py-2">{ref.referred_email}</td>
                  <td className="px-4 py-2">
                    {ref.joined ? <span className="text-green-400">Joined ✅</span> : <span className="text-yellow-400">Pending</span>}
                  </td>
                  <td className="px-4 py-2">{new Date(ref.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} />;
}
