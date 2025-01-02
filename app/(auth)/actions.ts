'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function login() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
