'use client';

import { BarChart3, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

interface StatsContentProps {
  products: any[];
  sales: any[];
}

export default function StatsContent({ products, sales }: StatsContentProps) {
  const totalSalesVolume = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalCollected = sales.reduce((acc, sale) => acc + sale.amountPaid, 0);
  const totalDebt = totalSalesVolume - totalCollected;
  
  const uniqueClients = new Set(sales.map(s => s.clientName)).size;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Volumen Total" 
          value={`$${totalSalesVolume.toLocaleString('es-AR')}`} 
          icon={<TrendingUp size={24} />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Cobrado" 
          value={`$${totalCollected.toLocaleString('es-AR')}`} 
          icon={<DollarSign size={24} />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Clientes Únicos" 
          value={uniqueClients.toString()} 
          icon={<Users size={24} />} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Stock Items" 
          value={products.length.toString()} 
          icon={<Package size={24} />} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
          <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={24} />
            Desempeño Financiero
          </h3>
          <div className="space-y-6">
            <ProgressBar label="Eficiencia de Cobro" percentage={totalSalesVolume > 0 ? (totalCollected / totalSalesVolume) * 100 : 0} color="bg-green-500" />
            <ProgressBar label="Ratio de Deuda" percentage={totalSalesVolume > 0 ? (totalDebt / totalSalesVolume) * 100 : 0} color="bg-orange-500" />
          </div>
          
          <div className="mt-10 p-6 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <p className="text-sm text-zinc-500 leading-relaxed italic">
              "El ratio de eficiencia de cobro indica qué porcentaje del dinero total vendido ya está en tu bolsillo. Un ratio superior al 80% se considera saludable."
            </p>
          </div>
        </div>

        <div className="bg-zinc-950 text-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold mb-6">Próximos Pasos Recomendados</h3>
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">✓</div>
              <p className="text-sm text-zinc-400">Mantener el catálogo actualizado con las últimas fragancias de Lattafa y Afnan.</p>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-6 h-6 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">!</div>
              <p className="text-sm text-zinc-400">Contactar a los clientes con deudas pendientes superiores a 30 días.</p>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-6 h-6 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">+</div>
              <p className="text-sm text-zinc-400">Implementar sistema de preventa para lanzamientos exclusivos.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-5">
      <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-zinc-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  const safePercentage = isNaN(percentage) ? 0 : Math.min(100, Math.max(0, percentage));
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-zinc-700">{label}</span>
        <span className="text-sm font-black text-zinc-900">{safePercentage.toFixed(1)}%</span>
      </div>
      <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}
