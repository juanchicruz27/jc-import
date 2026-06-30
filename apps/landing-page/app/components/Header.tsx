'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu } from 'lucide-react';
import SearchModal from './SearchModal';
import MenuModal from './MenuModal';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-[#e8e6e1] z-50 relative">
        <Link href="/" className="font-black text-xl tracking-tighter uppercase text-zinc-900">
          jc import
        </Link>
        <div className="flex items-center gap-5">
          <button onClick={() => setIsSearchOpen(true)} className="text-zinc-800 transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link href="/favoritos" className="text-zinc-800 transition-colors hidden sm:block">
            <Heart size={20} strokeWidth={1.5} />
          </Link>
          <button className="text-zinc-800 transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="text-zinc-800 transition-colors">
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      <MenuModal 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
}
