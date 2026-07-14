'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-300">
      <div className="bg-[#e8e6e1] w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
        
        {/* Input area */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('searchQuery') as HTMLInputElement;
            if (input.value.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
            }
          }}
          className="flex items-center border-b border-zinc-300 px-4 py-4"
        >
          <Search size={20} className="text-zinc-500 mr-3" />
          <input 
            type="text" 
            name="searchQuery"
            placeholder="Buscar productos..."
            className="flex-grow bg-transparent outline-none text-zinc-800 text-lg placeholder:text-zinc-500"
            autoFocus
          />
          <button 
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-zinc-600 hover:text-black ml-4 px-2 tracking-widest"
          >
            ESC
          </button>
        </form>

        {/* Suggestions area */}
        <div className="px-6 py-6 pb-8">
          <h4 className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Búsquedas populares
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {['Lattafa', 'Xerjoff', 'Club de Nuit'].map((term) => (
              <a 
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-4 py-1.5 border border-zinc-300 rounded-sm text-sm text-zinc-700 hover:bg-zinc-200 transition-colors"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
