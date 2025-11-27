
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, showToast, Drawer } from '../../components/ui/Components';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../contexts/AuthContext';
import { Order, OrderStatus } from '../../types';
import { Clock, Phone, MapPin, Truck, CheckCircle, Package, AlertCircle, ChefHat, ShoppingBag, LayoutList, Columns } from 'lucide-react';

const Orders: React.FC = () => {
  const { tenant } = useAuth();
  const { orders, updateOrderStatus, loading } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [now, setNow] = useState(Date.now());
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);

  // Atualiza o cronômetro a cada minuto
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
      const { error } = await updateOrderStatus(orderId, newStatus);
      if (error) showToast('Erro ao atualizar status', 'error');
      else showToast('Status atualizado!', 'success');
  };

  const getElapsedTime = (dateString: string) => {
      const diff = Math.floor((now - new Date(dateString).getTime()) / 60000);
      if (diff < 60) return `${diff} min`;
      const hours = Math.floor(diff / 60);
      return `${hours}h ${diff % 60}min`;
  };

  // --- DRAG AND DROP HANDLERS ---
  const onDragStart = (e: React.DragEvent, orderId: string) => {
      setDraggedOrderId(orderId);
      e.dataTransfer.setData('text/plain', orderId);
      e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetStatus: OrderStatus) => {
      e.preventDefault();
      const orderId = e.dataTransfer.getData('text/plain');
      if (orderId && draggedOrderId === orderId) {
          handleStatusChange(orderId, targetStatus);
      }
      setDraggedOrderId(null);
  };

  // Definição das Colunas do Kanban
  const columns: { id: string; label: string; status: OrderStatus[]; color: string; icon: any }[] = [
      { id: 'new', label: 'Novos', status: ['pending'], color: 'border-blue-500 bg-blue-50', icon: AlertCircle },
      { id: 'kitchen', label: 'Na Cozinha', status: ['confirmed', 'preparing'], color: 'border-orange-500 bg-orange-50', icon: ChefHat },
      { id: 'ready', label: 'Pronto / Embalado', status: ['ready'], color: 'border-green-500 bg-green-50', icon: Package },
      { id: 'delivery', label: 'Em Rota', status: ['shipping'], color: 'border-indigo-500 bg-indigo-50', icon: Truck },
      { id: 'done', label: 'Entregues', status: ['delivered'], color: 'border-gray-400 bg-gray-50', icon: CheckCircle },
  ];

  if (loading) return <div className="p-8">Carregando pedidos...</div>;

  const mode = tenant?.orderControlMode || 'kanban';

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {mode === 'list' ? 'Lista de Pedidos' : 'Cozinha & Delivery'}
            </h1>
            <p className="text-gray-500 text-sm">
                {mode === 'list' ? 'Visualização compacta para gestão rápida.' : 'Gerencie o fluxo visualmente.'}
            </p>
        </div>
        <div className="flex gap-2">
            <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                Tempo Real
            </span>
        </div>
      </div>

      {mode === 'list' ? (
          // --- LIST VIEW MODE ---
          <Card className="flex-1 overflow-hidden bg-white border border-gray-200">
              <div className="overflow-x-auto h-full">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs sticky top-0 z-10">
                          <tr>
                              <th className="px-6 py-3">ID / Tempo</th>
                              <th className="px-6 py-3">Cliente</th>
                              <th className="px-6 py-3">Itens</th>
                              <th className="px-6 py-3">Total</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Ação</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {orders.map(order => (
                              <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                  <td className="px-6 py-4">
                                      <div className="font-mono font-bold">#{order.id.slice(0,4)}</div>
                                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                          <Clock size={10} /> {getElapsedTime(order.createdAt)}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="font-medium text-gray-900">{order.customerName}</div>
                                      <div className="text-xs text-gray-500">{order.customerPhone}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                      {order.items.length} itens
                                      <div className="text-xs text-gray-400 truncate max-w-[150px]">
                                          {order.items.map(i => i.name).join(', ')}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 font-bold text-gray-900">
                                      R$ {order.total.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4">
                                      <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'canceled' ? 'danger' : 'warning'}>
                                          {order.status.toUpperCase()}
                                      </Badge>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <Button size="xs" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                                          Detalhes
                                      </Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </Card>
      ) : (
          // --- KANBAN VIEW MODE ---
          <div className="flex-1 overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-[1200px] h-full">
                  {columns.map(col => {
                      const colOrders = orders.filter(o => col.status.includes(o.status));
                      
                      return (
                          <div 
                            key={col.id} 
                            className="flex-1 min-w-[280px] max-w-[320px] flex flex-col h-full rounded-xl bg-gray-100/50 border border-transparent transition-colors"
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, col.status[0])}
                          >
                              {/* Column Header */}
                              <div className={`p-3 rounded-t-xl border-b border-gray-200 flex justify-between items-center ${col.color.split(' ')[1]}`}>
                                  <div className="flex items-center gap-2 font-bold text-gray-700">
                                      <col.icon size={18} />
                                      {col.label}
                                  </div>
                                  <span className="bg-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">{colOrders.length}</span>
                              </div>

                              {/* Cards Container */}
                              <div className="flex-1 p-2 space-y-3 overflow-y-auto">
                                  {colOrders.length === 0 && (
                                      <div className="h-20 flex items-center justify-center text-gray-300 text-xs italic border-2 border-dashed border-gray-200 rounded-lg m-2">
                                          Arraste aqui
                                      </div>
                                  )}
                                  
                                  {colOrders.map(order => (
                                      <Card 
                                        key={order.id} 
                                        draggable
                                        onDragStart={(e) => onDragStart(e, order.id)}
                                        className={`p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing bg-white relative group ${draggedOrderId === order.id ? 'opacity-50' : ''}`}
                                        onClick={() => setSelectedOrder(order)}
                                      >
                                          {/* Card Header: ID & Timer */}
                                          <div className="flex justify-between items-start mb-2">
                                              <span className="font-mono text-xs font-bold text-gray-500">#{order.id.slice(0,4)}</span>
                                              <div className={`flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded ${
                                                  getElapsedTime(order.createdAt).includes('h') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                              }`}>
                                                  <Clock size={10} />
                                                  {getElapsedTime(order.createdAt)}
                                              </div>
                                          </div>

                                          {/* Customer */}
                                          <div className="mb-2">
                                              <h4 className="font-bold text-gray-900 text-sm leading-tight">{order.customerName}</h4>
                                              {order.deliveryMethod === 'delivery' ? (
                                                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                                                      <MapPin size={10} />
                                                      <span className="truncate max-w-[180px]">
                                                          {order.address?.neighborhood || 'Entrega'}
                                                      </span>
                                                  </div>
                                              ) : (
                                                  <div className="flex items-center gap-1 text-[10px] text-orange-600 font-bold mt-0.5">
                                                      <ShoppingBag size={10} /> Retirada
                                                  </div>
                                              )}
                                          </div>

                                          {/* Items Summary (First 2) */}
                                          <div className="text-xs text-gray-600 mb-3 space-y-1 bg-gray-50 p-2 rounded">
                                              {order.items.slice(0, 3).map((item, idx) => (
                                                  <div key={idx} className="flex justify-between">
                                                      <span><span className="font-bold">{item.quantity}x</span> {item.name}</span>
                                                  </div>
                                              ))}
                                              {order.items.length > 3 && <div className="text-[10px] text-gray-400 italic">e mais {order.items.length - 3} itens...</div>}
                                          </div>

                                          {/* Quick Actions (Hover Only) */}
                                          <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                              {col.id === 'new' && (
                                                  <Button size="xs" className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={() => handleStatusChange(order.id, 'preparing')}>
                                                      Aceitar
                                                  </Button>
                                              )}
                                              {col.id === 'kitchen' && (
                                                  <Button size="xs" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusChange(order.id, 'ready')}>
                                                      Pronto
                                                  </Button>
                                              )}
                                              {col.id === 'ready' && (
                                                  <Button size="xs" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleStatusChange(order.id, 'shipping')}>
                                                      Enviar
                                                  </Button>
                                              )}
                                              {col.id === 'delivery' && (
                                                  <Button size="xs" className="w-full bg-gray-800 hover:bg-gray-900 text-white" onClick={() => handleStatusChange(order.id, 'delivered')}>
                                                      Concluir
                                                  </Button>
                                              )}
                                          </div>
                                      </Card>
                                  ))}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}

      {/* Detail Drawer */}
      <Drawer 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title={`Pedido #${selectedOrder?.id.slice(0,8)}`}
      >
          {selectedOrder && (
              <div className="space-y-6">
                  {/* Info Header */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{selectedOrder.customerName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} /> {selectedOrder.customerPhone}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-bold text-gray-500 uppercase">Endereço</p>
                          {selectedOrder.deliveryMethod === 'delivery' ? (
                              <p className="text-sm mt-1">
                                  {selectedOrder.address?.street}, {selectedOrder.address?.number} <br/>
                                  {selectedOrder.address?.neighborhood}, {selectedOrder.address?.city}
                              </p>
                          ) : (
                              <Badge variant="warning">Retirada no Balcão</Badge>
                          )}
                      </div>
                  </div>

                  {/* Items Full List */}
                  <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <ShoppingBag size={18} /> Itens
                      </h4>
                      <div className="space-y-2">
                          {selectedOrder.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                                  <div className="flex items-center gap-3">
                                      <div className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded font-bold text-sm">
                                          {item.quantity}
                                      </div>
                                      <span className="text-sm font-medium">{item.name}</span>
                                  </div>
                                  <span className="text-sm font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                          ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                          <span className="font-bold">Total</span>
                          <span className="font-bold text-xl text-green-600">R$ {selectedOrder.total.toFixed(2)}</span>
                      </div>
                  </div>

                  {selectedOrder.notes && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-sm">
                          <strong>Observação:</strong> {selectedOrder.notes}
                      </div>
                  )}

                  {/* Manual Actions */}
                  <div className="pt-4 space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase">Ações Manuais</p>
                      <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(selectedOrder.id, 'canceled')}>
                              Cancelar Pedido
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => window.open(`https://wa.me/${selectedOrder.customerPhone}`, '_blank')}>
                              WhatsApp Cliente
                          </Button>
                      </div>
                  </div>
              </div>
          )}
      </Drawer>
    </div>
  );
};

export default Orders;
