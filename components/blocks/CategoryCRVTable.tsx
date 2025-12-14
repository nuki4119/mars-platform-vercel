// components/blocks/CategoryCRVTable.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../supabase/client';

interface Category {
  id: string;
  symbol: string;
  name: string;
  group: string;
  crv_value: number;
  description: string;
}

export default function CategoryCRVTable() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, symbol, name, group, crv_value, description')
        .order('symbol');

      if (error) {
        console.error('❌ Failed to fetch categories:', error.message);
      } else {
        setCategories(data as Category[]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="overflow-x-auto bg-slate-900 rounded-xl p-4 border border-slate-700 text-sm">
      <h2 className="text-white text-lg font-bold mb-4">📊 Category CRV Market</h2>
      <table className="w-full text-left text-slate-300">
        <thead>
          <tr className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <th className="py-2 px-3">Symbol</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Group</th>
            <th className="py-2 px-3">CRV Value</th>
            <th className="py-2 px-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-slate-800 transition">
              <td className="py-2 px-3 font-mono">
                <Link href={`/clusters/${cat.symbol}`} className="text-blue-400 hover:underline">
                  {cat.symbol}
                </Link>
              </td>
              <td className="py-2 px-3">{cat.name}</td>
              <td className="py-2 px-3">{cat.group}</td>
              <td className="py-2 px-3 text-yellow-400 font-bold">
                {cat.crv_value.toFixed(2)}
              </td>
              <td className="py-2 px-3">{cat.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
