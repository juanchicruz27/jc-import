'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, X } from 'lucide-react';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export default function MenuModal({ isOpen, onClose, onOpenSearch }: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-[#e8e6e1] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header inside Modal */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-300">
        <Link href="/" onClick={onClose} className="font-black text-xl tracking-tighter uppercase text-zinc-900">
          JC IMPORT
        </Link>
        <div className="flex items-center gap-5">
          <button onClick={() => { onClose(); onOpenSearch(); }} className="text-zinc-800 transition-colors">
            <Search size={22} strokeWidth={1.5} />
          </button>
          <Link href="/favoritos" onClick={onClose} className="text-zinc-800 transition-colors">
            <Heart size={22} strokeWidth={1.5} />
          </Link>
          <button className="text-zinc-800 transition-colors">
            <ShoppingBag size={22} strokeWidth={1.5} />
          </button>
          <button onClick={onClose} className="text-zinc-800 transition-colors">
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col mt-4">
        {[
          { label: 'FRAGANCIAS MASCULINAS', href: '/categoria/masculinas' },
          { label: 'FRAGANCIAS FEMENINAS', href: '/categoria/femeninas' },
          { label: 'FRAGANCIAS UNISEX', href: '/categoria/unisex' },
          { label: 'CONTACTO', href: '/contacto' },
        ].map((item, idx) => (
          <Link 
            key={idx}
            href={item.href}
            onClick={onClose}
            className="px-6 py-5 text-sm font-semibold tracking-[0.15em] text-zinc-800 border-b border-zinc-300 hover:bg-zinc-200/50 transition-colors uppercase"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
