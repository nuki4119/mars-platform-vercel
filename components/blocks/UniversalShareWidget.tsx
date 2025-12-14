// ✅ UniversalShareWidget.tsx — Single Source of Truth for Sharing

'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function UniversalShareWidget({ url, size = 20 }: { url: string; size?: number }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Check this out', url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      title={copied ? 'Copied!' : 'Share'}
      className={`text-slate-400 hover:text-white transition ${copied ? 'text-green-400' : ''}`}
    >
      {copied ? <Check size={size} /> : <Share2 size={size} />}
    </button>
  );
}
