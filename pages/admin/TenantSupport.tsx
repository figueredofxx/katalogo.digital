
import React, { useState } from 'react';
import { Card, Button, Input, Textarea, Badge, showToast, Drawer, Select } from '../../components/ui/Components';
import { useAdmin } from '../../hooks/useAdmin';
import { HelpCircle, Plus, Clock, Search, FileText, ChevronRight, ArrowLeft, BookOpen, Monitor, Smartphone, Truck, DollarSign, Palette } from 'lucide-react';

// WhatsApp do Suporte Oficial da Plataforma
const SUPPORT_WHATSAPP = '5511999998888'; 

// Official WhatsApp Icon SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// ARTICLES DATA
const HELP_ARTICLES = [
    { 
        id: 1, 
        title: 'Como configurar domínio próprio?', 
        category: 'Configuração', 
        readTime: '3 min',
        icon: Monitor,
        content: (
            <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Configurar um domínio próprio (ex: <strong>www.suamarca.com.br</strong>) aumenta a credibilidade da sua loja. Siga os passos abaixo:</p>
                
                <h4 className="font-bold text-gray-900 mt-4">1. No Registro de Domínio (Registro.br, GoDaddy, etc)</h4>
                <ul className="list-disc list-inside space-y-2">
                    <li>Acesse o painel onde você comprou seu domínio.</li>
                    <li>Procure pela seção <strong>Zona de DNS</strong> ou <strong>Configuração de DNS</strong>.</li>
                    <li>Crie uma nova entrada do tipo <strong>CNAME</strong>.</li>
                    <li>No campo <strong>Nome</strong> ou <strong>Entrada</strong>, coloque: <code>www</code></li>
                    <li>No campo <strong>Destino</strong> ou <strong>Valor</strong>, coloque: <code>katalogo.digital</code></li>
                </ul>

                <h4 className="font-bold text-gray-900 mt-4">2. No Painel Katalogo</h4>
                <ul className="list-disc list-inside space-y-2">
                    <li>Vá até <strong>Personalizar Loja</strong> ou <strong>Configurações</strong>.</li>
                    <li>No campo "Domínio Personalizado", digite seu domínio (ex: www.sualoja.com.br).</li>
                    <li>Clique em Salvar.</li>
                </ul>
                
                <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800 mt-4">
                    <strong>Nota:</strong> A propagação do DNS pode levar até 24 horas, mas geralmente ocorre em minutos.
                </div>
            </div>
        )
    },
    { 
        id: 2, 
        title: 'Cadastrando produtos', 
        category: 'Produtos', 
        readTime: '5 min',
        icon: Smartphone,
        content: (
            <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>O cadastro de produtos é a alma da sua loja. Veja como fazer um cadastro vendedor:</p>

                <h4 className="font-bold text-gray-900 mt-4">Passo a Passo</h4>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Acesse o menu <strong>Produtos</strong> no menu lateral.</li>
                    <li>Clique no botão <strong>Novo Produto</strong>.</li>
                    <li><strong>Nome:</strong> Use nomes claros. Ex: "Camiseta Algodão Branca" ao invés de apenas "Camiseta".</li>
                    <li><strong>Preço:</strong> Defina o preço final. Use o campo "Preço Promo" para criar etiquetas de desconto.</li>
                    <li><strong>Descrição:</strong> Detalhe materiais, medidas e benefícios.</li>
                </ol>

                <h4 className="font-bold text-gray-900 mt-4">Dica de Imagem</h4>
                <p>Prefira imagens quadradas (1:1) com fundo claro ou ambientadas com boa iluminação. O sistema aceita links diretos ou upload.</p>
            </div>
        )
    },
    { 
        id: 3, 
        title: 'Configurando taxas de entrega', 
        category: 'Entregas', 
        readTime: '4 min',
        icon: Truck,
        content: (
            <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Atualmente, o Katalogo funciona no modelo <strong>"Combinar via WhatsApp"</strong>, o que dá flexibilidade total para você.</p>
                
                <h4 className="font-bold text-gray-900 mt-4">Como funciona?</h4>
                <p>Quando o cliente finaliza o pedido, ele escolhe entre "Entrega" ou "Retirada". O sistema coleta o endereço completo (com busca automática de CEP) e envia para você no WhatsApp.</p>
                
                <h4 className="font-bold text-gray-900 mt-4">Calculando o Frete</h4>
                <p>Ao receber a mensagem no WhatsApp:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>Verifique o bairro/endereço do cliente.</li>
                    <li>Calcule a taxa usando seu motoboy ou Correios.</li>
                    <li>Informe o valor final ao cliente na resposta da mensagem.</li>
                </ul>
            </div>
        )
    },
    { 
        id: 4, 
        title: 'Formas de Pagamento (PIX e Cartão)', 
        category: 'Financeiro', 
        readTime: '2 min',
        icon: DollarSign,
        content: (
            <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Você pode controlar exatamente quais meios de pagamento aceita na sua loja.</p>

                <h4 className="font-bold text-gray-900 mt-4">Configurando</h4>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Acesse o menu <strong>Configurações</strong>.</li>
                    <li>Vá até a seção <strong>Financeiro</strong>.</li>
                    <li>Use os interruptores (switches) para ativar ou desativar: PIX, Cartão de Crédito, Débito, Boleto, etc.</li>
                </ol>

                <h4 className="font-bold text-gray-900 mt-4">Parcelamento</h4>
                <p>Você também pode definir uma <strong>Taxa de Juros Mensal</strong>. O sistema calculará automaticamente uma tabela de parcelamento (1x a 12x) e mostrará para o cliente na página do produto, incentivando a compra de maior valor.</p>
            </div>
        )
    },
    { 
        id: 5, 
        title: 'Personalizando a aparência da loja', 
        category: 'Design', 
        readTime: '6 min',
        icon: Palette,
        content: (
            <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Deixe a loja com a cara da sua marca. Uma loja bonita vende até 40% mais.</p>
                
                <h4 className="font-bold text-gray-900 mt-4">Itens Personalizáveis</h4>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Logo:</strong> Sua marca principal.</li>
                    <li><strong>Banner (Capa):</strong> A imagem grande no topo da loja. Use fotos de alta qualidade ou promoções.</li>
                    <li><strong>Cor Principal:</strong> Escolha a cor dos botões e destaques. O sistema ajusta automaticamente o contraste.</li>
                    <li><strong>Bio/Descrição:</strong> Um texto curto falando sobre sua loja.</li>
                </ul>

                <p className="mt-4">Todas as alterações podem ser feitas no menu <strong>Loja</strong> (ícone de Paleta).</p>
            </div>
        )
    },
];

