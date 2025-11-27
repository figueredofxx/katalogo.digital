
import React, { useState } from 'react';
import { Card, Badge, Button, showToast, Textarea, Drawer } from '../../components/ui/Components';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';
import { SupportTicket } from '../../types';

const Support: React.FC = () => {
  const { tickets, resolveTicket, replyTicket, loading } = useSuperAdmin();
  const [replyDrawerOpen, setReplyDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const handleOpenReply = (ticket: SupportTicket) => {
      setSelectedTicket(ticket);
      setReplyMessage('');
      setReplyDrawerOpen(true);
  };

  const handleSendReply = () => {
      if (selectedTicket) {
          replyTicket(selectedTicket.id, replyMessage);
          showToast('Resposta enviada com sucesso!', 'success');
          setReplyDrawerOpen(false);
      }
  };

  const handleCloseTicket = (id: string) => {
      resolveTicket(id);
      showToast('Ticket marcado como resolvido.', 'success');
  };

  if (loading) return <div className="p-8">Carregando tickets...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Central de Suporte</h1>
          <p className="text-gray-500">Gerencie solicitações e ajuda aos lojistas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
              {tickets.map((ticket) => (
                  <Card key={ticket.id} className="p-5 border border-gray-200 hover:border-indigo-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-gray-400">#{ticket.id}</span>
                              <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                          </div>
                          <div className="flex gap-2">
                              {ticket.priority === 'high' && <Badge variant="danger">ALTA</Badge>}
                              {ticket.status === 'open' && <Badge variant="warning">ABERTO</Badge>}
                              {ticket.status === 'closed' && <Badge variant="success">RESOLVIDO</Badge>}
                          </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                          Solicitado por <span className="font-semibold text-indigo-600">{ticket.tenantName}</span> &bull; {ticket.createdAt}
                      </p>

                      <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                          <Button variant="outline" size="sm" onClick={() => handleOpenReply(ticket)}>
                              <MessageSquare size={14} className="mr-2" />
                              Responder
                          </Button>
                          {ticket.status !== 'closed' && (
                            <Button variant="secondary" size="sm" onClick={() => handleCloseTicket(ticket.id)}>
                                <CheckCircle size={14} className="mr-2" />
                                Resolver
                            </Button>
                          )}
                      </div>
                  </Card>
              ))}
              {tickets.length === 0 && (
                  <div className="p-10 text-center text-gray-400 border border-dashed border-gray-300 rounded-xl">
                      Nenhum ticket aberto.
                  </div>
              )}
          </div>

          <div className="space-y-4">
              <Card className="p-5 bg-indigo-900 text-white">
                  <h3 className="font-bold mb-2">Desempenho do Suporte</h3>
                  <div className="space-y-3">
                      <div className="flex justify-between text-sm opacity-80">
                          <span>Tickets Abertos</span>
                          <span>{tickets.filter(t => t.status === 'open').length}</span>
                      </div>
                      <div className="flex justify-between text-sm opacity-80">
                          <span>Tempo Médio Resp.</span>
                          <span>2.5h</span>
                      </div>
                  </div>
              </Card>

              <Card className="p-5 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">Alertas Recentes</h3>
                  <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                          <Clock className="text-gray-400 mt-0.5" size={16} />
                          <div>
                              <p className="font-medium text-gray-900">Erro API Gateway</p>
                              <p className="text-xs text-gray-500">Há 2 horas</p>
                          </div>
                      </div>
                  </div>
              </Card>
          </div>
      </div>

      <Drawer 
        isOpen={replyDrawerOpen} 
        onClose={() => setReplyDrawerOpen(false)} 
        title={`Responder Ticket #${selectedTicket?.id}`}
      >
          <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  <p className="font-bold mb-1">{selectedTicket?.subject}</p>
                  <p>Solicitante: {selectedTicket?.tenantName}</p>
              </div>
              <Textarea 
                placeholder="Digite sua resposta para o cliente..." 
                rows={6}
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
              />
              <Button size="full" onClick={handleSendReply}>
                  <Send size={16} className="mr-2" />
                  Enviar Resposta
              </Button>
          </div>
      </Drawer>
    </div>
  );
};

export default Support;
