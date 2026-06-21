'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from './ui/button';
import { Menu, X, LogOut, LayoutDashboard, User, Settings } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { ThemeSwitcher } from './theme-switcher';
import Mailref from './Mailref';
import { CurrentUserAvatar } from './current-user-avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileEmail, setProfileEmail] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function getInitialUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('primary_email').eq('id', user.id).maybeSingle();
        setProfileEmail(profile?.primary_email || user.email || '');
      }
      setLoading(false);
    }
    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { data: profile } = await supabase.from('profiles').select('primary_email').eq('id', currentUser.id).maybeSingle();
        setProfileEmail(profile?.primary_email || currentUser.email || '');
      } else {
        setProfileEmail('');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Sync temp email input value on open
  useEffect(() => {
    if (isSettingsOpen) {
      setTempEmail(profileEmail);
    }
  }, [isSettingsOpen, profileEmail]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmail.trim()) return;
    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ primary_email: tempEmail, updated_at: new Date().toISOString() })
        .eq('id', user?.id);

      if (error) {
        toast.error(error.message || 'Failed to update forwarding email');
      } else {
        setProfileEmail(tempEmail);
        toast.success('Forwarding target email updated');
        setIsSettingsOpen(false);
      }
    } catch (err) {
      toast.error('An error occurred.');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const links = [
    { id: 1, name: 'Home', url: '/' },
    { id: 2, name: 'FAQ', url: '/faq' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#1A2440]/10 dark:border-white/10 bg-white/80 dark:bg-[#1A2440]/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="text-[#1A2440] dark:text-white">
            <Mailref />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6 items-center">
              {links.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`text-sm font-semibold transition-colors hover:text-[#1A2440] dark:hover:text-white ${
                    pathname === item.url
                      ? 'text-[#0A3BBF] dark:text-[#0A3BBF]'
                      : 'text-[#1A2440]/70 dark:text-white/70'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  className={`text-sm font-semibold transition-colors hover:text-[#1A2440] dark:hover:text-white flex items-center gap-1.5 ${
                    pathname === '/dashboard'
                      ? 'text-[#0A3BBF] dark:text-[#0A3BBF]'
                      : 'text-[#1A2440]/70 dark:text-white/70'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4 border-l border-[#1A2440]/10 dark:border-white/10 pl-6">
              <ThemeSwitcher />

              {!loading && (
                <>
                  {user ? (
                    <div className="relative">
                      {/* Avatar Trigger button */}
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center rounded-[12px] p-0.5 border border-[#1A2440]/10 dark:border-white/10 hover:bg-[#1A2440]/5 dark:hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
                      >
                        <CurrentUserAvatar />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <>
                          {/* Close backdrop */}
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <div className="absolute right-0 mt-2 w-56 shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="gradient-shell-wrapper">
                              <div className="gradient-shell-inner p-1 text-left">
                                <div className="px-4 py-2.5 border-b border-[#1A2440]/5 dark:border-white/5">
                                  <p className="text-[10px] text-[#1A2440]/50 dark:text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                                  <p className="text-xs font-bold text-[#1A2440] dark:text-white truncate font-mono mt-0.5">{user.email}</p>
                                </div>
                                <div className="py-1">
                                  <Link
                                    href="/dashboard"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1A2440]/80 dark:text-slate-300 hover:bg-[#1A2440]/5 dark:hover:bg-white/5 rounded-[12px] transition-colors"
                                  >
                                    <LayoutDashboard className="h-3.5 w-3.5 text-[#0A3BBF]" />
                                    Dashboard
                                  </Link>
                                  <button
                                    onClick={() => {
                                      setIsDropdownOpen(false);
                                      setIsSettingsOpen(true);
                                    }}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1A2440]/80 dark:text-slate-300 hover:bg-[#1A2440]/5 dark:hover:bg-white/5 rounded-[12px] transition-colors cursor-pointer text-left font-sans"
                                  >
                                    <Settings className="h-3.5 w-3.5 text-[#0A3BBF]" />
                                    Settings
                                  </button>
                                </div>
                                <div className="border-t border-[#1A2440]/5 dark:border-white/5 pt-1 mt-1">
                                  <button
                                    onClick={() => {
                                      setIsDropdownOpen(false);
                                      handleLogout();
                                    }}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-[12px] transition-colors cursor-pointer text-left font-sans"
                                  >
                                    <LogOut className="h-3.5 w-3.5 text-red-500" />
                                    Logout
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <Link href="/get-started">
                      <Button size="sm" className="font-semibold bg-[#1A2440] hover:bg-[#1A2440]/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-[#1A2440] rounded-[12px] px-6 text-xs h-9">
                        Get Started
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-[12px] p-2 text-[#1A2440] dark:text-white hover:bg-[#1A2440]/5 dark:hover:bg-white/5 border border-[#1A2440]/15 dark:border-white/15"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-b border-[#1A2440]/10 dark:border-white/10 bg-white dark:bg-[#1A2440] md:hidden">
          <div className="space-y-1 px-4 py-4">
            {links.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={`block rounded-[12px] px-4 py-2 text-sm font-semibold ${
                  pathname === item.url
                    ? 'bg-[#1A2440]/5 dark:bg-white/5 text-[#0A3BBF] dark:text-[#0A3BBF] border border-[#0A3BBF]/20'
                    : 'text-[#1A2440]/70 dark:text-white/70 hover:bg-[#1A2440]/5 dark:hover:bg-white/5 hover:text-[#1A2440] dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className={`block rounded-[12px] px-4 py-2 text-sm font-semibold ${
                  pathname === '/dashboard'
                    ? 'bg-[#1A2440]/5 dark:bg-white/5 text-[#0A3BBF] dark:text-[#0A3BBF] border border-[#0A3BBF]/20'
                    : 'text-[#1A2440]/70 dark:text-white/70 hover:bg-[#1A2440]/5 dark:hover:bg-white/5 hover:text-[#1A2440] dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            <div className="mt-4 border-t border-[#1A2440]/10 dark:border-white/10 pt-4">
              {!loading && (
                <>
                  {user ? (
                    <div className="space-y-3">
                      <div className="px-4 py-2 text-xs text-[#1A2440] dark:text-white bg-[#1A2440]/5 dark:bg-white/5 rounded-[12px] border border-[#1A2440]/10 dark:border-white/10 flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-[#0A3BBF] shrink-0" />
                        <span className="font-mono font-bold truncate">{user.email}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsSettingsOpen(true);
                        }}
                        className="w-full justify-center rounded-[12px] font-semibold border border-[#1A2440]/15 dark:border-white/15 bg-transparent text-[#1A2440] dark:text-white hover:bg-[#1A2440]/5 dark:hover:bg-white/5 text-xs h-10 flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="h-4 w-4 text-[#0A3BBF]" />
                        Settings
                      </button>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-center rounded-[12px] font-semibold bg-red-650 hover:bg-red-700 text-white text-xs h-10 border border-red-600"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Link href="/get-started" onClick={() => setIsMenuOpen(false)} className="w-full">
                      <Button className="w-full justify-center rounded-[12px] font-semibold bg-[#1A2440] hover:bg-[#1A2440]/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-[#1A2440] text-xs h-10">
                        Get Started
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog Card Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1A2440] border border-[#1A2440]/15 dark:border-white/15 text-[#1A2440] dark:text-white rounded-[16px] p-8 shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-semibold text-lg uppercase text-[#0A3BBF] text-left">Account Settings</DialogTitle>
            <DialogDescription className="text-[#1A2440]/70 dark:text-slate-400 text-xs text-left">
              Configure your forwarding destination and view account metrics.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateEmail} className="space-y-4 py-2 text-left">
            <div className="space-y-2">
              <Label htmlFor="nav-forwarding-email" className="font-semibold text-xs uppercase text-[#0A3BBF] tracking-wider">
                Forwarding Target Inbox
              </Label>
              <div className="flex gap-2">
                <Input
                  id="nav-forwarding-email"
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  required
                  className="bg-transparent border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] px-5 py-2 text-[#1A2440] dark:text-white placeholder-[#1A2440]/45 dark:placeholder-white/45 flex-1 text-sm h-10"
                />
                <Button
                  type="submit"
                  disabled={isUpdatingEmail || tempEmail === profileEmail}
                  className="bg-[#1A2440] hover:bg-[#1A2440]/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-[#1A2440] font-semibold rounded-[12px] px-6 text-xs h-10 border border-transparent shadow-sm"
                >
                  {isUpdatingEmail ? 'Saving...' : 'Update'}
                </Button>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                All allowed emails routed to aliases will forward to this address.
              </p>
            </div>
          </form>

          <div className="pt-4 border-t border-[#1A2440]/10 dark:border-white/10 space-y-4 text-left">
            <h4 className="text-xs font-semibold text-[#0A3BBF] uppercase tracking-wider">Account Plan</h4>
            <div className="rounded-[12px] border border-[#1A2440]/10 dark:border-white/10 bg-[#1A2440]/5 dark:bg-white/5 p-6 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Subscription Tier</span>
                <Badge variant="outline" className="bg-[#1A2440]/10 dark:bg-white/10 border-none font-semibold text-[#1A2440] dark:text-slate-300 rounded-[12px] px-3 py-1">
                  Free Plan
                </Badge>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Maximum Alias Limit</span>
                <span className="font-semibold text-[#1A2440] dark:text-white">5 aliases</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
