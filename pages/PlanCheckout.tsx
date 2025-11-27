
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, showToast } from '../components/ui/Components';
import { CheckCircle, ShieldCheck, Rocket } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PlanCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  useEffect(() => {
      const data = localStorage.getItem('temp_register_data');
      if (!data) {
          navigate('/register');
          return;
      }
      setRegistrationData(JSON.parse(data));
  }, [navigate]);

  if (!registrationData) return null;

  const handleActivation = async () => {
      setLoading(true);

      try {
        // 1. Criar Usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: registrationData.email,
            password: registrationData.password,
            options: {
                data: {
                    store_name: registrationData.storeName
                }
            }
        });

        if (authError) throw authError;

        if (authData.user) {
            // 2. Criar a Loja (Tenant) em modo TRIAL
            const tempSlug = registrationData.slug || 
                             registrationData.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

            // Calcular data de fim do trial (Hoje + 7 dias)
            const trialEndsAt = new Date();
            trialEndsAt.setDate(trialEndsAt.getDate() + 7);

            const { error: tenantError } = await supabase.from('tenants').insert({
                user_id: authData.user.id,
                name: registrationData.storeName,
                slug: tempSlug,
                plan: registrationData.plan,
                email: registrationData.email,
                subscription_status: 'trial', // MODO DE TESTE
                trial_ends_at: trialEndsAt.toISOString(),
                payment_methods_json: { pix: true, creditCard: true, money: true },
                delivery_config: { mode: 'fixed', fixedPrice: 0 }
            });

            if (tenantError) {
                console.error("Erro ao criar loja:", tenantError);
                // Mesmo com erro, tentamos seguir para o login ou mostrar erro
                throw new Error("Falha ao configurar loja. Tente novamente.");
            }
        }

        showToast('Loja criada! Aproveite seus 7 dias grátis.', 'success');
        
        // Limpar dados temporários
        localStorage.removeItem('temp_register_data');
        
        navigate('/login');

      } catch (error: any) {
          console.error(error);
          showToast(error.message || 'Erro ao processar criação da conta.', 'error');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
            
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Rocket size={40} className="text-green-600" />
            </div>

            <div>
                <h2 className="text-3xl font-bold text-gray-900">Quase lá!</h2>
                <p className="text-gray-500 mt-2">Ative sua conta agora e comece a vender em minutos.</p>
            </div>
            
            <Card className="p-8 shadow-xl bg-white border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Seu pacote de boas-vindas inclui:</h3>
                
                <ul className="space-y-4 text-left mb-8">
                    <li className="flex items-center gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <span className="text-gray-700">7 Dias de acesso total (Plano {registrationData.plan === 'pro' ? 'Pro' : 'Básico'})</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <span className="text-gray-700">Loja virtual instantânea</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <span className="text-gray-700">Sem cobrança automática hoje</span>
                    </li>
                </ul>

                <Button onClick={handleActivation} size="full" isLoading={loading}>
                    Confirmar e Começar Grátis
                </Button>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                   <ShieldCheck size={14} />
                   <span>Ambiente seguro e criptografado</span>
                </div>
            </Card>
        </div>
    </div>
  );
};

export default PlanCheckout;
    