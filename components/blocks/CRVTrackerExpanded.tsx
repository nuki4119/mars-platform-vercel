// components/blocks/CRVTrackerExpanded.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Bot } from 'lucide-react';

export default function CRVTrackerExpanded({ userId }: { userId: string }) {
  const [totalCRV, setTotalCRV] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchCRV = async () => {
      try {
        const res = await fetch(`/api/widgets/crv-tracker?userId=${userId}`);
        const data = await res.json();
        setTotalCRV(data.totalCRV || 0);
      } catch (err) {
        console.error('❌ Failed to load CRV:', err);
        setTotalCRV(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCRV();
  }, [userId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('🔗 Link copied to clipboard');
  };

  const handleAI = () => {
    router.push('/assistant');
  };

  return (
    <div className="w-full flex items-center justify-between text-white px-2 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-base font-bold">
          {loading ? 'Loading…' : `${totalCRV.toFixed(2)} CRV`}
        </span>
        <span className="text-xs text-slate-400">📈 Total Earned</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleShare} className="hover:text-white text-slate-400" title="Copy share link">
          <Share2 className="w-5 h-5" />
        </button>
        <button onClick={handleAI} className="hover:text-white text-slate-400" title="Ask Mars AI">
          <Bot className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
