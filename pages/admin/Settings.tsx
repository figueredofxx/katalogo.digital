
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, showToast } from '../../components/ui/Components';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { User, Shield, CreditCard, LogOut, DollarSign, Check, Lock, Wallet, LayoutTemplate, Truck, Map, MapPin, Navigation, Plus, Trash2, Globe, Server, HelpCircle, CheckCircle } from 'lucide-react';
import { PaymentMethods, DeliveryConfig, DeliveryRegion } from '../../types';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { tenant, signOut, refreshTenant } = useAuth();
  const { updateTenantSettings } = useAdmin();
  const navigate = useNavigate();
  const [interestRate, setInterestRate] = useState(0);
  const [orderControlMode, setOrderControlMode] = useState<'kanban' | 'list' | 'kitchen'>('kanban');
  const [customDomain, setCustomDomain] = useState('');
  
  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
      pix: true,
      creditCard: true,
      debitCard: false,
      boleto: false,
      boletoInstallment: false
  });

  // Delivery State
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig>({
      mode: 'fixed',
      fixedPrice: 0,
      radiusConfig: {
          pricePerKm: 0,
          minPrice: 0,
          maxRadiusKm: 10,
          freeShippingThreshold: 0
      },
      regions: []
  });
  const [newRegion, setNewRegion] = useState({ name: '', price: '' });

  useEffect(() => {
    if (tenant) {
        setInterestRate(tenant.creditCardInterestRate || 0);
        setOrderControlMode(tenant.orderControlMode || 'kanban');
        setCustomDomain(tenant.customDomain || '');
        if (tenant.paymentMethods) {
            setPaymentMethods(tenant.paymentMethods);
        }
        if (tenant.deliveryConfig) {
            setDeliveryConfig(tenant.deliveryConfig);
        }
    }
  }, [tenant]);

  const handleSave = async () => {
    const { error } = await updateTenantSettings({
        creditCardInterestRate: interestRate,
        paymentMethods: paymentMethods,
        orderControlMode: orderControlMode,
        deliveryConfig: deliveryConfig,
        customDomain: customDomain // Save custom domain
    });
    
    if (!error) {
        await refreshTenant();
        showToast('Configurações salvas com sucesso!');
    } else {
        showToast('Erro ao salvar', 'error');
    }
  };

  const handleLogout = () => {
      showToast('Desconectando...', 'info');
      setTimeout(() => {
          signOut();
          navigate('/login');
      }, 500);
  };

  const togglePaymentMethod = (key: keyof PaymentMethods) => {
      setPaymentMethods(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- DELIVERY LOGIC ---
  const addRegion = () => {
      if (!newRegion.name || !newRegion.price) return;
      const region: DeliveryRegion = {
          id: Date.now().toString(),
          name: newRegion.name,
          price: parseFloat(newRegion.price),
          active: true
      };
      setDeliveryConfig(prev => ({
          ...prev,
          regions: [...(prev.regions || []), region]
      }));
      setNewRegion({ name: '', price: '' });
  };

  const removeRegion = (id: string) => {
      setDeliveryConfig(prev => ({
          ...prev,
          regions: prev.regions?.filter(r => r.id !== id)
      }));
  };

  if (!tenant) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Configurações</h1>
        <p className="text-gray-500 text-sm">Gerencie sua conta, logística e preferências.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - NAV/SECTIONS */}
          <div className="space-y-6 md:col-span-2">
              
              {/* Profile Section */}
              <section id="profile">
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                      <User size={16} />
                      <h3>Perfil</h3>
                  </div>
                  <Card className="p-6 space-y-4 bg-white border-gray-200">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                              {tenant.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-900">{tenant.name}</h4>
                              <p className="text-sm text-gray-500">{tenant.slug}.katalogo.digital</p>
                              <Badge variant="neutral" >Admin</Badge>
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input label="Nome da Empresa" value={tenant.name} disabled className="text-gray-900 bg-gray-50"/>
                      </div>
                  </Card>
              </section>

              {/* DOMAIN SETTINGS (NEW) */}
              <section id="domain">
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                      <Globe size={16} />
                      <h3>Domínio Próprio</h3>
                  </div>
                  <Card className="p-6 bg-white border-gray-200 space-y-6">
                      
                      {tenant.plan !== 'pro' ? (
                          <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 text-center space-y-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-500">
                                  <Lock size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-gray-900">Domínio Personalizado</h3>
                                  <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                                      Conecte seu próprio domínio (ex: www.sualoja.com.br) assinando o Plano Pro.
                                  </p>
                              </div>
                              <Button variant="primary" size="sm">Fazer Upgrade</Button>
                          </div>
                      ) : (
                          <>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Seu Domínio (com www)</label>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="www.suamarca.com.br"
                                        value={customDomain}
                                        onChange={e => setCustomDomain(e.target.value.toLowerCase())}
                                        icon={<Globe size={16} className="text-gray-400" />}
                                    />
                                    <Button variant="secondary" onClick={handleSave}>Verificar</Button>
                                </div>
                            </div>

                            {/* CNAME Instructions */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Server className="text-blue-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-blue-800">Como configurar?</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Acesse o painel onde comprou seu domínio (Registro.br, GoDaddy, etc) e crie uma entrada DNS do tipo CNAME.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-1 bg-white rounded-lg border border-blue-100 overflow-hidden text-sm">
                                    <div className="bg-blue-100/50 p-2 font-bold text-blue-800 border-b border-blue-100">Tipo</div>
                                    <div className="bg-blue-100/50 p-2 font-bold text-blue-800 border-b border-blue-100">Nome/Entrada</div>
                                    <div className="bg-blue-100/50 p-2 font-bold text-blue-800 border-b border-blue-100">Dados/Destino</div>
                                    
                                    <div className="p-2 text-gray-700">CNAME</div>
                                    <div className="p-2 text-gray-700">www</div>
                                    <div className="p-2 text-gray-700 font-mono select-all">katalogo.digital</div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                    <HelpCircle size={14} />
                                    <a href="#" className="underline hover:text-blue-800">Ler guia passo-a-passo</a>
                                </div>
                            </div>

                            {customDomain && (
                                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                    <CheckCircle size={16} />
                                    <span>Domínio salvo. A propagação pode levar até 24h.</span>
                                </div>
                            )}
                          </>
                      )}
                  </Card>
              </section>

              {/* Delivery / Logistics Section */}
              <section id="delivery">
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                      <Truck size={16} />
                      <h3>Logística de Entrega</h3>
                  </div>
                  <Card className="p-6 bg-white border-gray-200 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Card 1: Fixed */}
                          <div 
                              onClick={() => setDeliveryConfig({...deliveryConfig, mode: 'fixed'})}
                              className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                                  deliveryConfig.mode === 'fixed' 
                                  ? 'border-gray-900 bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2' 
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                              }`}
                          >
                              <Map size={24} />
                              <span className="text-sm font-bold">Taxa Fixa</span>
                          </div>
                          
                          {/* Card 2: Radius (Automated) */}
                          <div 
                              onClick={() => setDeliveryConfig({...deliveryConfig, mode: 'radius'})}
                              className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all relative overflow-hidden ${
                                  deliveryConfig.mode === 'radius' 
                                  ? 'border-blue-600 bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2' 
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                              }`}
                          >
                              <div className="absolute top-1 right-1 bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Auto</div>
                              <Navigation size={24} />
                              <span className="text-sm font-bold">KM Inteligente</span>
                          </div>

                          {/* Card 3: Regions */}
                          <div 
                              onClick={() => setDeliveryConfig({...deliveryConfig, mode: 'regions'})}
                              className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                                  deliveryConfig.mode === 'regions' 
                                  ? 'border-purple-600 bg-purple-600 text-white ring-2 ring-purple-600 ring-offset-2' 
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                              }`}
                          >
                              <MapPin size={24} />
                              <span className="text-sm font-bold">Por Região</span>
                          </div>
                      </div>

                      {/* CONTENT AREA BASED ON MODE */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          
                          {deliveryConfig.mode === 'fixed' && (
                              <div className="animate-fade-in">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor Único da Entrega</label>
                                  <div className="relative max-w-xs">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                                      <input 
                                          type="number" 
                                          className="w-full pl-9 pr-3 h-10 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                                          value={deliveryConfig.fixedPrice}
                                          onChange={e => setDeliveryConfig({...deliveryConfig, fixedPrice: parseFloat(e.target.value)})}
                                      />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">Este valor será cobrado para todos os pedidos com entrega, independente da distância.</p>
                              </div>
                          )}

                          {deliveryConfig.mode === 'radius' && (
                              <div className="space-y-4 animate-fade-in">
                                  <div className="flex items-center gap-2 mb-2 text-blue-700 bg-blue-50 p-2 rounded-lg text-xs font-medium">
                                      <Navigation size={14} />
                                      Cálculo automático: Taxa Mínima + (Distância x Preço/KM)
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Taxa Mínima (Base)</label>
                                          <Input 
                                              type="number" 
                                              placeholder="0.00" 
                                              value={deliveryConfig.radiusConfig?.minPrice}
                                              onChange={e => setDeliveryConfig({
                                                  ...deliveryConfig, 
                                                  radiusConfig: { ...deliveryConfig.radiusConfig!, minPrice: parseFloat(e.target.value) }
                                              })}
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço por KM</label>
                                          <Input 
                                              type="number" 
                                              placeholder="0.00" 
                                              value={deliveryConfig.radiusConfig?.pricePerKm}
                                              onChange={e => setDeliveryConfig({
                                                  ...deliveryConfig, 
                                                  radiusConfig: { ...deliveryConfig.radiusConfig!, pricePerKm: parseFloat(e.target.value) }
                                              })}
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Raio Máximo (KM)</label>
                                          <Input 
                                              type="number" 
                                              placeholder="Ex: 15" 
                                              value={deliveryConfig.radiusConfig?.maxRadiusKm}
                                              onChange={e => setDeliveryConfig({
                                                  ...deliveryConfig, 
                                                  radiusConfig: { ...deliveryConfig.radiusConfig!, maxRadiusKm: parseFloat(e.target.value) }
                                              })}
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-green-600 uppercase mb-1">Frete Grátis Acima de</label>
                                          <Input 
                                              type="number" 
                                              placeholder="Ex: 200.00" 
                                              value={deliveryConfig.radiusConfig?.freeShippingThreshold || ''}
                                              onChange={e => setDeliveryConfig({
                                                  ...deliveryConfig, 
                                                  radiusConfig: { ...deliveryConfig.radiusConfig!, freeShippingThreshold: parseFloat(e.target.value) }
                                              })}
                                          />
                                      </div>
                                  </div>
                              </div>
                          )}

                          {deliveryConfig.mode === 'regions' && (
                              <div className="space-y-4 animate-fade-in">
                                  <div className="flex gap-2 items-end">
                                      <div className="flex-1">
                                          <Input 
                                              label="Nome (Cidade ou Bairro)" 
                                              placeholder="Ex: Centro"
                                              value={newRegion.name}
                                              onChange={e => setNewRegion({...newRegion, name: e.target.value})}
                                          />
                                      </div>
                                      <div className="w-24">
                                          <Input 
                                              label="Valor (R$)" 
                                              placeholder="0.00"
                                              type="number"
                                              value={newRegion.price}
                                              onChange={e => setNewRegion({...newRegion, price: e.target.value})}
                                          />
                                      </div>
                                      <Button onClick={addRegion} className="mb-[1px] aspect-square p-0 w-10 flex items-center justify-center">
                                          <Plus size={20} />
                                      </Button>
                                  </div>

                                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                      {(!deliveryConfig.regions || deliveryConfig.regions.length === 0) && (
                                          <div className="p-4 text-center text-xs text-gray-400">Nenhuma região cadastrada.</div>
                                      )}
                                      {deliveryConfig.regions?.map((region) => (
                                          <div key={region.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                              <span className="text-sm font-medium text-gray-700">{region.name}</span>
                                              <div className="flex items-center gap-3">
                                                  <span className="text-sm font-bold text-gray-900">R$ {region.price.toFixed(2)}</span>
                                                  <button 
                                                      onClick={() => removeRegion(region.id)}
                                                      className="text-gray-400 hover:text-red-500 transition-colors"
                                                  >
                                                      <Trash2 size={16} />
                                                  </button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  </Card>
              </section>

              {/* Order Settings Section */}
              <section id="orders">
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                      <LayoutTemplate size={16} />
                      <h3>Gestão de Pedidos</h3>
                  </div>
                  <Card className="p-6 bg-white border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Modo de Visualização</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div 
                            onClick={() => setOrderControlMode('kanban')}
                            className={`p-4 border rounded-xl cursor-pointer transition-all ${orderControlMode === 'kanban' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                              <div className="mb-2 font-bold text-sm text-gray-900">Kanban (Cards)</div>
                              <div className="flex gap-1">
                                  <div className="w-1/3 h-10 bg-white border border-gray-200 rounded"></div>
                                  <div className="w-1/3 h-10 bg-white border border-gray-200 rounded"></div>
                                  <div className="w-1/3 h-10 bg-white border border-gray-200 rounded"></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Ideal para fluxo visual.</p>
                          </div>

                          <div 
                            onClick={() => setOrderControlMode('list')}
                            className={`p-4 border rounded-xl cursor-pointer transition-all ${orderControlMode === 'list' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                              <div className="mb-2 font-bold text-sm text-gray-900">Lista (Tabela)</div>
                              <div className="space-y-1">
                                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Compacto para muitos pedidos.</p>
                          </div>

                          <div 
                            onClick={() => setOrderControlMode('kitchen')}
                            className={`p-4 border rounded-xl cursor-pointer transition-all ${orderControlMode === 'kitchen' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                              <div className="mb-2 font-bold text-sm text-gray-900">Cozinha (KDS)</div>
                              <div className="grid grid-cols-2 gap-1">
                                  <div className="h-8 bg-yellow-100 rounded border border-yellow-200"></div>
                                  <div className="h-8 bg-green-100 rounded border border-green-200"></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Focado em produção/preparo.</p>
                          </div>
                      </div>
                  </Card>
              </section>

              {/* Finance Section */}
              <section id="finance">
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                      <DollarSign size={16} />
                      <h3>Financeiro</h3>
                  </div>
                  <Card className="p-6 space-y-6 bg-white border-gray-200">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Juros do Cartão (Mensal %)</label>
                          <p className="text-xs text-gray-500 mb-2">Usada para simular o parcelamento na loja.</p>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            step="0.01"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                            icon={<span className="text-gray-500 font-bold">%</span>}
                          />
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-2 mb-4">
                              <Wallet size={18} className="text-gray-500"/>
                              <h4 className="font-bold text-sm text-gray-900">Métodos de Pagamento Aceitos</h4>
                          </div>
                          
                          <div className="space-y-3">
                              {[
                                  { key: 'pix', label: 'PIX' },
                                  { key: 'creditCard', label: 'Cartão de Crédito' },
                                  { key: 'debitCard', label: 'Cartão de Débito' },
                                  { key: 'boleto', label: 'Boleto Bancário' },
                                  { key: 'boletoInstallment', label: 'Boleto Parcelado' },
                              ].map((method) => (
                                  <div key={method.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                      <span className="text-sm font-medium text-gray-700">{method.label}</span>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={paymentMethods[method.key as keyof PaymentMethods]} 
                                            onChange={() => togglePaymentMethod(method.key as keyof PaymentMethods)}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                      </label>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </Card>
              </section>

              {/* Security */}
              <section id="security">
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                      <Shield size={16} />
                      <h3>Segurança</h3>
                  </div>
                  <Card className="p-6 space-y-4 bg-white border-gray-200">
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-3">
                              <Lock className="text-gray-400" size={20} />
                              <div>
                                  <span className="block font-medium text-gray-900 text-sm">Senha de acesso</span>
                                  <span className="block text-xs text-gray-500">Última alteração há 3 meses</span>
                              </div>
                          </div>
                          <Button variant="outline" size="sm">Alterar</Button>
                      </div>
                  </Card>
              </section>
          </div>

          {/* RIGHT COLUMN - PLAN & ACTIONS */}
          <div className="space-y-6">
              <section>
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                      <CreditCard size={16} />
                      <h3>Assinatura</h3>
                  </div>
                  <Card className="p-6 bg-white border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                          <div>
                              <h2 className="text-xl font-bold text-gray-900">
                                  {tenant.plan === 'pro' ? 'Plano Ilimitado' : 'Plano Básico'}
                              </h2>
                              <p className="text-xs text-gray-500">Renovação Mensal</p>
                          </div>
                          <Badge variant={tenant.plan === 'pro' ? 'success' : 'neutral'}>
                              {tenant.plan === 'pro' ? 'ATIVO' : 'GRÁTIS'}
                          </Badge>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                          {tenant.plan === 'pro' ? (
                            <>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check size={16} className="text-green-600" />
                                    <span>Produtos Ilimitados</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check size={16} className="text-green-600" />
                                    <span>Domínio Próprio</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check size={16} className="text-green-600" />
                                    <span>Relatórios Avançados</span>
                                </div>
                            </>
                          ) : (
                             <>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check size={16} className="text-green-600" />
                                    <span>Até 20 Produtos</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Lock size={16} />
                                    <span>Sem Relatórios</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Lock size={16} />
                                    <span>Sem Domínio Próprio</span>
                                </div>
                             </>
                          )}
                      </div>

                      <Button variant={tenant.plan === 'pro' ? 'secondary' : 'primary'} size="sm" className="w-full">
                          {tenant.plan === 'pro' ? 'Gerenciar Cobrança' : 'Fazer Upgrade'}
                      </Button>
                  </Card>
              </section>

              <div className="pt-4 border-t border-gray-200">
                  <Button onClick={handleSave} className="w-full mb-3" size="lg">Salvar Tudo</Button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full text-red-600 hover:bg-red-50 p-3 rounded-xl text-sm font-medium transition-colors"
                  >
                      <LogOut size={16} />
                      Sair da conta
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Settings;
