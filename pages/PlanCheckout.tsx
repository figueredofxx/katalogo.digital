
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, showToast } from '../components/ui/Components';
import { CheckCircle, ShieldCheck, Rocket, AlertTriangle, Mail } from 'lucide-react';
import { pb } from '../lib/pocketbase';

const PlanCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      if (loading) return;
      setLoading(true);
      setErrorMsg(null);

      try {
        console.log("Iniciando ativação (PB) para:", registrationData.email);
        
        let userId = '';

        // 1. Criar Usuário no PocketBase
        try {
            const user = await pb.collection('users').create({
                email: registrationData.email,
                password: registrationData.password,
                passwordConfirm: registrationData.password, // Requer campo confirm
                name: registrationData.storeName // Opcional, nome do dono
            });
            userId = user.id;
        } catch (createError: any) {
            // Se já existe (email duplicado)
            if (createError.data?.email) {
                // Tenta logar para ver se a senha bate
                try {
                    const authData = await pb.collection('users').authWithPassword(registrationData.email, registrationData.password);
                    userId = authData.record.id;
                } catch (loginError) {
                    throw new Error("Este email já existe e a senha está incorreta.");
                }
            } else {
                throw createError;
            }
        }

        // 2. Autenticar para ter permissão de criar Tenant
        if (!pb.authStore.isValid) {
            await pb.collection('users').authWithPassword(registrationData.email, registrationData.password);
        }

        // 3. Verificar se já tem Tenant
        const existingTenants = await pb.collection('tenants').getList(1, 1, {
            filter: `owner = "${userId}"`
        });

        if (existingTenants.total > 0) {
            showToast('Você já possui uma loja! Redirecionando...', 'success');
            navigate('/admin/dashboard');
            return;
        }

        // 4. Criar Tenant
        const baseSlug = registrationData.slug || registrationData.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const uniqueSlug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

        await pb.collection('tenants').create({
            name: registrationData.storeName,
            slug: uniqueSlug,
            owner: userId,
            plan: registrationData.plan,
            primary_color: '#4B0082',
            subscription_status: 'trial'
        });

        showToast('Loja ativada com sucesso!', 'success');
        localStorage.removeItem('temp_register_data');
        
        setTimeout(() => {
            navigate('/admin/dashboard');
        }, 1000);

      } catch (error: any) {
          console.error("Erro Activation:", error);
          const msg = error.message || 'Erro ao processar.';
          setErrorMsg(msg);
          showToast(msg, 'error');
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
                <p className="text-gray-500 mt-2">Ative sua conta agora e comece a vender.</p>
            </div>
            <Card className="p-8 shadow-xl bg-white border border-gray-100">
                <div className="mb-6 flex flex-col items-center">
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-2 mb-2">
                        <Mail size={12} />
                        {registrationData.email}
                    </div>
                </div>
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left flex gap-3 animate-fade-in">
                        <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-red-700">{errorMsg}</p>
                    </div>
                )}
                <Button onClick={handleActivation} size="full" isLoading={loading}>
                    Confirmar e Começar Grátis
                </Button>
            </Card>
        </div>
    </div>
  );
};

export default PlanCheckout;
