'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { createClient } from '@/utils/supabase/client';

export default function Social({ redirectTo }: { redirectTo: string }) {
  const loginWithProvider = async (provider: 'github' | 'google') => {
    const supbase = createClient();
    await supbase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          window.location.origin + `/auth/callback?next=` + redirectTo,
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <Button
        className="w-full h-10 flex items-center justify-center gap-2"
        variant="outline"
        onClick={() => loginWithProvider('google')}
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </Button>
    </div>
  );
}
