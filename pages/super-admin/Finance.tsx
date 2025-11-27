
import React from 'react';
import { Card, Button, Badge } from '../../components/ui/Components';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';
import { DollarSign, Download, TrendingUp, CreditCard } from 'lucide-react';

const Finance: React.FC = () => {
  const { transactions, metrics } = useSuperAdmin();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financeiro SaaS</h1>
            <p className="text-gray-500">Controle de receita, transações e gateways.</p>
        </div>
        <Button variant="outline">
            <Download size={16} className="mr-2" />
            Exportar Relatório
        </Button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border border-gray-200 bg-white">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                  <DollarSign size={18} />
                  <span className="text-sm font-medium uppercase">Receita Mensal (MRR)</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">R$ {metrics.mrr.toFixed(2)}</div>
              <div className="text-xs text-green-600 font-medium mt-2">+15% este mês</div>
          </Card>
          <Card className="p-6 border border-gray-200 bg-white">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                  <TrendingUp size={18} />
                  <span className="text-sm font-medium uppercase">Total Transacionado (Lojas)</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">R$ 1.2M</div>
              <p className="text-xs text-gray-400 mt-2">Volume bruto (GMV) dos clientes</p>
          </Card>
          <Card className="p-6 border border-gray-200 bg-white">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                  <CreditCard size={18} />
                  <span className="text-sm font-medium uppercase">Próximo Payout</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">R$ 8.450</div>
              <p className="text-xs text-gray-400 mt-2">Previsão para 15/03</p>
          </Card>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Últimas Transações (Assinaturas)</h2>
          <Card className="overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Cliente</th>
                        <th className="px-6 py-3">Plano</th>
                        <th className="px-6 py-3">Valor</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Data</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-gray-500 text-xs">{tx.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{tx.tenantName}</td>
                            <td className="px-6 py-4">{tx.plan}</td>
                            <td className="px-6 py-4 font-medium">R$ {tx.amount.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                {tx.status === 'paid' ? (
                                    <Badge variant="success">PAGO</Badge>
                                ) : (
                                    <Badge variant="danger">FALHA</Badge>
                                )}
                            </td>
                            <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </Card>
      </div>
    </div>
  );
};

export default Finance;
