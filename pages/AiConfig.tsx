import React, { useState } from 'react';
import { Card, Input, Textarea, Button, showToast } from '../components/ui/Components';
import VoiceAgent from '../components/VoiceAgent';
import { Bot, Save, Mic } from 'lucide-react';
import { DEFAULT_BOT_INSTRUCTION } from '../constants';

const AiConfig: React.FC = () => {
  const [botName, setBotName] = useState('Ana');
  const [context, setContext] = useState(DEFAULT_BOT_INSTRUCTION);
  const [isSaving, setIsSaving] = useState(false);
  const [isVoiceTestOpen, setIsVoiceTestOpen] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        showToast('Treinamento salvo com sucesso!', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cérebro da IA</h1>
          <p className="text-gray-500 text-sm mt-1">Configure como sua assistente deve se comportar.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsVoiceTestOpen(true)}>
                <Mic className="w-4 h-4 mr-2" />
                Testar Voz
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Column */}
        <div className="space-y-6">
            <Card className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
                    <Bot className="text-gray-900" size={20} />
                    <h3 className="font-semibold text-gray-900">Personalidade</h3>
                </div>
                
                <Input 
                    label="Nome da Assistente" 
                    value={botName} 
                    onChange={(e) => setBotName(e.target.value)} 
                    placeholder="Ex: Ana, Júlia..."
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tom de Voz</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Formal', 'Amigável'].map((tone) => (
                            <button 
                                key={tone}
                                className={`px-3 py-2 text-sm border rounded-lg transition-all ${
                                    tone === 'Amigável' 
                                    ? 'bg-gray-900 text-white border-gray-900' 
                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {tone}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <Card className="p-5 bg-gray-50 border-dashed border-gray-300">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Dicas de Treinamento</h4>
                <ul className="text-xs text-gray-500 space-y-2 list-disc list-inside">
                    <li>Coloque todos os preços explicitamente.</li>
                    <li>Defina regras de cancelamento.</li>
                    <li>Informe o endereço completo.</li>
                    <li>Use linguagem natural.</li>
                </ul>
            </Card>
        </div>

        {/* Knowledge Base Column */}
        <div className="lg:col-span-2">
            <Card className="p-5 h-full flex flex-col">
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">Base de Conhecimento</h3>
                    <p className="text-xs text-gray-500">Cole aqui todas as informações que o bot precisa saber. Quanto mais detalhes, melhor.</p>
                </div>
                <Textarea 
                    className="flex-1 min-h-[400px] font-mono text-sm leading-relaxed"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Cole aqui seus serviços, preços e horários..."
                />
            </Card>
        </div>
      </div>

      <VoiceAgent 
        isOpen={isVoiceTestOpen} 
        onClose={() => setIsVoiceTestOpen(false)} 
        systemInstruction={`Seu nome é ${botName}. ${context}`}
      />
    </div>
  );
};

export default AiConfig;