import prisma from "database";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  let products: any[] = [];
  let dollarRate = 1000;
  let dbError = false;

  try {
    products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const settings = await prisma.storeSettings.findUnique({ where: { id: "global" } });
    if (settings?.dollarRate) {
      dollarRate = settings.dollarRate;
    }
  } catch (error) {
    console.error("Database connection error:", error);
    dbError = true;
  }

  return (
    <main className="min-h-screen bg-[#e8e6e1] font-sans px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
          Resultados de búsqueda
        </h1>
        <p className="text-zinc-600 mb-8">
          Mostrando resultados para "{query}" ({products.length} encontrados)
        </p>

        {dbError ? (
          <div className="text-center py-20 bg-red-50/50 rounded-xl border border-red-200">
            <h2 className="text-red-600 font-bold text-xl mb-2">Error de conexión a la base de datos</h2>
            <p className="text-red-500/80 max-w-md mx-auto">
              No pudimos conectar con la base de datos de Supabase. Es posible que el proyecto esté pausado por inactividad. 
              Por favor, reactiva el proyecto desde el panel de Supabase.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No encontramos productos que coincidan con tu búsqueda.</p>
            <Link href="/" className="inline-block mt-6 px-6 py-3 bg-zinc-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-zinc-800 transition-colors">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
              const finalPriceUSD = hasDiscount 
                ? product.priceUSD * (1 - product.discountPercentage! / 100) 
                : product.priceUSD;
              const finalPriceARS = finalPriceUSD * dollarRate;

              return (
                <Link key={product.id} href={`/producto/${product.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-zinc-200">
                  <div className="aspect-[4/5] relative bg-zinc-100 overflow-hidden flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ShoppingBag size={40} className="text-zinc-300" />
                    )}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase rounded-sm z-10">
                        -{product.discountPercentage}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{product.brand}</p>
                    <h3 className="font-bold text-zinc-900 text-sm leading-tight mb-3 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-zinc-900">${finalPriceARS.toLocaleString('es-AR')}</p>
                      {hasDiscount && (
                        <p className="text-xs text-zinc-400 line-through">${(product.priceUSD * dollarRate).toLocaleString('es-AR')}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
