
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Card, showToast } from '../components/ui/Components';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Configurar a URL de redirecionamento correta para sua produção
      const redirectUrl = window.location.origin + '/#/reset-password';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setSent(true);
      showToast('Email de recuperação enviado!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao enviar email.', 'error');
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
                    <p className="text-gray-500 text-sm mt-2">Digite seu email para receber o link de redefinição.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                    <Input 
                        label="Email cadastrado" 
                        type="email" 
                        placeholder="seu@email.com" 
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
                <p className="text-gray-500 text-sm mb-6">
                    Verifique sua caixa de entrada (e spam). Enviamos um link para você redefinir sua senha.
                </p>
                <Button variant="outline" onClick={() => setSent(false)}>
                    Tentar outro email
                </Button>
            </div>
        )}

        <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#4B0082] flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Voltar para Login
            </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
