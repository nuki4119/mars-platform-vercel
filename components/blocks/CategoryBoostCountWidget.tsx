'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import MarsCard from '../ui/MarsCard';

interface CategoryBoostCount {
  category_symbol: string;
  boost_count: number;
}

export default function CategoryBoostCountWidget() {
  const [data, setData] = useState<CategoryBoostCount[]>([]);

  useEffect(() => {
    async function fetchBoosts() {
      const { data, error } = await supabase
        .from('category_boost_counts')
        .select('*');

      if (error) {
        console.error('Error fetching boost counts:', error);
      } else {
        setData(data);
      }
    }

    fetchBoosts();
  }, []);

  return (
    <MarsCard>
      <h2 className="text-white font-bold text-base mb-3">Category Boosts</h2>
      <ul className="space-y-2 text-sm">
        {data.map((item) => (
          <li key={item.category_symbol} className="flex justify-between text-slate-300">
            <span className="font-mono">{item.category_symbol}</span>
            <span className="text-marsRed font-semibold">{item.boost_count}</span>
          </li>
        ))}
      </ul>
    </MarsCard>
  );
}
