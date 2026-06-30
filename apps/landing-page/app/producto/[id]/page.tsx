import prisma from "database";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Wind, Heart, Flower2 } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (!product) {
    notFound();
  }

  const settings = await prisma.storeSettings.findUnique({ where: { id: "global" } });
  const dollarRate = settings?.dollarRate ?? 1000;
  
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const finalPriceUSD = hasDiscount 
    ? product.priceUSD * (1 - product.discountPercentage! / 100) 
    : product.priceUSD;
  const finalPriceARS = finalPriceUSD * dollarRate;

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: product.bgColor || '#000000' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver al Catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <ShoppingBag size={64} className="text-zinc-800" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Content Section */}
          <div className="text-white space-y-8">
            <div>
              <p className="text-yellow-500 font-black uppercase tracking-[0.3em] text-sm mb-3">
                {product.brand}
              </p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-white">
                  ${finalPriceARS.toLocaleString('es-AR')} ARS
                </p>
                {hasDiscount && (
                  <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>
              <p className="text-white/40 mt-2 font-medium">Equivalente a USD {finalPriceUSD.toFixed(2)}</p>
            </div>

            {/* Olfactory Notes */}
            <div className="grid grid-cols-1 gap-4">
              <NoteCard icon={<Wind className="text-blue-400" />} label="Notas de Salida" value={product.notesTop || "No especificado"} />
              <NoteCard icon={<Heart className="text-red-400" />} label="Notas de Corazón" value={product.notesHeart || "No especificado"} />
              <NoteCard icon={<Flower2 className="text-pink-400" />} label="Notas de Fondo" value={product.notesBase || "No especificado"} />
            </div>

            <div className="pt-8">
              <button className="w-full bg-white text-black font-black py-6 rounded-2xl text-lg hover:bg-zinc-200 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3">
                <ShoppingBag size={24} />
                CONSULTAR DISPONIBILIDAD
              </button>
              <p className="text-center text-white/30 text-xs mt-4 uppercase tracking-widest font-bold">Autenticidad garantizada por JC Import</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function NoteCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{label}</p>
        <p className="text-white font-medium text-sm leading-relaxed">{value}</p>
      </div>
    </div>
  );
}
