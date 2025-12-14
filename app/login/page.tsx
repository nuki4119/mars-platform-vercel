'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../supabase/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // 🔁 Redirect after successful login
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          router.push('/feed'); // 👈 Or '/dashboard' if preferred
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-950">
      <div className="max-w-md w-full p-6 bg-gray-900 rounded-2xl shadow-xl">
        <h1 className="text-2xl text-white font-bold mb-6 text-center">🔐 Login to Mars</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
        />
      </div>
    </div>
  );
}

