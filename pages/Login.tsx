
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Card, showToast, Logo } from '../components/ui/Components';
import { api, handleApiError } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      await signIn(token, user);
      
      showToast('Login realizado com sucesso!', 'success');
      setTimeout(() => {
          navigate('/admin/dashboard');
      }, 200);

    } catch (error: any) {
      const { error: errMsg } = handleApiError(error);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#4B0082] rounded-xl flex items-center justify-center mb-4 shadow-xl shadow-indigo-200">
                <Logo className="text-white w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Katalogo Admin</h1>
            <p className="text-gray-500 text-sm mt-2">Gerencie sua loja de qualquer lugar.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <Input 
                label="Email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Input 
                label="Senha" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-[#4B0082] focus:ring-[#4B0082]" />
                    Lembrar de mim
                </label>
                <Link to="/forgot-password" className="text-[#4B0082] font-medium hover:underline">
                    Esqueceu a senha?
                </Link>
            </div>

            <Button type="submit" className="w-full bg-[#4B0082] hover:bg-indigo-900" size="lg" isLoading={loading}>
                {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Não tem uma conta? <span onClick={() => navigate('/register')} className="text-[#4B0082] font-medium hover:underline cursor-pointer">Criar loja grátis</span>
        </div>
      </Card>
    </div>
  );
};

export default Login;
