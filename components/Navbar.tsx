'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { ThemeSwitcher } from './theme-switcher';
import Mailref from './Mailref';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { id: 1, name: 'Home', url: '/' },
    { id: 2, name: 'FAQ', url: '/faq' },
  ];

  return (
    <nav className="py-4 px-4 z-50 sticky top-0 shadow-md backdrop-blur-sm ">
      <div className="container mx-auto flex justify-between items-center">
        <Mailref />

        <ul className="hidden md:flex items-center space-x-8">
          {links.map((item) => (
            <li key={item.id}>
              <Link
                href={item.url}
                className="hover:text-blue-500 transition duration-300 font-medium"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <ThemeSwitcher />
        </ul>

        <div className="hidden md:flex items-center space-x-4">
          <Button className="font-medium">
            <Link href="/get-started" replace>
              Get Started
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden hover:text-blue-500 transition"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-40">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {links.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="text-gray-600 hover:text-blue-500 transition py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="ghost" className="w-full font-medium">
                <Link href="/sign-in" replace>
                  Sign In
                </Link>
              </Button>
              <Button className="w-full font-medium">
                <Link href="/sign-up" replace>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
