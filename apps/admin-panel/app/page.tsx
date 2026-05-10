import prisma from "database";
import { updateDollarRate, createProduct, deleteProduct } from "./actions";

export const revalidate = 0;

export default async function AdminDashboard() {
  let settings = null;
  let products: any[] = [];
  let errorMsg = null;
  
  try {
    settings = await prisma.storeSettings.findUnique({ where: { id: "global" }});
    products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }});
  } catch (e: any) {
    errorMsg = e.message + "\n" + e.stack;
  }
  
  if (errorMsg) {
    return <main className="p-10 text-red-500"><h1 className="text-2xl font-bold">CRASH LOG:</h1><pre className="whitespace-pre-wrap">{errorMsg}</pre></main>;
  }
  return (
    <main className="max-w-6xl mx-auto p-6 text-gray-800">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">JC Import - Admin</h1>
        <a href="/ventas" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Dashboard de Ventas
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Cotización del Dólar</h2>
            <form action={updateDollarRate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Valor actual en ARS</label>
                <input 
                  type="number" 
                  name="rate" 
                  step="0.01"
                  defaultValue={settings?.dollarRate ?? 1000} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition">
                Actualizar Cotización
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              Al actualizar este valor, todos los precios en la Landing Page se recalcularán automáticamente.
            </p>
          </div>
        </div>

        {/* Products Panel */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar Nuevo Producto</h2>
            <form action={createProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre del Perfume</label>
                <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ej. Asad" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Marca</label>
                <input type="text" name="brand" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ej. Lattafa" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Precio (USD)</label>
                <input type="number" name="priceUSD" step="0.01" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ej. 45" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Descuento (%) - Opcional</label>
                <input type="number" name="discountPercentage" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ej. 15" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Imagen del Producto (Opcional)</label>
                <input type="file" accept="image/*" name="imageFile" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" />
              </div>
              <div className="sm:col-span-2 mt-2">
                <button type="submit" className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition">
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>

          {/* Product List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Catálogo Actual ({products.length})</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {products.length === 0 && <li className="p-6 text-center text-gray-500">No hay productos.</li>}
              {products.map(product => (
                <li key={product.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name} <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-2">{product.brand}</span></p>
                      <p className="text-sm text-gray-600">USD {product.priceUSD} {product.discountPercentage ? <span className="text-red-500 ml-2">(-{product.discountPercentage}%)</span> : ""}</p>
                    </div>
                  </div>
                  <form action={async () => {
                    "use server";
                    await deleteProduct(product.id);
                  }}>
                    <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md transition">
                      Eliminar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
