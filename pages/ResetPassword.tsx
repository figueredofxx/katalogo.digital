
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Button, Card, showToast } from '../components/ui/Components';
import { pb } from '../lib/pocketbase';
import { Lock } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token') || '';
  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
        showToast('As senhas não coincidem', 'error');
        return;
    }
    setLoading(true);

    try {
      // PB confirmPasswordReset
      await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
      
      showToast('Senha atualizada com sucesso!', 'success');
      navigate('/login');
    } catch (error: any) {
      showToast('Erro ao atualizar senha. O link pode ter expirado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Nova Senha</h1>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
            <Input 
                label="Nova Senha" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="text-gray-400" size={18} />}
                required
                minLength={8}
            />
            <Input 
                label="Confirmar Senha" 
                type="password" 
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                icon={<Lock className="text-gray-400" size={18} />}
                required
                minLength={8}
            />

            <Button type="submit" size="full" isLoading={loading} className="bg-[#4B0082]">
                Salvar Nova Senha
            </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
