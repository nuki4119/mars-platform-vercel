'use client';

import { useState } from 'react';

export default function CreateUserPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    if (res.ok) {
      setResponse(`✅ User created: ${email}`);
      setEmail('');
      setPassword('');
    } else {
      setResponse(`❌ Error: ${result.error}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 rounded-md bg-slate-900 border border-slate-600 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 rounded-md bg-slate-900 border border-slate-600 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-black"
        >
          Create User
        </button>

        {response && <p className="mt-2 text-sm text-yellow-400">{response}</p>}
      </form>
    </div>
  );
}
