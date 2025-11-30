
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, showToast } from '../components/ui/Components';
import { CheckCircle, ShieldCheck, Rocket, AlertTriangle, Mail } from 'lucide-react';
import { api, handleApiError } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const PlanCheckout: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
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
        // Envia tudo para o backend Node.js
        // O backend vai criar User e Tenant numa transação
        const response = await api.post('/auth/register', {
            email: registrationData.email,
            password: registrationData.password,
            storeName: registrationData.storeName,
            slug: registrationData.slug,
            plan: registrationData.plan
        });

        const { token, user } = response.data;
        await signIn(token, user);

        showToast('Loja ativada com sucesso!', 'success');
        localStorage.removeItem('temp_register_data');
        
        setTimeout(() => {
            navigate('/admin/dashboard');
        }, 1000);

      } catch (error: any) {
          const { error: msg } = handleApiError(error);
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
                <p className="text-gray-500 mt-2">Ative sua conta agora e comece a vender em minutos.</p>
            </div>
            
            <Card className="p-8 shadow-xl bg-white border border-gray-100">
                <div className="mb-6 flex flex-col items-center">
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-2 mb-2">
                        <Mail size={12} />
                        {registrationData.email}
                    </div>
                </div>

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

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left flex gap-3 animate-fade-in">
                        <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-red-700">{errorMsg}</p>
                    </div>
                )}

                <Button onClick={handleActivation} size="full" isLoading={loading}>
                    Confirmar e Começar Grátis
                </Button>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                   <ShieldCheck size={14} />
                   <span>Ambiente seguro e criptografado</span>
                </div>
            </Card>
            
            <button onClick={() => navigate('/register')} className="text-sm text-gray-400 hover:text-gray-600 underline">
                Voltar e corrigir dados
            </button>
        </div>
    </div>
  );
};

export default PlanCheckout;
