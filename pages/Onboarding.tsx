
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, showToast, Select } from '../components/ui/Components';
import { useAdmin } from '../hooks/useAdmin';
import { Store, Phone, CheckCircle, ArrowRight } from 'lucide-react';

// Wizard Steps
// 1. Identidade (Nome, Slug)
// 2. Contato (WhatsApp)
// 3. Concluir

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateTenantSettings } = useAdmin();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
      storeName: '',
      slug: '',
      whatsapp: '',
      segment: 'moda'
  });

  const handleNext = async () => {
      if (step === 1) {
          if (!data.storeName || !data.slug) return showToast('Preencha os campos', 'error');
          setStep(2);
      } else if (step === 2) {
          if (!data.whatsapp) return showToast('Informe o WhatsApp', 'error');
          handleFinish();
      }
  };

  const handleFinish = async () => {
      setLoading(true);
      // Salvar dados no backend
      await updateTenantSettings({
          name: data.storeName,
          slug: data.slug,
          whatsappNumber: data.whatsapp,
          // Em um app real, setaria flag onboarding_completed = true
      });
      
      setLoading(false);
      setStep(3); // Success Screen
      
      setTimeout(() => {
          navigate('/admin/dashboard');
      }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 shadow-xl">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
                <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            </div>

            {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Store size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Vamos configurar sua loja</h2>
                        <p className="text-gray-500">Defina o nome e o link que seus clientes usarão.</p>
                    </div>

                    <Input 
                        label="Nome da Loja" 
                        placeholder="Ex: Boutique da Ana"
                        value={data.storeName}
                        onChange={e => setData({...data, storeName: e.target.value})}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link da Loja</label>
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                            <input 
                                className="flex-1 py-3 px-4 bg-transparent border-none focus:ring-0 text-gray-900 font-bold text-right"
                                placeholder="nome-da-loja"
                                value={data.slug}
                                onChange={e => setData({...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                            />
                            <span className="pr-4 pl-1 text-gray-500 text-sm bg-gray-50 h-full flex items-center">.katalogo.digital</span>
                        </div>
                    </div>

                    <Select 
                        label="Segmento"
                        options={[
                            {label: 'Moda e Roupas', value: 'moda'},
                            {label: 'Eletrônicos', value: 'eletronicos'},
                            {label: 'Alimentação', value: 'food'},
                            {label: 'Outros', value: 'outros'},
                        ]}
                        value={data.segment}
                        onChange={e => setData({...data, segment: e.target.value})}
                    />

                    <Button onClick={handleNext} size="full" className="mt-4">
                        Próximo Passo
                        <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Phone size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Atendimento</h2>
                        <p className="text-gray-500">Para onde devemos enviar os pedidos?</p>
                    </div>

                    <Input 
                        label="WhatsApp (com DDD)" 
                        placeholder="11 99999-9999"
                        type="tel"
                        value={data.whatsapp}
                        onChange={e => setData({...data, whatsapp: e.target.value})}
                    />

                    <Button onClick={handleNext} size="full" isLoading={loading} className="mt-4">
                        Finalizar Configuração
                        <CheckCircle size={18} className="ml-2" />
                    </Button>
                    <button onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-500 hover:text-gray-900 py-2">
                        Voltar
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="text-center space-y-6 animate-fade-in py-8">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200 animate-bounce">
                        <CheckCircle size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Tudo pronto!</h2>
                        <p className="text-gray-500 mt-2">Sua loja foi criada com sucesso.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                        Redirecionando para o painel em instantes...
                    </div>
                </div>
            )}
        </Card>
    </div>
  );
};

export default Onboarding;
