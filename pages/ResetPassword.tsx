
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, showToast } from '../components/ui/Components';
import { supabase } from '../lib/supabase';
import { Lock } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // O Supabase coloca o token na URL (hash). O cliente JS detecta a sessão automaticamente.
  // Mas é bom verificar se temos sessão.
  
  useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
              // Se não tiver sessão (token expirado ou inválido), volta pro login
              showToast('Link inválido ou expirado.', 'error');
              navigate('/login');
          }
      });
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      
      if (error) throw error;

      showToast('Senha atualizada com sucesso!', 'success');
      navigate('/admin/dashboard');
    } catch (error: any) {
      showToast(error.message || 'Erro ao atualizar senha.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Nova Senha</h1>
            <p className="text-gray-500 text-sm mt-2">Crie uma nova senha segura para sua conta.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
            <Input 
                label="Nova Senha" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="text-gray-400" size={18} />}
                required
                minLength={6}
            />

            <Button type="submit" size="full" isLoading={loading} className="bg-[#4B0082]">
                Atualizar Senha
            </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
