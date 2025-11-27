
import React, { useState } from 'react';
import { Card, Button, Badge, showToast } from '../../components/ui/Components';
import { Search, LogIn, Ban, CheckCircle, Mail, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';

const Tenants: React.FC = () => {
  const navigate = useNavigate();
  const { tenants, toggleTenantStatus, loading } = useSuperAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const handleImpersonate = (tenantName: string) => {
      showToast(`Acessando painel de: ${tenantName}...`, 'info');
      setTimeout(() => {
          navigate('/admin/dashboard');
      }, 1500);
  };

  const handleToggleStatus = (id: string) => {
      toggleTenantStatus(id);
      showToast('Status da loja atualizado.', 'success');
  };

  const filtered = tenants.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8">Carregando lojas...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestão de Lojas</h1>
            <p className="text-gray-500">Gerencie assinantes, status e acesso.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary">Exportar Lista</Button>
            <Button>Nova Loja Manual</Button>
        </div>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 border border-gray-200">
          <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="Buscar por nome, email ou slug..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-gray-900"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
      </Card>

      <Card className="overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3">Loja / Cliente</th>
                        <th className="px-6 py-3">Plano</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Slug</th>
                        <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.map(tenant => (
                        <tr key={tenant.id} className="hover:bg-gray-50 group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {tenant.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{tenant.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Mail size={10} /> {tenant.ownerEmail}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {tenant.plan === 'pro' ? (
                                    <Badge variant="neutral" className="bg-indigo-100 text-indigo-700 border-indigo-200">PRO</Badge>
                                ) : (
                                    <Badge variant="neutral">BÁSICO</Badge>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {tenant.subscriptionStatus === 'active' && <Badge variant="success">ATIVO</Badge>}
                                {tenant.subscriptionStatus === 'past_due' && <Badge variant="warning">INADIMPLENTE</Badge>}
                                {tenant.subscriptionStatus === 'suspended' && <Badge variant="danger">SUSPENSO</Badge>}
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                {tenant.slug}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleImpersonate(tenant.name)}
                                        title="Acessar Loja (Impersonate)"
                                        className="p-2 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-lg transition-colors"
                                    >
                                        <LogIn size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleToggleStatus(tenant.id)}
                                        title={tenant.subscriptionStatus === 'active' ? 'Suspender Loja' : 'Ativar Loja'}
                                        className={`p-2 rounded-lg transition-colors ${
                                            tenant.subscriptionStatus === 'active' 
                                            ? 'hover:bg-red-50 text-gray-500 hover:text-red-600' 
                                            : 'hover:bg-green-50 text-gray-500 hover:text-green-600'
                                        }`}
                                    >
                                        {tenant.subscriptionStatus === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </Card>
    </div>
  );
};

export default Tenants;
