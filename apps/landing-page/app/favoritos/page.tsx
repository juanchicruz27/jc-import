import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavoritosPage() {
  return (
    <main className="min-h-screen bg-[#e8e6e1] font-sans px-6 py-12 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-200 rounded-full mb-6">
          <Heart size={32} className="text-zinc-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
          Tus Favoritos
        </h1>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto">
          Próximamente podrás guardar tus fragancias favoritas aquí.
        </p>
        <Link href="/" className="inline-block px-8 py-3 bg-zinc-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-zinc-800 transition-colors">
          Explorar catálogo
        </Link>
      </div>
    </main>
  );
}
