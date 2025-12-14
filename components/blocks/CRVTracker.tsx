// components/blocks/CRVTracker.tsx
'use client';

import { useEffect, useState } from 'react';

export default function CRVTracker({ userId }: { userId: string }) {
  const [totalCRV, setTotalCRV] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCRV = async () => {
      try {
        const res = await fetch(`/api/widgets/crv-tracker?userId=${userId}`);
        const data = await res.json();
        setTotalCRV(data.totalCRV || 0);
      } catch (err) {
        console.error('❌ Error loading CRV:', err);
        setTotalCRV(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCRV();
  }, [userId]);

  return (
    <div className="p-4 bg-slate-900 text-white border border-slate-800 rounded-xl">
      <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">CRV Balance</h3>
      <div className="text-3xl font-bold">
        {loading ? 'Loading…' : `${totalCRV.toFixed(2)} CRV`}
      </div>
      <p className="text-slate-400 text-xs mt-1">📈 Total Earned</p>
    </div>
  );
}
