
import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../../types';
import { Button, Card, QuantitySelector, showToast, Input, Select, Textarea, Drawer } from '../../components/ui/Components';
import { Search, ShoppingBag, ChevronLeft, MapPin, CreditCard, User, ArrowRight, Loader, DollarSign } from 'lucide-react';
import { useTenant } from '../../hooks/useTenant';
import { useNavigate, useLocation } from 'react-router-dom';

// --- ICONS ---
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// --- PAYMENT ICONS ---
const PixIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z"/>
        <path d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z"/>
    </svg>
);

const CardIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} strokeLinecap="round" strokeLinejoin="round">
        <rect width="22" height="14" x="1" y="5" rx="2" ry="2" />
        <line x1="1" x2="23" y1="10" y2="10" />
    </svg>
);

const BarcodeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5v14" /><path d="M8 5v14" /><path d="M12 5v14" /><path d="M17 5v14" /><path d="M21 5v14" />
    </svg>
);

// --- STORE TYPES ---
type ViewState = 'home' | 'product' | 'cart' | 'checkout';

interface CheckoutForm {
  name: string;
  phone: string;
  deliveryMethod: 'delivery' | 'pickup';
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  paymentMethod: 'pix' | 'credit_card' | 'debit_card' | 'boleto' | 'boleto_installment' | 'money';
  notes: string;
}

interface StoreFrontProps {
    subdomain?: string;
}

