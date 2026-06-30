'use client';

import { useState } from 'react';
import SideDrawer from './SideDrawer';
import VentasContent from './VentasContent';
import StatsContent from './StatsContent';
import { Plus, Trash2, ExternalLink, DollarSign, LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut } from 'lucide-react';
import Link from 'next/link';
import { updateDollarRate, deleteProduct } from '@/app/actions';

interface AdminContentProps {
  initialProducts: any[];
  initialDollarRate: number;
  initialSales: any[];
}

type Tab = 'Dashboard' | 'Inventario' | 'Ventas' | 'Estadísticas';

export default function AdminContent({ initialProducts, initialDollarRate, initialSales }: AdminContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localDollar, setLocalDollar] = useState(initialDollarRate.toString());

  const handleUpdateDollar = async () => {
    const val = parseFloat(localDollar);
    if (!isNaN(val) && val > 0) {
      const formData = new FormData();
      formData.append('rate', val.toString());
      await updateDollarRate(formData);
      alert('Cotización actualizada a ARS ' + val);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este perfume?')) {
      await deleteProduct(id);
    }
  };

  const navItems = [
    { name: 'Dashboard' as Tab, icon: LayoutDashboard },
    { name: 'Inventario' as Tab, icon: Package },
    { name: 'Ventas' as Tab, icon: ShoppingCart },
    { name: 'Estadísticas' as Tab, icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 flex flex-col justify-between">
                <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Total Productos</span>
                <p className="text-4xl font-black text-zinc-900 mt-2">{initialProducts.length}</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-100 md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <DollarSign size={28} />
                </div>
                <div className="flex-1 w-full">
                  <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Cotización Dólar (ARS)</span>
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="number" 
                      value={localDollar}
                      onChange={(e) => setLocalDollar(e.target.value)}
                      className="border border-zinc-200 rounded-xl p-3 w-full max-w-[200px] outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-zinc-800"
                    />
                    <button 
                      onClick={handleUpdateDollar}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Recent Items */}
            <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
              <div className="p-6 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
                <h2 className="text-xl font-bold text-zinc-900">Productos Recientes</h2>
                <button onClick={() => setActiveTab('Inventario')} className="text-sm font-bold text-blue-600 hover:underline">Ver todo</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {initialProducts.slice(0, 4).map(p => (
                  <div key={p.id} className="border border-zinc-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
                    <div className="w-full h-32 mb-4 rounded-lg bg-zinc-50 overflow-hidden flex items-center justify-center">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} className="w-full h-full object-contain" alt={p.name} />
                      ) : (
                        <Package size={32} className="text-zinc-200" />
                      )}
                    </div>
                    <p className="font-bold text-zinc-900 truncate">{p.name}</p>
                    <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">{p.brand}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'Inventario':
        return (
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Gestión de Stock</h2>
              <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Activo</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Producto</th>
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Marca</th>
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Precio (USD)</th>
                    <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {initialProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-zinc-50/50 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg border border-zinc-100 overflow-hidden flex items-center justify-center bg-zinc-50">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                            ) : (
                              <Package size={20} className="text-zinc-200" />
                            )}
                          </div>
                          <span className="font-bold text-zinc-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-5 text-zinc-500 font-medium">{product.brand}</td>
                      <td className="p-5 font-bold text-zinc-900">${product.priceUSD}</td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Ventas':
        return <VentasContent products={initialProducts} sales={initialSales} dollarRate={initialDollarRate} />;

      case 'Estadísticas':
        return <StatsContent products={initialProducts} sales={initialSales} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-950 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-zinc-900">
          <h2 className="text-xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-lg shadow-green-500/20">
              JC
            </div>
            JC IMPORT
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === item.name 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 translate-x-1' 
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
              }`}
            >
              <item.icon size={18} className={activeTab === item.name ? 'text-white' : 'text-zinc-600'} />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-zinc-900">
          <button className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300 transition-all">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Premium Banner */}
      <div className="bg-yellow-500 py-1.5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black">
          Premium Admin Dashboard — Actualización Activada
        </p>
      </div>

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-zinc-950 tracking-tight">{activeTab}</h1>
                <Link href="http://localhost:3000" className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                  Ver Sitio Público
                </Link>
              </div>
              <p className="text-zinc-500 font-medium">Gestiona tu negocio con precisión y estilo.</p>
            </div>
            
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-zinc-950 hover:bg-zinc-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:shadow-zinc-900/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-xs"
            >
              <Plus size={20} className="text-green-500" />
              Gestionar Catálogo
            </button>
          </div>

          {renderContent()}
        </div>
      </main>

      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
