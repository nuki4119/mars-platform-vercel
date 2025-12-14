'use client';

import { useState } from 'react';

export default function CreateUserPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleCreateUser = async () => {
    setStatus('Creating user...');

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      setStatus(`❌ Error: ${result.error}`);
      return;
    }

    setStatus('✅ User created successfully!');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-3 rounded bg-slate-800 border border-slate-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-3 rounded bg-slate-800 border border-slate-600"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleCreateUser}
        className="w-full bg-marsRed hover:bg-marsRedDark py-2 rounded font-semibold"
      >
        Create User
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
