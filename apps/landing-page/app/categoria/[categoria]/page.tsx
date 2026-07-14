import prisma from "database";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export const revalidate = 0;

export default async function CategoriaPage({
  params,
}: {
  params: { categoria: string };
}) {
  const categoriaName = params.categoria === 'masculinas' 
    ? 'Fragancias Masculinas' 
    : params.categoria === 'femeninas'
      ? 'Fragancias Femeninas'
      : params.categoria === 'unisex'
        ? 'Fragancias Unisex'
        : 'Catálogo de Fragancias';

  // Fetch all products for now, since gender/category isn't in the schema
  let products: any[] = [];
  let dollarRate = 1000;
  let dbError = false;

  try {
    products = await prisma.product.findMany({
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
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-6 group text-sm font-semibold tracking-widest uppercase">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver
        </Link>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 mb-8">
          {categoriaName}
        </h1>
        
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
            <p className="text-zinc-500 text-lg">No hay productos disponibles en esta categoría en este momento.</p>
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
