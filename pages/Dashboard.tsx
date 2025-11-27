
import React from 'react';
import { Card, Badge, Button } from '../components/ui/Components';
import { KPI_METRICS, MOCK_CHATS } from '../constants';
import { ArrowUpRight, Calendar, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bom dia, Dra. Silva</h1>
          <p className="text-gray-500 text-sm">Aqui está o resumo da sua clínica hoje.</p>
        </div>
        <div className="flex gap-2">
            <Link to="/chat">
                <Button variant="outline" size="sm">Ver mensagens</Button>
            </Link>
            <Link to="/connection">
                <Button variant="primary" size="sm">Configurar Bot</Button>
            </Link>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {KPI_METRICS.map((metric, idx) => (
          <Card key={idx} className="p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-500 text-sm font-medium">{metric.label}</span>
              {metric.positive ? (
                <span className="flex items-center text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={12} className="mr-1" />
                  {metric.trend}
                </span>
              ) : (
                <span className="text-gray-400 text-xs">{metric.trend}</span>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Últimas Conversas</h3>
            <Link to="/chat" className="text-sm text-gray-500 hover:text-gray-900">Ver tudo</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_CHATS.slice(0, 4).map((chat) => (
              <div key={chat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                    {chat.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{chat.customerName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{chat.lastMessage}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <Badge variant={chat.status === 'Agendado' ? 'success' : chat.status === 'Pendente' ? 'warning' : 'neutral'}>
                     {chat.status}
                   </Badge>
                   <span className="text-[10px] text-gray-400">{chat.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions / Status */}
        <div className="space-y-6">
             <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Status do Sistema</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            WhatsApp
                        </span>
                        <span className="text-gray-900 font-medium">Conectado</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            IA Agente
                        </span>
                        <span className="text-gray-900 font-medium">Ativo</span>
                    </div>
                </div>
             </Card>

             <Card className="p-5 bg-gray-900 text-white">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold mb-1">Dica de hoje</h3>
                        <p className="text-gray-400 text-xs">Melhore a taxa de conversão respondendo em até 5min.</p>
                    </div>
                    <Clock size={20} className="text-gray-400" />
                </div>
                <Button size="sm" variant="secondary" className="w-full">
                    Ajustar tempo de resposta
                </Button>
             </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
