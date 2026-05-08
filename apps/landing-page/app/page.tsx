import prisma from "database";
import Image from "next/image";

// Placeholder image if none provided
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop";

export const revalidate = 0; // Dynamic rendering for prices

export default async function Home() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: "global" }
  });
  const dollarRate = settings?.dollarRate ?? 1000;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-black text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615397323223-764024220794?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-yellow-200 mb-4 drop-shadow-lg">
            JC IMPORT
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Descubre la esencia del lujo. Fragancias importadas y árabes exclusivas.
          </p>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Colección Exclusiva</h2>
            <p className="text-gold-500 font-medium">Cotización actual: 1 USD = ${dollarRate} ARS</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
            <p className="text-gray-400 text-lg">No hay productos disponibles por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const priceARS = product.priceUSD * dollarRate;
              const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
              const finalPriceUSD = hasDiscount 
                ? product.priceUSD * (1 - product.discountPercentage! / 100) 
                : product.priceUSD;
              const finalPriceARS = finalPriceUSD * dollarRate;

              return (
                <div key={product.id} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col">
                  {/* Badge */}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-2">
                      -{product.discountPercentage}% OFF
                    </div>
                  )}
                  
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                    <img
                      src={product.imageUrl || FALLBACK_IMAGE}
                      alt={product.name}
                      className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow relative">
                    <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-1">{product.brand}</p>
                    <h3 className="text-xl font-semibold text-white mb-4 line-clamp-2">{product.name}</h3>
                    
                    <div className="mt-auto space-y-1">
                      {hasDiscount ? (
                        <>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-500 line-through text-sm">USD {product.priceUSD.toFixed(2)}</p>
                            <p className="text-gold-400 font-bold text-xl">USD {finalPriceUSD.toFixed(2)}</p>
                          </div>
                          <p className="text-gray-300 font-medium">${finalPriceARS.toLocaleString('es-AR')} ARS</p>
                        </>
                      ) : (
                        <>
                          <p className="text-gold-400 font-bold text-xl">USD {product.priceUSD.toFixed(2)}</p>
                          <p className="text-gray-300 font-medium">${priceARS.toLocaleString('es-AR')} ARS</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
