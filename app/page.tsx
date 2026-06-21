'use client';

import React, { useState } from 'react';
import {
  Shield, Mail, ArrowRight, ChevronRight, Lock,
  EyeOff, Server, RefreshCw, Copy, Check, Sparkles,
  ArrowRightLeft, ShieldAlert, Database, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="gradient-shell-wrapper shadow-sm transition-all duration-300 hover:-translate-y-1">
    <div className="gradient-shell-inner p-8 h-full flex flex-col justify-between">
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0A3BBF]/10 text-[#0A3BBF] dark:bg-white/10 dark:text-white mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-[#1A2440] dark:text-white mb-2 font-sans">{title}</h3>
      </div>
      <p className="text-sm text-[#1A2440]/70 dark:text-slate-400 leading-relaxed mt-2 font-sans font-light">{description}</p>
    </div>
  </div>
);

// Adjectives and nouns for client-side test generator
const adjectives = ['swift', 'silent', 'golden', 'cosmic', 'brave', 'nimble', 'vivid', 'solar', 'hidden', 'frosty'];
const nouns = ['panda', 'falcon', 'rabbit', 'beacon', 'nebula', 'vortex', 'anchor', 'comet', 'cipher', 'badger'];

export default function Page() {
  // Test Alias Generator state
  const [testAlias, setTestAlias] = useState('');
  const [copied, setCopied] = useState(false);
  const [demoSender, setDemoSender] = useState('marketing@spammycompany.com');
  const [isBlocked, setIsBlocked] = useState(false);
  const [routingLog, setRoutingLog] = useState<string[]>([]);
  const [isRouting, setIsRouting] = useState(false);

  const handleGenerateTest = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    setTestAlias(`${adj}-${noun}-${num}@mailref.com`);
    setCopied(false);
    setRoutingLog([]);
  };

  const handleCopyTest = () => {
    if (!testAlias) return;
    navigator.clipboard.writeText(testAlias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateRoute = () => {
    if (!testAlias) {
      handleGenerateTest();
      return;
    }
    setIsRouting(true);
    setRoutingLog(['1. Email received at Cloudflare Edge routing node...']);

    setTimeout(() => {
      setRoutingLog(prev => [...prev, '2. Fetching Supabase RLS policies... Check active state...']);
    }, 800);

    setTimeout(() => {
      if (isBlocked) {
        setRoutingLog(prev => [
          ...prev,
          `3. Warning: Sender '${demoSender}' matches block list!`,
          '4. Action: SILENTLY DISCARDED (No inbox clutter, spam dropped).'
        ]);
      } else {
        setRoutingLog(prev => [
          ...prev,
          `3. Verified allowed: Forwarding rule match found.`,
          '4. Action: FORWARDED safely to user inbox (Real address hidden).'
        ]);
      }
      setIsRouting(false);
    }, 1600);
  };

  const features = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email Aliasing',
      description: 'Generate random, unique email aliases on the fly. Prevent services from tracking your digital footprint.',
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Anti-Spam Filter',
      description: 'Add annoying senders or newsletters to the block list with one click. Dropped emails bounce silently.',
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: 'RLS & Data Security',
      description: 'Your databases are protected with Postgres Row-Level Security (RLS). Complete privacy control.',
    },
    {
      icon: <Server className="h-5 w-5" />,
      title: 'Cloudflare Ingestion',
      description: 'Driven by Cloudflare Email Workers. Super-fast routing, instant deactivation, and 100% serverless.',
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      title: 'Anonymous Replies',
      description: 'Reply to forwarded emails from your primary inbox without exposing your real address to senders.',
    },
    {
      icon: <EyeOff className="h-5 w-5" />,
      title: 'Zero Tracker Storage',
      description: 'We do not read or store the contents of your emails. They pass through our router straight to you.',
    },
  ];

  return (
    <div className="min-h-screen text-[#1A2440] dark:text-white transition-colors duration-300 font-sans pb-24">

      {/* Hero Section */}
      <section className="pt-24 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-9">

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1A2440]/10 dark:border-white/10 bg-[#1A2440]/5 dark:bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#0A3BBF] dark:text-[#0A3BBF] tracking-wide">
            Private, Secure Email Routing
            <ChevronRight className="h-3.5 w-3.5" />
          </span>

          <div className="space-y-6">
            {/* Display large typography - Newsreader serif font */}
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[76px] font-normal leading-[1.05] tracking-[-0.0056em] text-[#1A2440] dark:text-white max-w-4xl mx-auto">
              Never Share Your Real<br />Email Address Again.
            </h1>

            <p className="text-base font-light text-[#1A2440]/80 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
              Create random, disposable email aliases to register on websites, sign up for trials, and protect your primary mailbox from spam, data leaks, and breaches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-xs sm:max-w-md mx-auto">
              <Link href="/get-started" className="flex-1">
                <Button size="lg" className="w-full h-12 bg-[#1A2440] hover:bg-[#1A2440]/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-[#1A2440] font-semibold text-sm rounded-[12px] border border-transparent transition-colors shadow-sm">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/faq" className="flex-1">
                <Button size="lg" variant="outline" className="w-full h-12 font-semibold text-sm border border-[#1A2440]/15 dark:border-white/15 bg-transparent hover:bg-[#1A2440]/5 dark:hover:bg-white/5 text-[#1A2440] dark:text-white rounded-[12px] transition-colors">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Generator & Router Simulator Card */}
          <div className="gradient-shell-wrapper relative mx-auto mt-14 max-w-4xl shadow-md text-left">
            <div className="gradient-shell-inner p-8">
              <div className="flex flex-col lg:flex-row gap-8">

                {/* Simulator Side 1: Interactive controls */}
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#0A3BBF] font-bold uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" /> Live Sandbox Demo
                    </span>
                    <h3 className="text-xl font-semibold text-[#1A2440] dark:text-white mt-1">Try Generating an Alias</h3>
                    <p className="text-xs text-[#1A2440]/75 dark:text-slate-400 font-light mt-1">See how MailRef routes emails while hiding your identity.</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-[#1A2440]/80 dark:text-slate-350">Step 1: Spin up a randomized address</Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={testAlias || 'Generate an address to begin...'}
                        className="bg-transparent border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] font-mono text-xs h-10 px-4 text-[#1A2440] dark:text-white"
                      />
                      <Button
                        onClick={handleGenerateTest}
                        className="bg-[#1A2440] hover:bg-[#1A2440]/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-[#1A2440] rounded-[12px] px-4 font-semibold text-xs h-10 border border-transparent shadow-sm shrink-0"
                      >
                        Generate
                      </Button>
                      {testAlias && (
                        <Button
                          onClick={handleCopyTest}
                          variant="outline"
                          className="border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] p-2 hover:bg-[#1A2440]/5 dark:hover:bg-white/5 h-10 w-10 flex items-center justify-center shrink-0"
                        >
                          {copied ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <Copy className="h-4.5 w-4.5" />}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#1A2440]/5 dark:border-white/5">
                    <Label className="text-xs font-semibold text-[#1A2440]/80 dark:text-slate-350">Step 2: Simulate incoming mail routing</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Sender (e.g. netflix@spam.com)"
                          value={demoSender}
                          onChange={(e) => setDemoSender(e.target.value)}
                          className="bg-transparent border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] text-xs h-9 px-3"
                        />
                        <div className="flex items-center gap-1.5 border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] px-3 bg-[#1A2440]/5 dark:bg-white/5">
                          <input
                            id="demo-block-checkbox"
                            type="checkbox"
                            checked={isBlocked}
                            onChange={(e) => setIsBlocked(e.target.checked)}
                            className="rounded accent-[#0A3BBF]"
                          />
                          <Label htmlFor="demo-block-checkbox" className="text-[10px] font-semibold text-red-500 uppercase tracking-wider cursor-pointer select-none">Block</Label>
                        </div>
                      </div>
                      <Button
                        disabled={isRouting}
                        onClick={handleSimulateRoute}
                        className="w-full bg-[#0A3BBF] hover:bg-[#0A3BBF]/90 text-white rounded-[12px] font-semibold text-xs h-9 border border-transparent"
                      >
                        {isRouting ? 'Routing...' : 'Simulate Delivery Routing'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Simulator Side 2: Virtual output console */}
                <div className="w-full lg:w-80 flex flex-col justify-between border border-[#1A2440]/10 dark:border-white/10 bg-[#1A2440]/5 dark:bg-white/5 rounded-[12px] p-6 font-mono text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#1A2440]/10 dark:border-white/10 pb-2">
                      <span className="text-[9px] font-bold uppercase text-[#0A3BBF]">Router Log Console</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    {routingLog.length === 0 ? (
                      <div className="text-slate-400 dark:text-slate-500 italic py-8 text-center text-[11px] leading-relaxed">
                        Select generate above and trigger a simulation to inspect live routing actions.
                      </div>
                    ) : (
                      <div className="space-y-2 text-[11px] leading-relaxed break-all whitespace-normal">
                        {routingLog.map((log, index) => (
                          <div key={index} className={
                            log.includes('Action:')
                              ? (log.includes('FORWARDED') ? 'text-emerald-600 dark:text-emerald-450 font-bold' : 'text-red-500 font-bold')
                              : (log.includes('Warning') ? 'text-amber-600 dark:text-amber-500' : 'text-[#1A2440] dark:text-slate-300')
                          }>
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {testAlias && (
                    <div className="mt-4 pt-4 border-t border-[#1A2440]/10 dark:border-white/10 flex justify-between items-center text-[10px] text-[#1A2440]/60 dark:text-slate-400">
                      <span>Dest: user-real-mailbox@gmail.com</span>
                      <Badge variant="outline" className="border-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-[12px] text-[8px] font-bold uppercase">Shielded</Badge>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>



      {/* Visual Ingestion Pipeline Diagram */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1A2440] dark:text-white">How MailRef Routes Your Mail</h2>
            <p className="text-[#1A2440]/70 dark:text-slate-400 text-sm max-w-md mx-auto font-light">
              A 100% serverless, zero-log relay that protects your data integrity in real time.
            </p>
          </div>

          {/* Interactive Pipeline Diagram */}
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-4 items-center relative text-center">
            {/* Step 1 */}
            <div className="rounded-[12px] border border-[#1A2440]/10 dark:border-white/10 p-6 space-y-2 bg-white/40 dark:bg-white/5">
              <div className="mx-auto h-10 w-10 rounded-[12px] bg-[#0A3BBF]/10 text-[#0A3BBF] dark:bg-white/10 dark:text-white flex items-center justify-center font-bold">1</div>
              <h4 className="text-sm font-semibold text-[#1A2440] dark:text-white">External Sender</h4>
              <p className="text-[10px] text-slate-500 font-light">Sends email to: your-alias@mailref.com</p>
            </div>
            {/* Step 2 */}
            <div className="rounded-[12px] border border-[#1A2440]/10 dark:border-white/10 p-6 space-y-2 bg-white/40 dark:bg-white/5">
              <div className="mx-auto h-10 w-10 rounded-[12px] bg-[#0A3BBF]/10 text-[#0A3BBF] dark:bg-white/10 dark:text-white flex items-center justify-center font-bold">2</div>
              <h4 className="text-sm font-semibold text-[#1A2440] dark:text-white">Cloudflare Worker</h4>
              <p className="text-[10px] text-slate-500 font-light">Intercepts email streams instantly at edge routing</p>
            </div>
            {/* Step 3 */}
            <div className="rounded-[12px] border border-[#1A2440]/10 dark:border-white/10 p-6 space-y-2 bg-white/40 dark:bg-white/5">
              <div className="mx-auto h-10 w-10 rounded-[12px] bg-[#0A3BBF]/10 text-[#0A3BBF] dark:bg-white/10 dark:text-white flex items-center justify-center font-bold">3</div>
              <h4 className="text-sm font-semibold text-[#1A2440] dark:text-white">Supabase Check</h4>
              <p className="text-[10px] text-slate-500 font-light">Validates alias status and verifies spam blocks via RLS</p>
            </div>
            {/* Step 4 */}
            <div className="rounded-[12px] border border-[#1A2440]/10 dark:border-white/10 p-6 space-y-2 bg-white/40 dark:bg-white/5">
              <div className="mx-auto h-10 w-10 rounded-[12px] bg-[#0A3BBF]/10 text-[#0A3BBF] dark:bg-white/10 dark:text-white flex items-center justify-center font-bold">4</div>
              <h4 className="text-sm font-semibold text-[#1A2440] dark:text-white">Safe Forwarding</h4>
              <p className="text-[10px] text-slate-500 font-light">Routes mail to your real inbox. Discards spammers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#1A2440] dark:text-white">
              Complete Privacy Control
            </h2>
            <p className="text-sm font-light text-[#1A2440]/70 dark:text-slate-300 max-w-xl mx-auto">
              Everything you need to block spammers, prevent tracker scripts, and monitor email flows.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="gradient-shell-wrapper shadow-md">
            <div className="gradient-shell-inner p-8 md:p-16 text-center space-y-6">
              <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-[#1A2440] dark:text-white">Stop sharing your real email.</h2>
              <p className="text-[#1A2440]/70 dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-light">
                Take control of your inbox now. Create temporary, disposable, or permanent aliases to protect yourself from spam, hacks, and breaches.
              </p>
              <div className="pt-4">
                <Link href="/get-started">
                  <Button size="lg" className="bg-[#1A2440] hover:bg-[#1A2440]/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-[#1A2440] font-semibold rounded-[12px] px-10 h-11 border border-transparent shadow-sm">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
