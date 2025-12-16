"use client";

import React, { useEffect, useState } from "react";
import UniversalPageLayout from "../../components/Layout/UniversalPageLayout";



interface Transaction {
  id: string;
  type: "boost" | "earn" | "referral";
  amount: number;
  created_at: string;
  description?: string;
}

export default function TransactionsPageContainer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions/mock"); // Replace with real endpoint
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const mainContent = (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">CRV Transactions</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-3">
          {transactions.length === 0 && <p className="text-gray-400">No transactions yet.</p>}
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="border border-slate-800 bg-slate-900 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium capitalize">{txn.type}</p>
                <p className="text-slate-400 text-sm">{txn.description || "No description"}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${txn.type === "earn" ? "text-green-400" : "text-pink-400"}`}
                >
                  {txn.type === "earn" ? "+" : "-"}
                  {txn.amount.toFixed(2)} CRV
                </p>
                <p className="text-xs text-slate-500">{new Date(txn.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} rightContent={null} />;
}
