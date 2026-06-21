'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail, Shield, Trash2, Plus, Edit2,
  Check, Copy, Search, Loader2,
  X, Ban, ArrowUpRight, ArrowDownLeft, Sparkles, Settings, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  createAlias,
  toggleAliasStatus,
  updateAliasDescription,
  deleteAlias,
  getBlockedSenders,
  blockSender,
  unblockSender
} from '@/app/dashboard/actions';

interface Alias {
  id: string;
  prefix: string;
  domain: string;
  description: string | null;
  is_active: boolean;
  emails_forwarded: number;
  emails_blocked: number;
  created_at: string;
}

interface ForwardingLog {
  id: string;
  alias_id: string;
  sender_email: string;
  subject: string | null;
  status: string;
  size_bytes: number | null;
  created_at: string;
  aliases: {
    prefix: string;
    domain: string;
  };
}

interface DashboardProps {
  initialAliases: Alias[];
  initialLogs: ForwardingLog[];
  userEmail: string;
}

export default function Dashboard({ initialAliases, initialLogs, userEmail }: DashboardProps) {
  const [aliases, setAliases] = useState<Alias[]>(initialAliases);
  const [logs, setLogs] = useState<ForwardingLog[]>(initialLogs);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals & Dynamic State
  const [isGenerating, setIsGenerating] = useState(false);
  const [newAliasDesc, setNewAliasDesc] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editing Alias Description
  const [editingAlias, setEditingAlias] = useState<Alias | null>(null);
  const [editDesc, setEditDesc] = useState('');

  // Deleting Alias
  const [deletingAliasId, setDeletingAliasId] = useState<string | null>(null);

  // Manage Blocked Senders modal
  const [selectedAlias, setSelectedAlias] = useState<Alias | null>(null);
  const [blockedSenders, setBlockedSenders] = useState<any[]>([]);
  const [isLoadingBlocked, setIsLoadingBlocked] = useState(false);
  const [newBlockEmail, setNewBlockEmail] = useState('');

  // Derived Stats
  const totalForwarded = aliases.reduce((acc, curr) => acc + curr.emails_forwarded, 0);
  const totalBlocked = aliases.reduce((acc, curr) => acc + curr.emails_blocked, 0);
  const activeAliasesCount = aliases.filter(a => a.is_active).length;

  // Filtered Aliases list
  const filteredAliases = aliases.filter(alias => {
    const matchesSearch =
      alias.prefix.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alias.description && alias.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterActive === 'active') return matchesSearch && alias.is_active;
    if (filterActive === 'inactive') return matchesSearch && !alias.is_active;
    return matchesSearch;
  });

  // Handle generation of new alias
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const result = await createAlias(newAliasDesc);
      if (result.success && result.data) {
        setAliases([result.data as Alias, ...aliases]);
        toast.success(`Generated: ${result.data.prefix}@${result.data.domain}`);
        setNewAliasDesc('');
      } else {
        toast.error(result.error || 'Failed to generate alias');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle active switch
  const handleToggleActive = async (aliasId: string, currentStatus: boolean) => {
    const targetStatus = !currentStatus;

    // Optimistic UI update
    setAliases(prev => prev.map(a => a.id === aliasId ? { ...a, is_active: targetStatus } : a));

    try {
      const result = await toggleAliasStatus(aliasId, targetStatus);
      if (result.success) {
        toast.success(`Alias ${targetStatus ? 'activated' : 'deactivated'}`);
      } else {
        // Rollback
        setAliases(prev => prev.map(a => a.id === aliasId ? { ...a, is_active: currentStatus } : a));
        toast.error(result.error || 'Failed to update alias status');
      }
    } catch (err) {
      setAliases(prev => prev.map(a => a.id === aliasId ? { ...a, is_active: currentStatus } : a));
      toast.error('An error occurred while updating alias.');
    }
  };

  // Update alias description
  const handleSaveDescription = async () => {
    if (!editingAlias) return;
    try {
      const result = await updateAliasDescription(editingAlias.id, editDesc);
      if (result.success) {
        setAliases(prev => prev.map(a => a.id === editingAlias.id ? { ...a, description: editDesc } : a));
        toast.success('Description updated');
        setEditingAlias(null);
      } else {
        toast.error(result.error || 'Failed to update description');
      }
    } catch (err) {
      toast.error('An error occurred.');
    }
  };

  // Delete Alias
  const handleDeleteAlias = async () => {
    if (!deletingAliasId) return;
    try {
      const result = await deleteAlias(deletingAliasId);
      if (result.success) {
        setAliases(prev => prev.filter(a => a.id !== deletingAliasId));
        toast.success('Alias deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete alias');
      }
    } catch (err) {
      toast.error('An error occurred.');
    } finally {
      setDeletingAliasId(null);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Alias copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Load blocked senders modal details
  const handleOpenBlockedSenders = async (alias: Alias) => {
    setSelectedAlias(alias);
    setIsLoadingBlocked(true);
    try {
      const list = await getBlockedSenders(alias.id);
      setBlockedSenders(list);
    } catch (err) {
      toast.error('Could not fetch blocked senders list');
    } finally {
      setIsLoadingBlocked(false);
    }
  };

  // Add a sender block
  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlias || !newBlockEmail.trim()) return;
    try {
      const result = await blockSender(selectedAlias.id, newBlockEmail);
      if (result.success) {
        toast.success(`Blocked emails from ${newBlockEmail}`);
        // Reload list
        const list = await getBlockedSenders(selectedAlias.id);
        setBlockedSenders(list);

        // Optimistic stats update for the alias
        setAliases(prev => prev.map(a => a.id === selectedAlias.id ? { ...a, emails_blocked: a.emails_blocked + 1 } : a));

        setNewBlockEmail('');
      } else {
        toast.error(result.error || 'Failed to block sender');
      }
    } catch (err) {
      toast.error('An error occurred.');
    }
  };

  // Remove a sender block
  const handleRemoveBlock = async (senderEmail: string) => {
    if (!selectedAlias) return;
    try {
      const result = await unblockSender(selectedAlias.id, senderEmail);
      if (result.success) {
        toast.success(`Unblocked ${senderEmail}`);
        setBlockedSenders(prev => prev.filter(b => b.sender_email !== senderEmail));
      } else {
        toast.error(result.error || 'Failed to unblock sender');
      }
    } catch(err) {
      toast.error('An error occurred.');
    }
  };


  return (
    <div className="min-h-screen text-[#1A2440] dark:text-white transition-colors duration-300 font-sans pb-24">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Welcome Banner */}
        <section className="gradient-shell-wrapper shadow-md">
          <div className="gradient-shell-inner p-8">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#1A2440]/5 dark:bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#0A3BBF] dark:text-[#0A3BBF] border border-[#1A2440]/10 dark:border-white/10">
                  <Sparkles className="h-3 w-3" />
                  Active Session Secure
                </span>
                <h2 className="text-3xl font-serif font-normal tracking-tight text-[#1A2440] dark:text-white">Email Privacy Dashboard</h2>
                <p className="text-[#1A2440]/70 dark:text-slate-400 max-w-xl text-sm leading-relaxed font-light">
                  Generate unique email aliases on the fly. Track forwarded messages, manage spam filters, and safeguard your primary email address.
                </p>
              </div>
              <div className="hidden lg:block text-right">
                <span className="block text-[10px] text-[#1A2440]/55 dark:text-slate-400 uppercase tracking-widest font-semibold">Logged In As</span>
                <span className="text-xs font-semibold text-[#1A2440] dark:text-white bg-[#1A2440]/5 dark:bg-white/5 border border-[#1A2440]/10 dark:border-white/10 px-4 py-2 rounded-[12px] inline-block mt-2 font-mono">{userEmail}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Total Aliases */}
          <div className="gradient-shell-wrapper shadow-sm transition-all duration-300 hover:-translate-y-1">
            <div className="gradient-shell-inner p-8 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4">
                <span className="text-xs font-semibold text-[#1A2440]/70 dark:text-slate-400 uppercase tracking-wider">Total Email Aliases</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#0A3BBF]/10 text-[#0A3BBF] dark:bg-white/10 dark:text-white">
                  <Mail className="h-4.5 w-4.5" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-serif font-normal tracking-tight text-[#1A2440] dark:text-white">
                  {aliases.length}
                </div>
                <p className="mt-2 text-xs text-[#1A2440]/60 dark:text-slate-400 font-medium flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  {activeAliasesCount} active and routing
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Forwarded */}
          <div className="gradient-shell-wrapper shadow-sm transition-all duration-300 hover:-translate-y-1">
            <div className="gradient-shell-inner p-8 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4">
                <span className="text-xs font-semibold text-[#1A2440]/70 dark:text-slate-400 uppercase tracking-wider">Forwarded Emails</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#0A3BBF]/10 text-[#0A3BBF] dark:bg-white/10 dark:text-white">
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-serif font-normal tracking-tight text-[#1A2440] dark:text-white">
                  {totalForwarded}
                </div>
                <p className="mt-2 text-xs text-[#1A2440]/60 dark:text-slate-400 font-medium">
                  Redirected safely to your inbox
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Blocked */}
          <div className="gradient-shell-wrapper shadow-sm transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="gradient-shell-inner p-8 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4">
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Spam Blocks</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-red-500/10 text-red-500">
                  <Shield className="h-4.5 w-4.5" />
                </div>
              </div>
              <div>
                <div className="text-4xl font-serif font-normal tracking-tight text-[#1A2440] dark:text-white">
                  {totalBlocked}
                </div>
                <p className="mt-2 text-xs text-[#1A2440]/60 dark:text-slate-400 font-medium">
                  Unwanted messages dropped silently
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Alias Generator Component */}
        <section className="gradient-shell-wrapper shadow-md">
          <div className="gradient-shell-inner p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-left w-full md:w-auto">
              <h2 className="text-lg font-semibold text-[#1A2440] dark:text-white flex items-center gap-2">
                Generate Private Alias
              </h2>
              <p className="text-sm text-[#1A2440]/70 dark:text-slate-400 font-light">
                Creates a randomized, unique slug address forwarding to you.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-stretch sm:items-center">
              <div className="flex-1 min-w-[240px]">
                <Input
                  placeholder="Description (e.g. Amazon, Newsletter)"
                  value={newAliasDesc}
                  onChange={(e) => setNewAliasDesc(e.target.value)}
                  className="w-full bg-transparent border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] px-5 py-2 text-[#1A2440] dark:text-white placeholder-[#1A2440]/45 dark:placeholder-white/45 focus-visible:ring-[#0A3BBF] h-10 text-sm"
                  disabled={isGenerating}
                />
              </div>
              <Button
                type="submit"
                className="bg-[#1A2440] hover:bg-[#1A2440]/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-[#1A2440] font-semibold rounded-[12px] px-8 shrink-0 text-xs h-10 border border-transparent shadow-sm"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Alias
                  </>
                )}
              </Button>
            </form>
          </div>
        </section>

        {/* Main Tabs Container */}
        <section className="gradient-shell-wrapper shadow-md">
          <div className="gradient-shell-inner overflow-hidden">
            <Tabs defaultValue="aliases" className="w-full">
              <div className="border-b border-[#1A2440]/10 dark:border-white/10 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <TabsList className="bg-[#1A2440]/5 dark:bg-white/5 self-start p-1 rounded-[12px] border border-[#1A2440]/10 dark:border-white/10">
                  <TabsTrigger value="aliases" className="font-semibold text-xs rounded-[12px] py-1.5 px-4 data-[state=active]:bg-[#1A2440] data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-[#1A2440] text-[#1A2440]/60 dark:text-slate-400">
                    My Aliases
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="font-semibold text-xs rounded-[12px] py-1.5 px-4 data-[state=active]:bg-[#1A2440] data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-[#1A2440] text-[#1A2440]/60 dark:text-slate-400">
                    Activity Logs
                  </TabsTrigger>
                </TabsList>

                {/* Filters / Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-60">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#1A2440]/50 dark:text-slate-500" />
                    <Input
                      placeholder="Search prefix or label..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 w-full bg-transparent border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] text-[#1A2440] dark:text-white placeholder-[#1A2440]/45 dark:placeholder-white/45 text-xs focus-visible:ring-[#0A3BBF]"
                    />
                  </div>

                  <div className="flex bg-[#1A2440]/5 dark:bg-white/5 rounded-[12px] p-1 border border-[#1A2440]/10 dark:border-white/10 items-center">
                    <button
                      onClick={() => setFilterActive('all')}
                      className={`px-4 py-1.5 rounded-[12px] text-xs font-semibold transition ${
                        filterActive === 'all'
                          ? 'bg-[#1A2440] text-white dark:bg-white dark:text-[#1A2440] shadow-sm'
                          : 'text-[#1A2440]/70 dark:text-slate-400 hover:text-[#1A2440] dark:hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterActive('active')}
                      className={`px-4 py-1.5 rounded-[12px] text-xs font-semibold transition ${
                        filterActive === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/25'
                          : 'text-[#1A2440]/70 dark:text-slate-400 hover:text-[#1A2440] dark:hover:text-white'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setFilterActive('inactive')}
                      className={`px-4 py-1.5 rounded-[12px] text-xs font-semibold transition ${
                        filterActive === 'inactive'
                          ? 'bg-[#1A2440]/10 dark:bg-white/10 text-[#1A2440] dark:text-white border border-[#1A2440]/15 dark:border-white/15'
                          : 'text-[#1A2440]/70 dark:text-slate-400 hover:text-[#1A2440] dark:hover:text-white'
                      }`}
                    >
                      Paused
                    </button>
                  </div>
                </div>
              </div>

              {/* TAB CONTENT: ALIASES */}
              <TabsContent value="aliases" className="m-0">
                {filteredAliases.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-[12px] bg-[#1A2440]/5 dark:bg-white/5 border border-[#1A2440]/10 dark:border-white/10 flex items-center justify-center mx-auto text-[#1A2440]/50 dark:text-slate-500">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#1A2440] dark:text-white uppercase tracking-wider">No aliases matching criteria</h3>
                      <p className="text-xs text-[#1A2440]/60 dark:text-slate-500 max-w-xs mx-auto font-light">
                        {searchQuery ? 'Try matching on alias prefixes or custom descriptions instead.' : 'Generate your first forwarding alias to get started.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#1A2440]/5 dark:bg-white/5 border-b border-[#1A2440]/10 dark:border-white/10">
                        <TableRow className="border-b border-[#1A2440]/10 dark:border-white/10">
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 pl-6 text-xs uppercase tracking-wider">Alias Mask</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-xs uppercase tracking-wider">Description Label</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-xs uppercase tracking-wider">Status</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-center text-xs uppercase tracking-wider">Forwarded</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-center text-xs uppercase tracking-wider">Blocked</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-right pr-6 text-xs uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAliases.map((alias) => {
                          const emailAddress = `${alias.prefix}@${alias.domain}`;
                          return (
                            <TableRow key={alias.id} className="hover:bg-[#1A2440]/5 dark:hover:bg-white/5 transition-colors border-b border-[#1A2440]/10 dark:border-white/10">
                              <TableCell className="py-4 pl-6 font-semibold text-[#1A2440] dark:text-white">
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm font-mono ${alias.is_active ? 'text-[#0A3BBF]' : 'line-through text-slate-400'}`}>
                                    {emailAddress}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-7 h-7 rounded-[12px] hover:bg-[#1A2440]/10 dark:hover:bg-white/10 text-[#1A2440]/70 dark:text-slate-400 hover:text-[#1A2440] dark:hover:text-white"
                                    onClick={() => copyToClipboard(emailAddress, alias.id)}
                                  >
                                    {copiedId === alias.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 text-sm text-[#1A2440] dark:text-slate-300">
                                {alias.description ? (
                                  <span className="font-semibold text-[#1A2440] dark:text-white bg-[#1A2440]/5 dark:bg-white/5 px-3 py-1.5 rounded-[12px] border border-[#1A2440]/10 dark:border-white/10">{alias.description}</span>
                                ) : (
                                  <span className="text-slate-400 text-xs font-light italic">No label</span>
                                )}
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center space-x-3">
                                  <Switch
                                    checked={alias.is_active}
                                    onCheckedChange={() => handleToggleActive(alias.id, alias.is_active)}
                                  />
                                  <Badge
                                    variant="outline"
                                    className={`rounded-[12px] px-3 py-0.5 text-[9px] font-semibold tracking-wide uppercase border-none ${alias.is_active
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450'
                                      : 'bg-[#1A2440]/10 dark:bg-white/10 text-slate-400'
                                    }`}
                                  >
                                    {alias.is_active ? 'Active' : 'Paused'}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 text-center text-sm font-semibold text-[#1A2440] dark:text-white">
                                {alias.emails_forwarded}
                              </TableCell>
                              <TableCell className="py-4 text-center text-sm font-semibold text-[#1A2440] dark:text-white">
                                {alias.emails_blocked}
                              </TableCell>
                              <TableCell className="py-4 text-right pr-6">
                                <div className="flex items-center justify-end space-x-1.5">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 rounded-[12px] hover:bg-[#1A2440]/10 dark:hover:bg-white/10 text-slate-400 hover:text-white"
                                    onClick={() => {
                                      setEditingAlias(alias);
                                      setEditDesc(alias.description || '');
                                    }}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </Button>

                                  <Dialog>
                                    <DialogTrigger render={
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-[12px] hover:bg-[#1A2440]/10 dark:hover:bg-white/10 text-[#1A2440]/75 dark:text-slate-400 hover:text-[#0A3BBF] dark:hover:text-white"
                                        onClick={() => handleOpenBlockedSenders(alias)}
                                      />
                                    }>
                                      <Ban className="w-3.5 h-3.5" />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-white dark:bg-[#1A2440] border border-[#1A2440]/15 dark:border-white/15 text-[#1A2440] dark:text-white rounded-[16px] p-8 shadow-lg">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 font-semibold text-lg uppercase text-red-500">
                                          <Ban className="w-5 h-5" />
                                          Spam Block List
                                        </DialogTitle>
                                        <DialogDescription className="text-[#1A2440]/70 dark:text-slate-400 text-xs font-light">
                                          Emails sent from blocked addresses to <strong className="text-[#1A2440] dark:text-white font-mono">{emailAddress}</strong> are dropped immediately.
                                        </DialogDescription>
                                      </DialogHeader>

                                      {/* Block Email Form */}
                                      <form onSubmit={handleAddBlock} className="flex gap-2 items-center py-2">
                                        <Input
                                          type="email"
                                          placeholder="annoying-sender@spam.com"
                                          value={newBlockEmail}
                                          onChange={(e) => setNewBlockEmail(e.target.value)}
                                          required
                                          className="flex-1 bg-transparent border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] px-5 py-2 text-[#1A2440] dark:text-white placeholder-[#1A2440]/45 dark:placeholder-white/45 text-xs focus-visible:ring-[#0A3BBF] h-10"
                                        />
                                        <Button type="submit" variant="destructive" size="sm" className="rounded-[12px] font-semibold px-4 bg-red-650 hover:bg-red-750 text-white text-[10px] h-10 border border-transparent">
                                          Block
                                        </Button>
                                      </form>

                                      <div className="max-h-60 overflow-y-auto border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] divide-y divide-[#1A2440]/10 dark:divide-white/10 bg-[#1A2440]/5 dark:bg-white/5">
                                        {isLoadingBlocked ? (
                                          <div className="py-8 text-center flex items-center justify-center gap-2 text-xs text-[#1A2440]/50 dark:text-slate-500 font-semibold">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Loading lists...
                                          </div>
                                        ) : blockedSenders.length === 0 ? (
                                          <div className="py-8 text-center text-xs text-[#1A2440]/50 dark:text-slate-500 font-semibold uppercase tracking-wider">
                                            All senders allowed.
                                          </div>
                                        ) : (
                                          blockedSenders.map((b) => (
                                            <div key={b.id} className="flex justify-between items-center px-4 py-2.5 text-xs">
                                              <span className="font-semibold text-[#1A2440] dark:text-slate-300 font-mono">{b.sender_email}</span>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-6 h-6 rounded-[12px] text-[#1A2440]/60 dark:text-slate-400 hover:text-red-500"
                                                onClick={() => handleRemoveBlock(b.sender_email)}
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </Button>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 rounded-[12px] hover:bg-[#1A2440]/10 dark:hover:bg-white/10 text-slate-400 hover:text-red-550"
                                    onClick={() => setDeletingAliasId(alias.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* TAB CONTENT: ACTIVITY LOGS */}
              <TabsContent value="logs" className="m-0">
                {logs.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-[12px] bg-[#1A2440]/5 dark:bg-white/5 border border-[#1A2440]/10 dark:border-white/10 flex items-center justify-center mx-auto text-[#1A2440]/50 dark:text-slate-500">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#1A2440] dark:text-white uppercase tracking-wider">No delivery records</h3>
                      <p className="text-xs text-[#1A2440]/60 dark:text-slate-500 max-w-xs mx-auto font-light">
                        Any incoming emails matching your active aliases will generate records here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#1A2440]/5 dark:bg-white/5 border-b border-[#1A2440]/10 dark:border-white/10">
                        <TableRow className="border-b border-[#1A2440]/10 dark:border-white/10">
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 pl-6 text-xs uppercase tracking-wider">Timestamp</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-xs uppercase tracking-wider">Alias Mailbox</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-xs uppercase tracking-wider">Sender Address</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-xs uppercase tracking-wider">Subject</TableHead>
                          <TableHead className="font-semibold text-[#1A2440]/70 dark:text-slate-400 py-3.5 text-right pr-6 text-xs uppercase tracking-wider">Routing Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-[#1A2440]/5 dark:hover:bg-white/5 transition-colors border-b border-[#1A2440]/10 dark:border-white/10">
                            <TableCell className="py-4 pl-6 text-xs text-slate-500 font-semibold">
                              {new Date(log.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="py-4 text-sm font-semibold text-[#1A2440] dark:text-white font-mono">
                              {log.aliases?.prefix}@{log.aliases?.domain}
                            </TableCell>
                            <TableCell className="py-4 text-sm text-[#1A2440]/80 dark:text-slate-300 font-medium">
                              {log.sender_email}
                            </TableCell>
                            <TableCell className="py-4 text-sm text-[#1A2440]/60 dark:text-slate-400 italic max-w-xs truncate font-light">
                              {log.subject || '(No Subject)'}
                            </TableCell>
                            <TableCell className="py-4 text-right pr-6">
                              <Badge
                                className={`rounded-[12px] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider border-none ${
                                  log.status === 'forwarded'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450'
                                    : log.status === 'blocked'
                                    ? 'bg-red-500/10 text-red-500'
                                    : 'bg-[#0A3BBF]/10 text-[#0A3BBF]'
                                  }`}
                              >
                                {log.status === 'forwarded' ? (
                                  <span className="flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    Forwarded
                                  </span>
                                ) : log.status === 'blocked' ? (
                                  <span className="flex items-center gap-1">
                                    <Ban className="w-3 h-3" />
                                    Blocked
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <ArrowDownLeft className="w-3 h-3" />
                                    Bounced
                                  </span>
                                )}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>


            </Tabs>
          </div>
        </section>
      </main>

      {/* Edit Description Dialog */}
      <Dialog open={editingAlias !== null} onOpenChange={(open) => !open && setEditingAlias(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1A2440] border border-[#1A2440]/15 dark:border-white/15 text-[#1A2440] dark:text-white rounded-[16px] p-8 shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-semibold text-lg uppercase text-[#0A3BBF] dark:text-[#0A3BBF]">Edit Alias Label</DialogTitle>
            <DialogDescription className="text-[#1A2440]/70 dark:text-slate-400 text-xs">
              Assign a description label to identify which service uses this alias.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-2 text-left">
            <Label htmlFor="edit-description" className="text-xs font-semibold text-[#1A2440]/70 dark:text-slate-400 uppercase tracking-wide">Description Label</Label>
            <Input
              id="edit-description"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="e.g. Netflix, Spotify, Weekly Newsletter"
              className="bg-transparent border border-[#1A2440]/15 dark:border-white/15 rounded-[12px] px-5 py-2 text-[#1A2440] dark:text-white placeholder-[#1A2440]/45 dark:placeholder-white/45 focus-visible:ring-[#0A3BBF] h-10 text-sm"
            />
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingAlias(null)} className="rounded-[12px] text-[#1A2440]/70 dark:text-slate-400 hover:text-white dark:hover:bg-white/10 hover:bg-[#1A2440]/10">
              Cancel
            </Button>
            <Button onClick={handleSaveDescription} className="bg-[#1A2440] hover:bg-[#1A2440]/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-[#1A2440] font-semibold rounded-[12px] px-6 text-xs h-10 border border-transparent shadow-sm">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deletingAliasId !== null} onOpenChange={(open) => !open && setDeletingAliasId(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#1A2440] border border-[#1A2440]/15 dark:border-white/15 text-[#1A2440] dark:text-white rounded-[16px] p-8 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 flex items-center gap-2 font-semibold text-lg uppercase">
              <Ban className="w-5 h-5" />
              Delete Alias permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#1A2440]/70 dark:text-slate-400 text-xs">
              This action is permanent and cannot be undone. Incoming emails sent to this address will be rejected and bounce back to the sender.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[12px] text-[#1A2440]/70 dark:text-slate-400 hover:bg-[#1A2440]/10 dark:hover:bg-white/10 border border-[#1A2440]/10 dark:border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAlias}
              className="bg-red-650 hover:bg-red-750 text-white font-semibold rounded-[12px] px-6 text-xs h-10 border border-transparent shadow-sm"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
