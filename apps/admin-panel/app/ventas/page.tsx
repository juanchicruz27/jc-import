import prisma from "database";
import { createSale, updateSalePayment, deleteSale } from "../actions";
import Link from "next/link";

export const revalidate = 0;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount);
}

export default async function VentasDashboard() {
  let sales: any[] = [];
  let products: any[] = [];
  let errorMsg = null;

  try {
    sales = await prisma.sale.findMany({ orderBy: { date: "desc" }});
    products = await prisma.product.findMany({ orderBy: { name: "asc" }});
  } catch (e: any) {
    errorMsg = e.message + "\n" + e.stack;
  }
  
  if (errorMsg) {
    return <main className="p-10 text-red-500"><h1 className="text-2xl font-bold">CRASH LOG:</h1><pre className="whitespace-pre-wrap">{errorMsg}</pre></main>;
  }

  const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalCollected = sales.reduce((acc, sale) => acc + sale.amountPaid, 0);
  const totalDebt = totalSales - totalCollected;
  
  return (
    <main className="max-w-6xl mx-auto p-6 text-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas</h1>
          <p className="text-gray-500 mt-1">Control de ingresos y cuentas por cobrar</p>
        </div>
        <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
          Volver a Productos
        </Link>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Ventas Históricas</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Cobrado</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-gray-500 mb-1">En la Calle (Deuda)</p>
          <p className="text-3xl font-bold text-orange-500">{formatCurrency(totalDebt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Nueva Venta */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Registrar Venta</h2>
            <form action={createSale} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cliente</label>
                <input type="text" name="clientName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Nombre del cliente" />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Producto</label>
                <select 
                  name="productId" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Seleccionar un producto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} data-name={p.name} data-price={p.discountPercentage ? p.priceUSD * (1 - p.discountPercentage/100) : p.priceUSD}>
                      {p.name} - {formatCurrency(p.discountPercentage ? (p.priceUSD * (1 - p.discountPercentage/100)) : p.priceUSD)}
                    </option>
                  ))}
                  <option value="custom">Otro (Manual)</option>
                </select>
              </div>

              {/* Campos ocultos/dinámicos según producto */}
              <input type="hidden" name="productName" id="hiddenProductName" />
              <div className="mt-2">
                <input type="text" placeholder="Escribir nombre manual..." className="w-full px-3 py-2 border border-gray-300 rounded-lg hidden" id="manualProductName" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Monto Total ($)</label>
                <input type="number" step="0.01" name="totalAmount" id="totalAmount" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Monto Abonado ($)</label>
                <input type="number" step="0.01" name="amountPaid" id="amountPaid" required className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-green-50" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Fecha</label>
                <input type="date" name="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition mt-4">
                Guardar Venta
              </button>
            </form>
            
            <script dangerouslySetInnerHTML={{__html: `
              document.querySelector('select[name="productId"]').addEventListener('change', function(e) {
                const manualInput = document.getElementById('manualProductName');
                const option = e.target.options[e.target.selectedIndex];
                const inputName = document.getElementById('hiddenProductName');
                const inputPrice = document.getElementById('totalAmount');
                
                if (e.target.value === 'custom') {
                  manualInput.classList.remove('hidden');
                  manualInput.required = true;
                  inputName.value = manualInput.value;
                  inputPrice.value = '';
                } else if (e.target.value) {
                  manualInput.classList.add('hidden');
                  manualInput.required = false;
                  inputName.value = option.getAttribute('data-name') || '';
                  inputPrice.value = option.getAttribute('data-price') || '';
                } else {
                  manualInput.classList.add('hidden');
                  manualInput.required = false;
                  inputName.value = '';
                  inputPrice.value = '';
                }
              });
              
              document.getElementById('manualProductName').addEventListener('input', function(e) {
                document.getElementById('hiddenProductName').value = e.target.value;
              });
            `}} />
          </div>
        </div>

        {/* Tabla de Control */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Registro de Operaciones</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                    <th className="px-6 py-3 font-medium">Fecha</th>
                    <th className="px-6 py-3 font-medium">Cliente</th>
                    <th className="px-6 py-3 font-medium">Producto</th>
                    <th className="px-6 py-3 font-medium">Monto</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No hay ventas registradas todavía.
                      </td>
                    </tr>
                  )}
                  {sales.map(sale => {
                    const diff = sale.totalAmount - sale.amountPaid;
                    const isFullyPaid = diff <= 0;
                    const isPendingTotal = sale.amountPaid <= 0;
                    
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {sale.date.toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {sale.clientName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {sale.productName}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(sale.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isFullyPaid ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              Pagado
                            </span>
                          ) : isPendingTotal ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Pendiente Total
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                              Debe: {formatCurrency(diff)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <div className="flex justify-end gap-2 items-center">
                            {!isFullyPaid && (
                              <form action={updateSalePayment} className="flex items-center gap-1">
                                <input type="hidden" name="saleId" value={sale.id} />
                                <input 
                                  type="number" 
                                  step="0.01" 
                                  name="newAmountPaid" 
                                  defaultValue={sale.amountPaid} 
                                  className="w-20 px-2 py-1 text-xs border border-gray-300 rounded text-right"
                                  title="Actualizar monto abonado"
                                />
                                <button type="submit" className="text-blue-600 hover:text-blue-900 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition text-xs">
                                  Guardar
                                </button>
                              </form>
                            )}
                            <form action={deleteSale.bind(null, sale.id)}>
                              <button type="submit" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition" title="Eliminar Venta">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
