'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../supabase/client';

interface Category {
  symbol: string;
  name: string;
  group: string;
  description: string;
  crv_value: number;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [boostCounts, setBoostCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*');

      if (catError) {
        console.error('❌ Error loading categories:', catError.message);
      } else {
        setCategories(catData as Category[]);
      }

      const { data: boostData, error: boostError } = await supabase
        .from('category_boost_counts')
        .select('*');

      if (boostError) {
        console.error('❌ Error loading boost counts:', boostError.message);
      } else {
        const map: Record<string, number> = {};
        boostData.forEach((b) => {
          map[b.category_symbol] = b.boost_count;
        });
        setBoostCounts(map);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mars AI Engine Categories</h2>

      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-400 inline-block"></span>
          <span className="text-slate-300">High CRV (≥ 0.75)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block"></span>
          <span className="text-slate-300">Medium CRV (0.40–0.74)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-400 inline-block"></span>
          <span className="text-slate-300">Low CRV (&lt; 0.40)</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-slate-700 text-sm">
          <thead>
            <tr className="bg-slate-800 text-left">
              <th className="border border-slate-600 p-2">Symbol</th>
              <th className="border border-slate-600 p-2">Name</th>
              <th className="border border-slate-600 p-2">Group</th>
              <th className="border border-slate-600 p-2">CRV Value</th>
              <th className="border border-slate-600 p-2">Boosts</th>
              <th className="border border-slate-600 p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  Loading categories…
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.symbol} className="hover:bg-slate-800 transition">
                  <td className="border border-slate-700 px-2 py-2 font-mono">
                    <Link href={`/clusters?category=${cat.symbol}`}>
                      <span className="text-blue-400 hover:underline cursor-pointer">
                        {cat.symbol}
                      </span>
                    </Link>
                  </td>
                  <td className="border border-slate-700 px-2 py-2">{cat.name}</td>
                  <td className="border border-slate-700 px-2 py-2">{cat.group}</td>
                  <td
                    className={`border border-slate-700 px-2 py-2 text-right font-semibold ${
                      cat.crv_value >= 0.75
                        ? 'text-green-400'
                        : cat.crv_value >= 0.4
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {cat.crv_value?.toFixed(2) ?? '0.00'}
                  </td>
                  <td className="border border-slate-700 px-2 py-2 text-right font-semibold text-marsRed">
                    {boostCounts[cat.symbol] ?? 0}
                  </td>
                  <td className="border border-slate-700 px-2 py-2">{cat.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
