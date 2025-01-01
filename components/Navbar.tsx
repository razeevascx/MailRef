'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { id: 1, name: 'Home', url: '/' },
    { id: 2, name: 'FAQ', url: '/faq' },
    { id: 3, name: 'Contact', url: '/contact' },
  ];

  return (
    <nav className="py-4 px-4 z-50 sticky top-0 shadow-md bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">
            Mail <span className="text-blue-500">Ref</span>
          </h1>
        </Link>

        <ul className="hidden md:flex items-center space-x-8">
          {links.map((item) => (
            <li key={item.id}>
              <Link
                href={item.url}
                className="text-gray-600 hover:text-blue-500 transition duration-300 font-medium"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="font-medium">
            Sign In
          </Button>
          <Button className="font-medium">Sign Up</Button>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600 hover:text-blue-500 transition"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4">
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
                Sign In
              </Button>
              <Button className="w-full font-medium">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
