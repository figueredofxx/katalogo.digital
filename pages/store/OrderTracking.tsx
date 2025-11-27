
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from '../../components/ui/Components';
import { useTenant } from '../../hooks/useTenant';
import { Order, OrderStatus } from '../../types';
import { CheckCircle, Clock, Package, Truck, Home, Loader } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { trackOrder, tenant } = useTenant(); 
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadOrder = async () => {
          if (orderId) {
              const data = await trackOrder(orderId);
              setOrder(data);
          }
          setLoading(false);
      };
      loadOrder();
  }, [orderId]);

  const sendToWhatsapp = () => {
      if (!order || !tenant) return;
      
      const methodLabels: Record<string, string> = {
        pix: 'PIX', credit_card: 'Cartão de Crédito', debit_card: 'Débito', 
        boleto: 'Boleto', boleto_installment: 'Boleto Parcelado', money: 'Dinheiro'
      };

      const trackingLink = window.location.href;

      let message = `*PEDIDO #${order.id.slice(0,6)}*\n`;
      message += `--------------------------------\n`;
      order.items.forEach(item => {
        message += `${item.quantity}x ${item.name}\n`;
      });
      message += `--------------------------------\n`;
      message += `*TOTAL: R$ ${order.total.toFixed(2)}*\n\n`;
      message += `*CLIENTE*\n`;
      message += `Nome: ${order.customerName}\n`;
      
      if (order.deliveryMethod === 'delivery' && order.address) {
          message += `Endereço: ${order.address.street}, ${order.address.number} - ${order.address.neighborhood}\n`;
      } else {
          message += `Retirada na Loja\n`;
      }
      
      message += `Pagamento: ${methodLabels[order.paymentMethod]}\n`;
      if (order.notes) message += `Obs: ${order.notes}\n`;
      
      message += `\nLink do Pedido: ${trackingLink}`;

      const url = `https://wa.me/${tenant.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader className="animate-spin text-blue-600" /></div>;

  if (!order) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="p-8 text-center max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pedido não encontrado</h2>
              <p className="text-gray-500">Verifique se o link está correto.</p>
          </Card>
      </div>
  );

  const steps: { status: OrderStatus; label: string; icon: any }[] = [
      { status: 'pending', label: 'Recebido', icon: Clock },
      { status: 'preparing', label: 'Em Preparo', icon: Package },
      { status: 'ready', label: 'Pronto', icon: CheckCircle },
      { status: 'shipping', label: 'Saiu p/ Entrega', icon: Truck },
      { status: 'delivered', label: 'Entregue', icon: Home },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  // Se status 'confirmed' (legado ou transição), mapear para index 0 visualmente ou 1
  const visualStepIndex = order.status === 'confirmed' ? 0 : currentStepIndex;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-lg mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Acompanhar Pedido</h1>
                <p className="text-gray-500">#{order.id.slice(0,8)}</p>
            </div>

            {/* WhatsApp Call To Action */}
            <Card className="p-4 bg-green-50 border-green-100 flex flex-col items-center text-center space-y-3">
                <div className="text-sm text-green-800 font-medium">
                    Seu pedido foi salvo! Envie para a loja confirmar.
                </div>
                <Button onClick={sendToWhatsapp} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-md">
                    <WhatsAppIcon className="mr-2 w-5 h-5" /> Enviar no WhatsApp
                </Button>
            </Card>

            {/* Status Card */}
            <Card className="p-6 bg-white shadow-lg border-0">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status Atual</p>
                        <h2 className="text-xl font-bold text-blue-600">
                            {order.status === 'confirmed' ? 'Confirmado' : steps.find(s => s.status === order.status)?.label}
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total</p>
                        <h2 className="text-xl font-bold text-gray-900">R$ {order.total.toFixed(2)}</h2>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 py-2">
                    {steps.map((step, idx) => {
                        const isCompleted = idx <= visualStepIndex;
                        const isCurrent = idx === visualStepIndex;
                        
                        // Find timeline timestamp if exists
                        const event = order.timeline.find(e => e.status === step.status);
                        
                        return (
                            <div key={step.status} className={`relative flex items-center gap-4 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`absolute -left-[25px] w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white z-10 ${
                                    isCompleted ? 'border-blue-600' : 'border-gray-300'
                                }`}>
                                    {isCompleted && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                
                                <div className={`p-3 rounded-xl ${isCurrent ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                                    <step.icon size={20} />
                                </div>
                                
                                <div>
                                    <p className={`font-bold text-sm ${isCurrent ? 'text-blue-700' : 'text-gray-900'}`}>{step.label}</p>
                                    {event && <p className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6 bg-white">
                <h3 className="font-bold text-gray-900 mb-4">Resumo da Compra</h3>
                <div className="space-y-3">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                            <span className="font-medium text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                {order.notes && (
                     <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                         <strong>Obs:</strong> {order.notes}
                     </div>
                )}
            </Card>
            
            <Button variant="secondary" size="full" onClick={() => window.location.href = `https://wa.me/55${tenant?.whatsappNumber || ''}`}>
                Falar com a Loja
            </Button>
        </div>
    </div>
  );
};

export default OrderTracking;
