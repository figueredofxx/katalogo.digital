
import React, { useState } from 'react';
import { Card, Input, Button, showToast } from '../../components/ui/Components';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';
import { Save, Server, ShieldAlert, Globe } from 'lucide-react';

const SaaSSettings: React.FC = () => {
  const { settings, updateSettings } = useSuperAdmin();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
      updateSettings(localSettings);
      showToast('Configurações da plataforma atualizadas!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Configurações da Plataforma</h1>
          <p className="text-gray-500">Ajustes globais do sistema SaaS.</p>
      </div>

      <Card className="p-6 space-y-6 border-gray-200">
          <div className="flex items-center gap-2 text-indigo-700 font-bold border-b border-gray-100 pb-2">
              <DollarSignIcon size={18} />
              <h2>Preços dos Planos (Tabela Price)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Preço Plano Básico (R$)" 
                type="number" 
                value={localSettings.basicPlanPrice}
                onChange={e => setLocalSettings({...localSettings, basicPlanPrice: parseFloat(e.target.value)})}
              />
              <Input 
                label="Preço Plano Pro (R$)" 
                type="number"
                value={localSettings.proPlanPrice}
                onChange={e => setLocalSettings({...localSettings, proPlanPrice: parseFloat(e.target.value)})}
              />
          </div>
      </Card>

      <Card className="p-6 space-y-6 border-gray-200">
          <div className="flex items-center gap-2 text-gray-700 font-bold border-b border-gray-100 pb-2">
              <Server size={18} />
              <h2>Controle de Acesso e Manutenção</h2>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                  <ShieldAlert className="text-red-500" size={24} />
                  <div>
                      <h3 className="font-medium text-gray-900">Modo Manutenção</h3>
                      <p className="text-xs text-gray-500">Bloqueia acesso a todos os painéis de lojistas.</p>
                  </div>
              </div>
              <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={localSettings.maintenanceMode} 
                        onChange={e => setLocalSettings({...localSettings, maintenanceMode: e.target.checked})}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
              </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                  <Globe className="text-blue-500" size={24} />
                  <div>
                      <h3 className="font-medium text-gray-900">Permitir Novos Cadastros</h3>
                      <p className="text-xs text-gray-500">Habilita ou desabilita a página de registro pública.</p>
                  </div>
              </div>
              <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={localSettings.allowNewRegisters} 
                        onChange={e => setLocalSettings({...localSettings, allowNewRegisters: e.target.checked})}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
              </div>
          </div>
      </Card>

      <div className="flex justify-end">
          <Button size="lg" onClick={handleSave}>
              <Save size={18} className="mr-2" />
              Salvar Configurações Globais
          </Button>
      </div>
    </div>
  );
};

// Icon Helper
const DollarSignIcon = ({size}: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

export default SaaSSettings;
