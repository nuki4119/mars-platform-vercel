'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#38bdf8', '#f472b6', '#22c55e', '#facc15', '#f97316'];

interface BoostData {
  day: string;
  category_symbol: string;
  boost_count: number;
}

export default function CategoryBoostTrendsChart() {
  const [inputSymbols, setInputSymbols] = useState(['', '', '', '', '']);
  const [range, setRange] = useState(7); // Default to 7 days
  const [chartData, setChartData] = useState<Record<string, any>[]>([]);

  // Handle input change
  const handleSymbolChange = (index: number, value: string) => {
    const updated = [...inputSymbols];
    updated[index] = value.toUpperCase();
    setInputSymbols(updated);
  };

  useEffect(() => {
    const fetchData = async () => {
      const symbols = inputSymbols.filter((s) => s.trim() !== '');
      if (symbols.length === 0) return;

      const today = new Date();
      const past = new Date();
      past.setDate(today.getDate() - range);
      const fromDate = past.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('mock_category_daily_boosts')
        .select('*')
        .gte('day', fromDate)
        .in('category_symbol', symbols)
        .order('day', { ascending: true });

      if (error) {
        console.error('Failed to fetch data', error);
        return;
      }

      const grouped = Array.from(
        (data as BoostData[]).reduce((acc, curr) => {
          if (!acc.has(curr.day)) acc.set(curr.day, { day: curr.day });
          acc.get(curr.day)![curr.category_symbol] = curr.boost_count;
          return acc;
        }, new Map<string, Record<string, any>>()).values()
      );

      setChartData(grouped);
    };

    fetchData();
  }, [inputSymbols, range]);

  return (
    <div className="mb-8 p-4 bg-slate-850 border border-slate-700 rounded-2xl shadow-inner-slate">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-bold text-base">
          📈 Boost Trends ({range} Days, Daily)
        </h2>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[7, 14, 30].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 text-xs rounded border ${
                range === r
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-gray-300'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Symbol Inputs */}
      <div className="flex gap-2 mb-4">
        {inputSymbols.map((symbol, i) => (
          <input
            key={i}
            type="text"
            maxLength={8}
            value={symbol}
            onChange={(e) => handleSymbolChange(i, e.target.value)}
            placeholder={`Symbol ${i + 1}`}
            className="px-3 py-1 text-sm rounded bg-slate-700 text-white placeholder-gray-400 w-24 text-center border border-slate-600"
          />
        ))}
      </div>

      {chartData.length === 0 ? (
        <div className="text-yellow-400 text-sm">
          No data yet. Enter symbols to fetch trends.
        </div>
      ) : (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              {inputSymbols
                .filter((s) => s.trim() !== '')
                .map((symbol, index) => (
                  <Line
                    key={symbol}
                    type="monotone"
                    dataKey={symbol}
                    stroke={COLORS[index % COLORS.length]}
                    dot={false}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
