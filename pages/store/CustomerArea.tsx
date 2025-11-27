
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, showToast, Badge } from '../../components/ui/Components';
import { useTenant } from '../../hooks/useTenant';
import { Order } from '../../types';
import { Phone, Package, ChevronRight, Search, LogOut } from 'lucide-react';

const CustomerArea: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { tenant, fetchCustomerOrders, loading } = useTenant(slug);
  
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Auto-login se já tiver salvo
  React.useEffect(() => {
      const savedPhone = localStorage.getItem(`customer_phone_${slug}`);
      if (savedPhone) {
          setPhone(savedPhone);
          handleLogin(savedPhone);
      }
  }, [slug]);

  const handleLogin = async (phoneNumber: string) => {
      setIsLoadingOrders(true);
      const results = await fetchCustomerOrders(phoneNumber);
      setOrders(results);
      setIsLoadingOrders(false);
      localStorage.setItem(`customer_phone_${slug}`, phoneNumber);
  };

  const handleLogout = () => {
      localStorage.removeItem(`customer_phone_${slug}`);
      setOrders(null);
      setPhone('');
  };

  const handleManualLogin = () => {
      if (phone.length < 8) return showToast('Digite um número válido', 'error');
      handleLogin(phone);
  };

  if (loading || !tenant) return <div className="p-8 text-center">Carregando loja...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 flex items-center justify-between">
            <h1 className="font-bold text-lg">Meus Pedidos</h1>
            {orders && (
                <button onClick={handleLogout} className="text-sm text-gray-500 flex items-center gap-1">
                    <LogOut size={14} /> Sair
                </button>
            )}
        </div>

        <div className="max-w-lg mx-auto p-4">
            {!orders ? (
                // --- LOGIN VIEW ---
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <Package size={32} className="text-gray-500" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Acompanhe seus pedidos</h2>
                        <p className="text-gray-500 mt-2 text-sm">Digite seu WhatsApp para ver seu histórico de compras nesta loja.</p>
                    </div>

                    <Card className="w-full p-6 space-y-4">
                        <Input 
                            label="Seu WhatsApp" 
                            placeholder="DDD + Número"
                            value={phone}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                            icon={<Phone size={18} className="text-gray-400" />}
                            type="tel"
                        />
                        <Button size="full" onClick={handleManualLogin} isLoading={isLoadingOrders}>
                            <Search size={18} className="mr-2" />
                            Buscar Pedidos
                        </Button>
                    </Card>
                </div>
            ) : (
                // --- DASHBOARD VIEW ---
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase">Logado como</p>
                            <p className="font-medium text-gray-900">{phone}</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-12 opacity-50">
                            <Package size={48} className="mx-auto mb-4" />
                            <p>Nenhum pedido encontrado para este número.</p>
                            <Button variant="outline" className="mt-4" onClick={() => navigate(`/store/${slug}`)}>
                                Ir às Compras
                            </Button>
                        </div>
                    ) : (
                        orders.map(order => (
                            <Card 
                                key={order.id} 
                                onClick={() => navigate(`/track/${order.id}`)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400">
                                        #{order.id.slice(0, 4)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="neutral">{new Date(order.createdAt).toLocaleDateString()}</Badge>
                                            <span className="font-bold text-sm">R$ {order.total.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {order.items.length} itens &bull; {order.status === 'pending' ? 'Pendente' : order.status === 'delivered' ? 'Entregue' : 'Em andamento'}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300" />
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default CustomerArea;
