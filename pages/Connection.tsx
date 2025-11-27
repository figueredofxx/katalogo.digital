import React, { useState } from 'react';
import { Card, Button, showToast } from '../components/ui/Components';
import { QrCode, RefreshCcw, CheckCircle, Smartphone } from 'lucide-react';
import { ConnectionStatus } from '../types';

const Connection: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate connection delay
    setTimeout(() => {
        setStatus(ConnectionStatus.CONNECTED);
        setIsLoading(false);
        showToast('WhatsApp conectado com sucesso!', 'success');
    }, 3000);
  };

  const handleDisconnect = () => {
      if(confirm('Tem certeza que deseja desconectar? O bot irá parar de responder.')) {
        setStatus(ConnectionStatus.DISCONNECTED);
        showToast('WhatsApp desconectado.', 'info');
      }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900">Conexão WhatsApp</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie a conexão do seu número comercial.</p>
      </div>

      <Card className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        {status === ConnectionStatus.DISCONNECTED ? (
            <div className="w-full flex flex-col items-center animate-fade-in">
                <div className="mb-6 p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl w-64 h-64 flex items-center justify-center relative">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-3">
                             <RefreshCcw className="animate-spin text-gray-400" size={32} />
                             <span className="text-sm text-gray-500">Gerando QR Code...</span>
                        </div>
                    ) : (
                        <div className="bg-gray-900 p-2 rounded-lg">
                           {/* Mock QR Code Visual */}
                           <div className="grid grid-cols-5 gap-1 w-40 h-40">
                                {Array.from({length: 25}).map((_, i) => (
                                    <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-gray-800'}`}></div>
                                ))}
                           </div>
                           <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white p-2 rounded-full shadow-lg">
                                    <QrCode size={24} className="text-gray-900" />
                                </div>
                           </div>
                        </div>
                    )}
                </div>

                <div className="text-center max-w-sm space-y-4">
                    <h3 className="font-semibold text-gray-900">Escaneie para conectar</h3>
                    <ol className="text-left text-sm text-gray-500 space-y-2 list-decimal list-inside bg-gray-50 p-4 rounded-lg">
                        <li>Abra o WhatsApp no seu celular</li>
                        <li>Toque em Configurações ou Menu</li>
                        <li>Selecione <span className="font-medium text-gray-900">Aparelhos Conectados</span></li>
                        <li>Toque em <span className="font-medium text-gray-900">Conectar um aparelho</span></li>
                    </ol>
                    
                    {!isLoading && (
                         <Button onClick={handleConnect} className="w-full" size="lg">
                            Gerar Novo QR Code
                         </Button>
                    )}
                </div>
            </div>
        ) : (
            <div className="w-full flex flex-col items-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="text-green-600 w-12 h-12" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Conectado com Sucesso</h2>
                <p className="text-gray-500 mb-8 text-center">O bot está ativo e respondendo mensagens no número <span className="font-mono text-gray-900 font-medium">+55 11 99999-9999</span></p>
                
                <div className="flex flex-col gap-3 w-full max-w-xs">
                     <Button variant="outline" onClick={() => window.open('https://web.whatsapp.com', '_blank')}>
                        <Smartphone className="mr-2 w-4 h-4" />
                        Testar no WhatsApp
                     </Button>
                     <Button variant="danger" onClick={handleDisconnect}>
                        Desconectar
                     </Button>
                </div>
            </div>
        )}
      </Card>
      
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        Status da Instância: {status === 'connected' ? 'Online' : 'Offline'}
      </div>
    </div>
  );
};

export default Connection;