// --- MAIN COMPONENT ---
const StoreFront: React.FC<StoreFrontProps> = ({ subdomain }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant, products, categories, loading, error, createOrder } = useTenant(subdomain);

  const [view, setView] = useState<ViewState>('home');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInstallmentDrawerOpen, setIsInstallmentDrawerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
      if (categories.length > 0 && !activeCategory) {
          setActiveCategory(categories[0].id);
      }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (tenant) {
        document.documentElement.style.setProperty('--primary-color', tenant.primaryColor);
        document.title = `${tenant.name} - Loja Virtual`;
    }
  }, [tenant]);

  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    phone: '',
    deliveryMethod: 'delivery',
    zipCode: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    complement: '',
    paymentMethod: 'pix',
    notes: ''
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const navigateTo = (newView: ViewState) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('product');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`${quantity}x ${product.name} adicionado!`);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + ((item.promoPrice || item.price) * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, zipCode: value }));
    if (value.length === 8) {
        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setFormData(prev => ({ ...prev, street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf, zipCode: value }));
            }
        } catch (error) {} finally { setLoadingCep(false); }
    }
  };

  const handleCheckoutSubmit = async () => {
    if (!formData.name || !formData.phone) return showToast('Preencha nome e telefone.', 'error');
    if (!tenant) return;

    setIsProcessing(true);

    try {
        // 1. Create Order in Backend (or Mock) to get ID
        const { data: order, error } = await createOrder({
            customerName: formData.name,
            customerPhone: formData.phone,
            deliveryMethod: formData.deliveryMethod,
            address: formData.deliveryMethod === 'delivery' ? {
                street: formData.street, number: formData.number, neighborhood: formData.neighborhood,
                city: formData.city, state: formData.state, zipCode: formData.zipCode
            } : undefined,
            items: cart,
            total: cartTotal,
            paymentMethod: formData.paymentMethod,
            notes: formData.notes
        });

        if (error) throw error;

        // 2. Clear Cart and Redirect to Tracking
        setCart([]);
        const orderId = order?.id || 'new';
        navigate(`/track/${orderId}`);

    } catch (err) {
        showToast('Erro ao processar pedido. Tente novamente.', 'error');
    } finally {
        setIsProcessing(false);
    }
  };

  const calculateInstallments = (price: number, rate: number = 0) => {
    const installments = [];
    installments.push({ count: 1, value: price, total: price });
    for (let i = 2; i <= 12; i++) {
        const totalValue = rate > 0 ? price * (1 + (rate / 100)) : price;
        installments.push({ count: i, value: totalValue / i, total: totalValue });
    }
    return installments;
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader className="animate-spin"/></div>;
  if (error || !tenant) return <div className="min-h-screen flex justify-center items-center">Loja não encontrada</div>;

  const availableMethods = [
      { value: 'pix', label: 'PIX', active: tenant.paymentMethods?.pix ?? true, icon: <PixIcon className="w-4 h-4"/> },
      { value: 'credit_card', label: 'Crédito', active: tenant.paymentMethods?.creditCard ?? true, icon: <CardIcon className="w-4 h-4"/> },
      { value: 'debit_card', label: 'Débito', active: tenant.paymentMethods?.debitCard ?? false, icon: <CardIcon className="w-4 h-4"/> },
      { value: 'boleto', label: 'Boleto', active: tenant.paymentMethods?.boleto ?? false, icon: <BarcodeIcon className="w-4 h-4"/> },
      { value: 'boleto_installment', label: 'Boleto Parc.', active: tenant.paymentMethods?.boletoInstallment ?? false, icon: <BarcodeIcon className="w-4 h-4"/> },
      { value: 'money', label: 'Dinheiro', active: true, icon: <DollarSign className="w-4 h-4" /> },
  ].filter(m => m.active);

  // --- SUB-RENDER FUNCTIONS ---
  
  const renderHomeView = () => (
    <div className="animate-fade-in pb-24">
      <div className="h-48 md:h-64 relative bg-gray-900">
        <img src={tenant.bannerUrl} className="w-full h-full object-cover opacity-60" />
        <div className="absolute top-4 right-4 z-20">
             <button 
                onClick={() => navigate(location.pathname.replace(/\/$/, '') + '/account')}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full transition-all flex items-center gap-2 px-4"
             >
                 <User size={18} />
                 <span className="text-sm font-medium">Meus Pedidos</span>
             </button>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
           <div className="max-w-5xl mx-auto w-full flex items-end gap-4">
              <img src={tenant.logoUrl} className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white object-cover" />
              <div className="text-white mb-2">
                  <h1 className="text-2xl font-bold leading-tight">{tenant.name}</h1>
                  <p className="text-sm opacity-90 flex items-center gap-1"><MapPin size={12} /> {tenant.address || 'Brasil'}</p>
              </div>
           </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* Search & Filters */}
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="O que procura?" 
                className="w-full pl-10 pr-4 h-11 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-1 focus:ring-gray-900 focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            activeCategory === cat.id 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        )}
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products
                .filter(p => (!activeCategory || p.categoryId === activeCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(product => (
                <div 
                    key={product.id} 
                    onClick={() => handleProductClick(product)}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col h-full"
                >
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                        <img src={product.imageUrl} className="w-full h-full object-cover" />
                        {product.promoPrice && <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">PROMO</div>}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-snug mb-1">{product.name}</h3>
                        <div className="mt-auto pt-2 flex items-center justify-between">
                            <div className="flex flex-col">
                                {product.promoPrice ? (
                                    <>
                                        <span className="text-[10px] text-gray-400 line-through">R$ {product.price.toFixed(2)}</span>
                                        <span className="font-bold text-gray-900 text-sm">R$ {product.promoPrice.toFixed(2)}</span>
                                    </>
                                ) : (
                                    <span className="font-bold text-gray-900 text-sm">R$ {product.price.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderProductDetailView = () => {
    if (!selectedProduct) return null;
    const finalPrice = selectedProduct.promoPrice || selectedProduct.price;
    const installments = calculateInstallments(finalPrice, tenant.creditCardInterestRate || 0);
    return (
        <div className="bg-white min-h-screen animate-fade-in pb-24">
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 h-12 flex items-center justify-between">
                <button onClick={() => navigateTo('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
                <span className="font-semibold text-gray-900 text-sm">Detalhes</span>
                <div className="w-8"/>
            </div>
            <div className="max-w-2xl mx-auto">
                <div className="aspect-square md:aspect-video w-full bg-gray-100"><img src={selectedProduct.imageUrl} className="w-full h-full object-cover" /></div>
                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h1>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-[var(--primary-color)]">R$ {finalPrice.toFixed(2)}</span>
                        {selectedProduct.promoPrice && <span className="text-sm text-gray-400 line-through">R$ {selectedProduct.price.toFixed(2)}</span>}
                    </div>
                    
                    <button onClick={() => setIsInstallmentDrawerOpen(true)} className="text-xs text-gray-500 underline flex items-center gap-1 mb-6"><CreditCard size={12}/> Ver parcelas</button>

                    {/* Payment Methods Visual */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {availableMethods.map(m => (
                            <div key={m.value} className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600">
                                {m.icon}
                                {m.label}
                            </div>
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                <div className="max-w-2xl mx-auto flex gap-3">
                     <Button variant="secondary" className="flex-1" onClick={() => { addToCart(selectedProduct); navigateTo('home'); }}>Adicionar</Button>
                     <Button className="flex-[2]" onClick={() => { addToCart(selectedProduct); navigateTo('cart'); }}>Comprar</Button>
                </div>
            </div>
            <Drawer isOpen={isInstallmentDrawerOpen} onClose={() => setIsInstallmentDrawerOpen(false)} title="Parcelamento">
                <div className="space-y-2 p-2">
                    {installments.map((inst) => (
                        <div key={inst.count} className="flex justify-between text-sm py-2 border-b border-gray-50">
                            <span>{inst.count}x</span>
                            <div className="text-right"><span className="font-bold">R$ {inst.value.toFixed(2)}</span><div className="text-xs text-gray-400">Total: R$ {inst.total.toFixed(2)}</div></div>
                        </div>
                    ))}
                </div>
            </Drawer>
        </div>
    )
  };

  const renderCartView = () => (
    <div className="min-h-screen bg-gray-50 animate-fade-in pb-32">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 h-12 flex items-center gap-3">
            <button onClick={() => navigateTo('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
            <span className="font-bold text-gray-900">Carrinho ({cartCount})</span>
        </div>
        <div className="max-w-2xl mx-auto p-4 space-y-3">
            {cart.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3">
                    <img src={item.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                        <div className="flex justify-between items-end mt-2">
                            <span className="font-bold text-sm">R$ {((item.promoPrice || item.price) * item.quantity).toFixed(2)}</span>
                            <QuantitySelector quantity={item.quantity} onIncrease={() => updateCartQuantity(item.id, 1)} onDecrease={() => updateCartQuantity(item.id, -1)} />
                        </div>
                    </div>
                </div>
            ))}
            {cart.length > 0 && (
                <Card className="p-4 mt-4">
                    <div className="flex justify-between items-center"><span className="font-bold">Total</span><span className="font-bold text-xl text-[var(--primary-color)]">R$ {cartTotal.toFixed(2)}</span></div>
                </Card>
            )}
        </div>
        {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                <Button onClick={() => navigateTo('checkout')} size="full">Continuar <ArrowRight size={16} className="ml-2"/></Button>
            </div>
        )}
    </div>
  );

  const renderCheckoutView = () => (
    <div className="min-h-screen bg-gray-50 animate-fade-in pb-32">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 h-12 flex items-center gap-3">
            <button onClick={() => navigateTo('cart')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
            <span className="font-bold text-gray-900">Finalizar</span>
        </div>
        <div className="max-w-2xl mx-auto p-4 space-y-5">
            <Card className="p-4 space-y-4">
                <h3 className="font-bold text-sm uppercase text-gray-500">Seus Dados</h3>
                <Input label="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <Input label="WhatsApp" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" />
            </Card>
            <Card className="p-4 space-y-4">
                <h3 className="font-bold text-sm uppercase text-gray-500">Entrega</h3>
                <div className="flex gap-2">
                    <button onClick={() => setFormData({...formData, deliveryMethod: 'delivery'})} className={`flex-1 p-2 rounded-lg border text-sm font-medium ${formData.deliveryMethod === 'delivery' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>Entrega</button>
                    <button onClick={() => setFormData({...formData, deliveryMethod: 'pickup'})} className={`flex-1 p-2 rounded-lg border text-sm font-medium ${formData.deliveryMethod === 'pickup' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>Retirada</button>
                </div>
                {formData.deliveryMethod === 'delivery' && (
                    <>
                        <div className="relative"><Input label="CEP" value={formData.zipCode} onChange={handleCepChange} maxLength={9} />{loadingCep && <Loader size={12} className="absolute right-3 top-9 animate-spin"/>}</div>
                        <div className="flex gap-2"><Input label="Rua" value={formData.street} className="flex-[2]" readOnly /><Input label="Nº" value={formData.number} className="flex-1" onChange={e => setFormData({...formData, number: e.target.value})} /></div>
                        <Input label="Bairro" value={formData.neighborhood} readOnly />
                    </>
                )}
            </Card>
            <Card className="p-4 space-y-4">
                <h3 className="font-bold text-sm uppercase text-gray-500">Pagamento</h3>
                <Select 
                    options={availableMethods.map(m => ({ label: m.label, value: m.value }))} 
                    value={formData.paymentMethod} 
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})} 
                />
                <Textarea label="Obs" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} />
            </Card>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                 <Button onClick={handleCheckoutSubmit} size="full" className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-none" isLoading={isProcessing}>
                    <WhatsAppIcon className="mr-2 w-5 h-5" /> Enviar Pedido (R$ {cartTotal.toFixed(2)})
                 </Button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {view === 'home' && renderHomeView()}
      {view === 'product' && renderProductDetailView()}
      {view === 'cart' && renderCartView()}
      {view === 'checkout' && renderCheckoutView()}
      {cartCount > 0 && view === 'home' && (
          <div className="fixed bottom-4 left-4 right-4 z-40 max-w-5xl mx-auto">
              <button onClick={() => navigateTo('cart')} className="w-full bg-[var(--primary-color)] text-white h-12 px-6 rounded-2xl shadow-xl flex items-center justify-center animate-slide-up">
                  <div className="flex items-center gap-3"><div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{cartCount}</div><span className="font-semibold text-sm">Ver Sacola</span></div>
                  <span className="font-bold text-sm ml-auto">R$ {cartTotal.toFixed(2)}</span>
              </button>
          </div>
      )}
    </div>
  );
};

export default StoreFront;
