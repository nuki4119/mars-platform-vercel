'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase/client';
import PostForm from '../../../components/forms/PostForm';

export default function CreatePostPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setCheckingAuth(false);
    };

    getSession();
  }, []);

  useEffect(() => {
    if (!checkingAuth && !session) {
      router.push('/login');
    }
  }, [checkingAuth, session, router]);

  if (checkingAuth) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📮 Create Buzz Post</h1>
      <PostForm />
    </div>
  );
}
