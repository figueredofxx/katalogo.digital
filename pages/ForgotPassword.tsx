
import React, { useState } from 'react';
import { Input, Button, Card, showToast } from '../components/ui/Components';
import { api, handleApiError } from '../lib/api';
import { Mail, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      showToast('Email de recuperação enviado!', 'success');
    } catch (error: any) {
      const { error: msg } = handleApiError(error);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        {!sent ? (
            <>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Recuperar Senha</h1>
                    <p className="text-gray-500 text-sm mt-2">Digite seu email para receber o link.</p>
                </div>
                <form onSubmit={handleReset} className="space-y-6">
                    <Input 
                        label="Email cadastrado" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="text-gray-400" size={18} />}
                        required
                    />
                    <Button type="submit" size="full" isLoading={loading} className="bg-[#4B0082]">
                        Enviar Link
                    </Button>
                </form>
            </>
        ) : (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Email Enviado!</h2>
                <Button variant="outline" onClick={() => setSent(false)}>Voltar</Button>
            </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
