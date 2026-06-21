"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import Mailref from '@/components/Mailref';
import { Shield, Sparkles, HelpCircle } from 'lucide-react';

import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function GetStartedContent() {
  'use client';
  const searchParams = useSearchParams();
  const next = searchParams?.get('next') ?? '/dashboard';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${globalThis.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6 text-[#1A2440] dark:text-white font-sans">
      <div className="gradient-shell-wrapper w-full sm:w-[28rem] shadow-xl">
        <div className="gradient-shell-inner p-8 space-y-6">

          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Mailref />
            </div>
            <div className="space-y-1">
              <h1 className="font-serif text-3xl font-normal tracking-tight text-[#1A2440] dark:text-white">
                Get Started
              </h1>
              <p className="text-xs text-[#1A2440]/65 dark:text-slate-300 font-light max-w-xs mx-auto leading-relaxed">
                Shield your primary inbox from tracking, leaks, and unwanted spammers.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs text-red-500 font-semibold bg-red-500/10 p-3 rounded-[12px] border border-red-500/20 text-center">
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              className="w-full h-12 flex items-center justify-center gap-3 rounded-[12px] border border-[#1A2440]/15 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-[#1A2440] dark:text-white font-semibold text-xs shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FcGoogle className="text-xl shrink-0" />
              {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </Button>
          </div>

          {/* Privacy & Trust Badge Panel */}
          <div className="pt-6 border-t border-[#1A2440]/10 dark:border-white/10 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A2440]/40 dark:text-slate-400 text-center">
              Privacy & Security Guaranteed
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-[#0A3BBF]/10 dark:bg-white/10 text-[#0A3BBF] dark:text-white">
                  <Shield className="h-3 w-3" />
                </div>
                <p className="text-xs text-[#1A2440]/70 dark:text-slate-300 font-light leading-relaxed">
                  <strong className="text-[#1A2440] dark:text-white">Zero data logs:</strong> We parse and route emails on the edge. Your raw message contents are never stored.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-[#0A3BBF]/10 dark:bg-white/10 text-[#0A3BBF] dark:text-white">
                  <Sparkles className="h-3 w-3" />
                </div>
                <p className="text-xs text-[#1A2440]/70 dark:text-slate-300 font-light leading-relaxed">
                  <strong className="text-[#1A2440] dark:text-white">Granular block control:</strong> Block individual spam senders directly or toggle an alias off with a single click.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Assistance */}
          <div className="text-center pt-2">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs text-[#0A3BBF] dark:text-blue-400 hover:underline font-semibold"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#0A3BBF] dark:text-blue-400" />
              How it works & FAQ
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GetStartedContent />
    </Suspense>
  );
}
