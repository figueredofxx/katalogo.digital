import React from 'react';
import { Card, Badge } from '../../components/ui/Components';
import { useAdmin } from '../../hooks/useAdmin';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Loader } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { metrics, recentOrders, loading } = useAdmin();

  if (loading) return <div className="p-8 flex justify-center"><Loader className="animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Visão Geral</h1>
        <p className="text-gray-500 mt-1">Acompanhe o desempenho da sua loja em tempo real.</p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 bg-white border border-gray-200">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-gray-500 text-sm font-medium">{metric.label}</span>
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                  metric.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                  {metric.positive ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                  {metric.trend}
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 tracking-tight relative z-10">{metric.value}</div>
            
            <div className="absolute -right-4 -bottom-4 opacity-5 text-gray-900 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={100} />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders - Placeholder until Order Table exists */}
      {recentOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
               <div className="space-y-4">
                   <div className="flex items-center justify-between">
                       <h2 className="text-lg font-bold text-gray-900">Pedidos Recentes</h2>
                   </div>
                   <Card className="overflow-hidden bg-white border-gray-200">
                        {/* Table implementation */}
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Lista de pedidos será exibida aqui.
                        </div>
                   </Card>
               </div>
          </div>
      ) : (
          <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
              Nenhum pedido recente.
          </div>
      )}
    </div>
  );
};

export default Dashboard;