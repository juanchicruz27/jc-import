'use client';

import { useState } from 'react';
import { createSale, updateSalePayment, deleteSale } from '@/app/actions';
import { ShoppingBag, User, DollarSign, Calendar, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface VentasContentProps {
  products: any[];
  sales: any[];
  dollarRate: number;
}

export default function VentasContent({ products, sales, dollarRate }: VentasContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalCollected = sales.reduce((acc, sale) => acc + sale.amountPaid, 0);
  const totalDebt = totalSales - totalCollected;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // We need to handle the productName if it's not a custom product
      const productId = formData.get('productId') as string;
      if (productId !== 'custom' && productId !== '') {
        const p = products.find(p => p.id === productId);
        if (p) {
          formData.set('productName', p.name);
        }
      }

      await createSale(formData);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert('Error al guardar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePayment = async (id: string, currentPaid: number) => {
    const newVal = prompt('Actualizar monto abonado:', currentPaid.toString());
    if (newVal !== null) {
      const val = parseFloat(newVal);
      if (!isNaN(val)) {
        const formData = new FormData();
        formData.append('saleId', id);
        formData.append('newAmountPaid', val.toString());
        await updateSalePayment(formData);
      }
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (confirm('¿Eliminar esta venta?')) {
      await deleteSale(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 border-l-4 border-l-blue-500">
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Ventas Históricas</p>
          <p className="text-3xl font-black text-zinc-900 mt-2">${totalSales.toLocaleString('es-AR')}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 border-l-4 border-l-green-500">
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Total Cobrado</p>
          <p className="text-3xl font-black text-green-600 mt-2">${totalCollected.toLocaleString('es-AR')}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 border-l-4 border-l-orange-500">
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Deuda Pendiente</p>
          <p className="text-3xl font-black text-orange-500 mt-2">${totalDebt.toLocaleString('es-AR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-950 text-white p-8 rounded-3xl shadow-xl sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShoppingBag className="text-green-500" size={24} />
              Registrar Venta
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Cliente</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input name="clientName" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="Nombre completo" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Producto</label>
                <select 
                  name="productId" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                  onChange={(e) => {
                    const val = e.target.value;
                    const priceInput = document.getElementById('sale-total-amount') as HTMLInputElement;
                    const manualInput = document.getElementById('manual-product-name') as HTMLInputElement;
                    
                    if (val === 'custom') {
                      priceInput.value = '';
                      manualInput.classList.remove('hidden');
                      manualInput.required = true;
                    } else if (val === '') {
                      priceInput.value = '';
                      manualInput.classList.add('hidden');
                      manualInput.required = false;
                    } else {
                      const p = products.find(p => p.id === val);
                      if (p) {
                        const price = p.priceUSD * (1 - (p.discountPercentage || 0)/100) * dollarRate;
                        priceInput.value = Math.round(price).toString();
                      }
                      manualInput.classList.add('hidden');
                      manualInput.required = false;
                    }
                  }}
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
                  ))}
                  <option value="custom">Otro / Manual</option>
                </select>
                <input id="manual-product-name" name="productName" type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-green-500 transition-all mt-2 hidden" placeholder="Nombre del producto manual" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Monto Total ($)</label>
                  <input id="sale-total-amount" name="totalAmount" type="number" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="0" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Abonado ($)</label>
                  <input name="amountPaid" type="number" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-green-500 transition-all text-green-400 font-bold" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Fecha</label>
                <input name="date" type="date" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-green-500 transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? 'Guardando...' : 'GUARDAR VENTA'}
              </button>
            </form>
          </div>
        </div>

        {/* Tabla de Ventas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="p-6 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-xl font-bold text-zinc-900">Registro de Operaciones</h2>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{sales.length} VENTAS</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fecha</th>
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cliente / Producto</th>
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Monto</th>
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Estado</th>
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-zinc-400 italic">No hay ventas registradas.</td>
                    </tr>
                  ) : (
                    sales.map(sale => {
                      const debt = sale.totalAmount - sale.amountPaid;
                      const isPaid = debt <= 0;
                      
                      return (
                        <tr key={sale.id} className="group hover:bg-zinc-50/50 transition-colors">
                          <td className="p-5 text-sm text-zinc-500 font-medium whitespace-nowrap">
                            {new Date(sale.date).toLocaleDateString('es-AR')}
                          </td>
                          <td className="p-5">
                            <p className="font-bold text-zinc-900">{sale.clientName}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{sale.productName}</p>
                          </td>
                          <td className="p-5 font-bold text-zinc-900">
                            ${sale.totalAmount.toLocaleString('es-AR')}
                          </td>
                          <td className="p-5">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                <CheckCircle2 size={12} /> Pagado
                              </span>
                            ) : sale.amountPaid === 0 ? (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                <AlertCircle size={12} /> Pendiente
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                <Clock size={12} /> Debe ${debt.toLocaleString('es-AR')}
                              </span>
                            )}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleUpdatePayment(sale.id, sale.amountPaid)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Actualizar Pago"
                              >
                                <DollarSign size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteSale(sale.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Eliminar"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
