
import React from 'react';
import { Card, Button } from '../../components/ui/Components';
import { useAuth } from '../../contexts/AuthContext';
import { usePlanLimitations } from '../../hooks/usePlanLimitations';
import { Lock, TrendingUp, Calendar, Users, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reports: React.FC = () => {
  const { tenant } = useAuth();
  const { canViewReports } = usePlanLimitations();
  const navigate = useNavigate();

  if (!tenant) return null;

  if (!canViewReports) {
      return (
          <div className="h-[60vh] flex items-center justify-center animate-fade-in">
              <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="text-indigo-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Recurso Exclusivo Pro</h2>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                      Desbloqueie relatórios detalhados, métricas de crescimento, análise de vendas e exportação de dados com o plano Ilimitado.
                  </p>
                  <Button size="lg" className="w-full" onClick={() => navigate('/admin/settings')}>
                      Fazer Upgrade Agora
                  </Button>
                  <p className="text-xs text-gray-400 mt-4">Apenas R$ 49,90/mês</p>
              </div>
          </div>
      );
  }

  // TODO: Conectar com endpoint real de Analytics no futuro
  const topProducts = [
      { name: 'Camiseta Minimalista', sales: 145, percentage: 80 },
      { name: 'Jaqueta Bomber', sales: 98, percentage: 60 },
      { name: 'Relógio Smart', sales: 65, percentage: 40 },
      { name: 'Fone Bluetooth', sales: 42, percentage: 25 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Relatórios de Vendas</h1>
          <p className="text-gray-500 text-sm">Análise detalhada do período: <span className="font-semibold text-gray-900">Últimos 30 dias</span></p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm"><Calendar size={14} className="mr-2"/> Filtrar Data</Button>
            <Button size="sm">Exportar CSV</Button>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={16} /></div>
                  <span className="text-xs text-gray-500 font-medium uppercase">Receita Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">R$ 45.200</div>
              <div className="text-xs text-green-600 mt-1 font-medium">+12.5% vs mês anterior</div>
          </Card>

          <Card className="p-4 bg-white border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShoppingBag size={16} /></div>
                  <span className="text-xs text-gray-500 font-medium uppercase">Pedidos</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">340</div>
              <div className="text-xs text-green-600 mt-1 font-medium">+8.2% vs mês anterior</div>
          </Card>

          <Card className="p-4 bg-white border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Users size={16} /></div>
                  <span className="text-xs text-gray-500 font-medium uppercase">Visitantes</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">1,250</div>
              <div className="text-xs text-red-600 mt-1 font-medium">-2% vs mês anterior</div>
          </Card>

          <Card className="p-4 bg-white border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><TrendingUp size={16} /></div>
                  <span className="text-xs text-gray-500 font-medium uppercase">Ticket Médio</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">R$ 132,00</div>
              <div className="text-xs text-gray-400 mt-1 font-medium">Estável</div>
          </Card>
      </div>
      
      {/* Placeholder for Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Vendas por Período</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-sm">
                  Gráfico de Linha (Placeholder)
              </div>
          </Card>
          <Card className="p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Top Produtos</h3>
              <div className="space-y-4">
                  {topProducts.map((product, i) => (
                      <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">{product.name}</span>
                              <span className="text-gray-500">{product.sales} vendas</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${product.percentage}%` }}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>
      </div>
    </div>
  );
};

export default Reports;
