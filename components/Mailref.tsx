'use client';

import Link from 'next/link';

export default function Mailref() {
  return (
    <Link href="/" className="flex items-center space-x-2.5 group">
      <svg
        className="h-7 w-7 text-[#1A2440] dark:text-white transition-transform duration-200 group-hover:scale-[1.03]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Envelope outline */}
        <rect x="2" y="4" width="20" height="16" rx="3" />
        {/* Envelope flap */}
        <path d="M22 7l-8.97 5.7a1.9 1.9 0 0 1-2.06 0L2 7" />
        {/* Flat routing connector node */}
        <circle cx="12" cy="15" r="1.5" className="fill-current" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-[#1A2440] dark:text-white font-sans">
        Mail<span className="underline decoration-wavy decoration-[#0A3BBF] dark:decoration-[#0A3BBF] decoration-2">Ref</span>
      </span>
    </Link>
  );
}