const TenantSupport: React.FC = () => {
  const { tickets, createTicket, loading } = useAdmin();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reading Mode State
  const [readingArticle, setReadingArticle] = useState<any>(null);
  
  const [newTicket, setNewTicket] = useState({
      subject: '',
      message: '',
      priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [creating, setCreating] = useState(false);

  const handleOpenWhatsapp = () => {
      const text = "Olá, sou lojista do Katalogo e preciso de ajuda.";
      window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmitTicket = async () => {
      if (!newTicket.subject || !newTicket.message) {
          showToast('Preencha o assunto e a mensagem.', 'error');
          return;
      }
      setCreating(true);
      const { error } = await createTicket(newTicket.subject, newTicket.priority, newTicket.message);
      setCreating(false);
      
      if (!error) {
          showToast('Ticket aberto com sucesso!', 'success');
          setIsDrawerOpen(false);
          setNewTicket({ subject: '', message: '', priority: 'medium' });
      } else {
          showToast('Erro ao criar ticket.', 'error');
      }
  };

  const filteredArticles = HELP_ARTICLES.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Central de Ajuda</h1>
          <p className="text-gray-500 text-sm">Base de conhecimento e suporte técnico especializado.</p>
        </div>
        {!readingArticle && (
            <div className="flex gap-2">
                <Button onClick={() => setIsDrawerOpen(true)}>
                    <Plus size={18} className="mr-2" /> Novo Chamado
                </Button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Knowledge Base or Article Reader */}
          <div className="lg:col-span-2 space-y-6">
              
              {readingArticle ? (
                  // --- ARTICLE READER VIEW ---
                  <div className="animate-fade-in space-y-6">
                      <button 
                        onClick={() => setReadingArticle(null)}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                      >
                          <ArrowLeft size={16} className="mr-2" /> Voltar para busca
                      </button>

                      <Card className="p-8 border-gray-200">
                          <div className="flex items-center gap-2 mb-4">
                             <Badge variant="neutral">{readingArticle.category}</Badge>
                             <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> {readingArticle.readTime} de leitura</span>
                          </div>
                          <h1 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">{readingArticle.title}</h1>
                          
                          <div className="prose prose-sm max-w-none prose-blue">
                              {readingArticle.content}
                          </div>

                          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                              <span className="text-xs text-gray-400">Isso foi útil?</span>
                              <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Sim</Button>
                                  <Button variant="outline" size="sm">Não</Button>
                              </div>
                          </div>
                      </Card>
                  </div>
              ) : (
                  // --- SEARCH & LIST VIEW ---
                  <>
                    <Card className="p-8 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="relative z-10 space-y-4 max-w-xl">
                            <h2 className="text-2xl font-bold text-gray-900">Como podemos ajudar hoje?</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Busque por temas (ex: domínio, pix, produtos)..." 
                                    className="w-full pl-10 pr-4 h-12 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <span>Populares:</span>
                                <button className="underline hover:text-blue-600" onClick={() => setSearchTerm('Domínio')}>Domínio</button>
                                <button className="underline hover:text-blue-600" onClick={() => setSearchTerm('Pagamento')}>Pagamento</button>
                                <button className="underline hover:text-blue-600" onClick={() => setSearchTerm('Entrega')}>Entrega</button>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none">
                            <BookOpen size={200} />
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 px-1">
                            <FileText size={18} className="text-gray-400"/>
                            Artigos Recomendados
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredArticles.length === 0 ? (
                                <div className="col-span-2 text-center py-10 text-gray-400">
                                    Nenhum artigo encontrado para "{searchTerm}".
                                </div>
                            ) : (
                                filteredArticles.map(article => (
                                    <div 
                                        key={article.id} 
                                        onClick={() => setReadingArticle(article)}
                                        className="group p-5 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-xl cursor-pointer transition-all flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={`p-2 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors`}>
                                                <article.icon size={18} />
                                            </div>
                                            <Badge variant="neutral">{article.category}</Badge>
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {article.title}
                                        </h4>
                                        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50">
                                            <span className="flex items-center gap-1"><Clock size={12}/> {article.readTime}</span>
                                            <span className="flex items-center font-medium group-hover:text-blue-600">Ler <ChevronRight size={12}/></span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                  </>
              )}
          </div>

          {/* RIGHT: Contact & History (Always Visible) */}
          <div className="space-y-6">
              
              {/* WhatsApp Card */}
              <Card className="p-6 bg-[#f0fdf4] border-[#dcfce7] space-y-4 relative overflow-hidden">
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-[#25D366] text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-200">
                          <WhatsAppIcon className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Suporte Premium</h3>
                      <p className="text-sm text-green-800 mb-4 leading-relaxed">
                          Atendimento prioritário via WhatsApp para resolver questões urgentes da sua loja.
                      </p>
                      <Button onClick={handleOpenWhatsapp} className="w-full bg-[#25D366] hover:bg-[#1ebc57] text-white border-none shadow-lg shadow-green-200">
                          <WhatsAppIcon className="w-5 h-5 mr-2" />
                          Conversar Agora
                      </Button>
                      <p className="text-[10px] text-center text-green-700 mt-3">Segunda a Sexta, 09h às 18h</p>
                  </div>
              </Card>

              {/* Ticket History */}
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">Seus Chamados</h3>
                  </div>

                  {loading ? (
                      <div className="p-4 text-center text-xs text-gray-400">Carregando...</div>
                  ) : tickets.length === 0 ? (
                      <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                          <HelpCircle className="mx-auto text-gray-300 mb-2" size={24} />
                          <p className="text-gray-500 text-sm">Nenhum chamado aberto.</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {tickets.map(ticket => (
                              <Card key={ticket.id} className="p-4 border border-gray-200 hover:border-gray-300 transition-colors group cursor-pointer">
                                  <div className="flex justify-between items-start mb-1">
                                      <span className="text-xs font-mono text-gray-400">#{ticket.id.slice(-4)}</span>
                                      {ticket.status === 'open' ? (
                                          <Badge variant="warning">Aberto</Badge>
                                      ) : (
                                          <Badge variant="success">Resolvido</Badge>
                                      )}
                                  </div>
                                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{ticket.subject}</h4>
                                  <div className="flex justify-between items-center mt-2">
                                      <span className="text-[10px] text-gray-400">{ticket.lastUpdate}</span>
                                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-600" />
                                  </div>
                              </Card>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* New Ticket Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Novo Chamado">
          <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 flex gap-3">
                  <Clock className="flex-shrink-0 mt-0.5" size={18} />
                  <p>O tempo médio de resposta para tickets é de <strong>4 horas úteis</strong>.</p>
              </div>
              
              <Input 
                  label="Assunto" 
                  placeholder="Ex: Dúvida sobre Pagamentos"
                  value={newTicket.subject}
                  onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
              />

              <Select 
                  label="Prioridade"
                  options={[
                      { label: 'Baixa - Dúvida Geral', value: 'low' },
                      { label: 'Média - Problema Funcional', value: 'medium' },
                      { label: 'Alta - Loja Parada', value: 'high' },
                  ]}
                  value={newTicket.priority}
                  onChange={e => setNewTicket({...newTicket, priority: e.target.value as any})}
              />

              <Textarea 
                  label="Mensagem Detalhada"
                  placeholder="Descreva o que está acontecendo..."
                  rows={8}
                  value={newTicket.message}
                  onChange={e => setNewTicket({...newTicket, message: e.target.value})}
              />

              <div className="pt-4">
                  <Button size="full" onClick={handleSubmitTicket} isLoading={creating}>
                      Enviar Solicitação
                  </Button>
              </div>
          </div>
      </Drawer>
    </div>
  );
};

export default TenantSupport;
