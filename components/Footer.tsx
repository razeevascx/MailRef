'use client';

import React from 'react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';
import Mailref from './Mailref';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1A2440]/10 dark:border-white/10 bg-white/50 dark:bg-[#1A2440]/50 backdrop-blur-md text-[#1A2440] dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Mailref />
            <p className="text-sm text-[#1A2440]/70 dark:text-slate-400 max-w-xs leading-relaxed font-normal">
              Secure, private, open-source email masking and forwarding service. Keep your real inbox spam-free.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/razeevascx/MailRef"
                target="_blank" 
                rel="noreferrer"
                className="text-[#1A2440]/70 dark:text-slate-400 hover:text-[#0A3BBF] dark:hover:text-white transition-colors duration-200"
              >
                <FaGithub className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Nav Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A3BBF] dark:text-[#0A3BBF]">Product</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link href="/" className="text-sm text-[#1A2440]/70 dark:text-slate-400 hover:text-[#1A2440] dark:hover:text-white transition-colors font-medium">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-sm text-[#1A2440]/70 dark:text-slate-400 hover:text-[#1A2440] dark:hover:text-white transition-colors font-medium">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A3BBF] dark:text-[#0A3BBF]">Security</h3>
                <ul className="mt-4 space-y-3 font-medium text-sm text-[#1A2440]/70 dark:text-slate-400">
                  <li>Row-Level Security Active</li>
                  <li>Cloudflare Email Worker Protected</li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A3BBF] dark:text-[#0A3BBF]">Legal</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="#" className="text-sm text-[#1A2440]/70 dark:text-slate-400 hover:text-[#1A2440] dark:hover:text-white transition-colors font-medium">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#1A2440]/70 dark:text-slate-400 hover:text-[#1A2440] dark:hover:text-white transition-colors font-medium">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="mt-12 border-t border-[#1A2440]/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#1A2440]/50 dark:text-slate-500 font-medium">
            &copy; {currentYear} MailRef. Inspired by Firefox Relay and Apple Hide My Email.
          </p>
          <p className="text-xs text-[#1A2440]/50 dark:text-slate-500 font-medium">
            Dedicated to user privacy and security.
          </p>
        </div>
      </div>
    </footer>
  );
}
