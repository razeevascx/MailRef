'use client';
import React from 'react';
import SignUp from './signup';
import Social from './social';
import { useSearchParams } from 'next/navigation';
import Mailref from '../Mailref';

export default function Register() {
  const queryString =
    typeof window !== 'undefined' ? window?.location.search : '';
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the 'next' parameter
  const next = urlParams.get('next');
  const verify = urlParams.get('verify');

  return (
    <div className="w-full sm:w-[26rem] shadow sm:p-5  border dark:border-zinc-800 rounded-md">
      {' '}
      <div className="p-5 space-y-5">
        <div className="text-center space-y-3">
          <Mailref />
          <h1 className="font-bold text-xl">Create Account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome to MailRef! <br />
            Please fill in your details to get started and join our community.
          </p>
        </div>
        <Social redirectTo={next || '/'} />
        <div className="flex items-center gap-5">
          <div className="flex-1 h-px bg-zinc-400 dark:bg-zinc-800"></div>
          <div className="text-sm text-gray-600 dark:text-gray-400">or</div>
          <div className="flex-1 h-px bg-zinc-400 dark:bg-zinc-800"></div>
        </div>
      </div>
      <SignUp redirectTo={next || '/'} />
    </div>
  );
}
