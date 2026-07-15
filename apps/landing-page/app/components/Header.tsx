'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-[#e8e6e1] z-50 relative">
        <Link href="/" className="font-black text-xl tracking-tighter uppercase text-zinc-900 mx-auto">
          jc import
        </Link>
      </header>
    </>
  );
}
