
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Input, Button, Card, showToast } from '../components/ui/Components';
import { ArrowRight, ShoppingBag, Calendar } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan') || 'basic';

  const [formData, setFormData] = useState({
      storeName: '',
      email: '',
      password: '',
      confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if(formData.password !== formData.confirmPassword) {
          showToast('As senhas não coincidem.', 'error');
          return;
      }

      // Gera um slug preliminar para garantir que o banco de dados aceite a inserção
      // O usuário poderá alterar isso depois no Onboarding ou Configurações
      const preliminarySlug = formData.storeName.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/[^a-z0-9]/g, '-'); // Substitui espaços e símbolos por hifen

      // Salva dados temporários para o checkout
      localStorage.setItem('temp_register_data', JSON.stringify({ 
          ...formData, 
          slug: preliminarySlug,
          plan 
      }));
      
      navigate('/checkout-plan');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        {/* Header Simples */}
        <div className="mb-8 text-center">
            <div className="bg-gray-900 text-white p-2 rounded-lg inline-flex mb-4">
                <ShoppingBag size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Comece seu Teste Grátis</h1>
            <p className="text-gray-500 text-sm mt-1">Experimente o Katalogo por 7 dias. Sem compromisso.</p>
        </div>

        <Card className="w-full max-w-md p-8 shadow-xl">
             <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Plano: <strong>{plan === 'pro' ? 'Katalogo PRO' : 'Katalogo Inicial'}</strong></span>
                 </div>
                 <Link to="/" className="text-xs underline hover:text-blue-900">Alterar</Link>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                 <Input 
                    label="Nome da Loja" 
                    placeholder="Ex: Lojinha da Maria"
                    value={formData.storeName}
                    onChange={e => setFormData({...formData, storeName: e.target.value})}
                    required
                 />
                 <Input 
                    label="Seu melhor E-mail" 
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                 />
                 <Input 
                    label="Senha" 
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                 />
                 <Input 
                    label="Confirmar Senha" 
                    type="password"
                    placeholder="Repita a senha"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                 />

                 <div className="pt-2">
                    <Button type="submit" size="full">
                        Ativar 7 Dias Grátis
                        <ArrowRight size={18} className="ml-2" />
                    </Button>
                 </div>
                 
                 <p className="text-xs text-center text-gray-500 mt-4">
                     Não pedimos cartão de crédito agora. Cancele quando quiser.
                 </p>
             </form>
        </Card>

        <div className="mt-8 text-sm">
            Já tem uma conta? <Link to="/login" className="font-bold text-gray-900 hover:underline">Fazer Login</Link>
        </div>
    </div>
  );
};

export default Register;
