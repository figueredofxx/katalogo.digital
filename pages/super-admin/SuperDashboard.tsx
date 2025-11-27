
import React from 'react';
import { Card } from '../../components/ui/Components';
import { TrendingUp, Users, DollarSign, Activity, AlertCircle } from 'lucide-react';

const SuperDashboard: React.FC = () => {
  const metrics = [
    { label: 'MRR (Receita Mensal)', value: 'R$ 14.250', trend: '+18%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Lojas Ativas', value: '124', trend: '+12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Churn Rate', value: '1.2%', trend: '-0.4%', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Ticket Médio (ARPU)', value: 'R$ 42,00', trend: '+2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Visão Geral do Negócio</h1>
        <p className="text-gray-500">Acompanhe a saúde financeira e o crescimento do Katalogo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
            <Card key={idx} className="p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
                        <m.icon size={20} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.color.replace('text', 'bg')}/10 ${m.color}`}>
                        {m.trend}
                    </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{m.value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{m.label}</div>
            </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RECENT SIGNUPS */}
          <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-gray-900">Novas Lojas (Últimos 7 dias)</h3>
              <Card className="overflow-hidden border border-gray-100">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                          <tr>
                              <th className="px-6 py-3">Loja</th>
                              <th className="px-6 py-3">Plano</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3">Data</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {[1,2,3,4].map((i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900">Loja Exemplo {i}</td>
                                  <td className="px-6 py-4">
                                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Pro</span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Ativo</span>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500">Hoje</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </Card>
          </div>

          {/* SYSTEM HEALTH */}
          <div className="space-y-4">
               <h3 className="font-bold text-gray-900">Saúde do Sistema</h3>
               <Card className="p-6 space-y-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-gray-700">API Server</span>
                        </div>
                        <span className="text-xs text-green-600 font-bold">99.9% Uptime</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-gray-700">Database</span>
                        </div>
                        <span className="text-xs text-green-600 font-bold">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-sm font-medium text-gray-700">Filas de WhatsApp</span>
                        </div>
                        <span className="text-xs text-yellow-600 font-bold">Moderate Load</span>
                    </div>

                    <div className="p-3 bg-indigo-50 rounded-lg flex items-start gap-3 text-indigo-800 text-xs">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p>O volume de mensagens aumentou 20% na última hora. Monitore a latência.</p>
                    </div>
               </Card>
          </div>
      </div>
    </div>
  );
};

export default SuperDashboard;
