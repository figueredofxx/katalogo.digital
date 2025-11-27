
import React, { useState } from 'react';
import { Button, Badge, Card } from '../components/ui/Components';
import { Link } from 'react-router-dom';
import { 
    Check, ShoppingBag, Zap, Shield, ChevronRight, 
    Smartphone, ArrowRight, Star, Clock, CheckCircle2, 
    Menu, X, TrendingUp 
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. NAVBAR (Sticky & Glassmorphism) */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                <div className="bg-[#4B0082] text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
                    <ShoppingBag size={22} strokeWidth={2.5} />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-gray-900">Katalogo</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
                <a href="#funcionalidades" className="text-sm font-medium text-gray-500 hover:text-[#4B0082] transition-colors">Funcionalidades</a>
                <a href="#como-funciona" className="text-sm font-medium text-gray-500 hover:text-[#4B0082] transition-colors">Como Funciona</a>
                <a href="#planos" className="text-sm font-medium text-gray-500 hover:text-[#4B0082] transition-colors">Planos</a>
            </div>

            {/* CTAs */}
            <div className="hidden md:flex gap-3">
                <Link to="/login">
                    <Button variant="ghost" className="text-gray-600 hover:text-[#4B0082] hover:bg-indigo-50">Entrar</Button>
                </Link>
                <Link to="/register">
                    <Button className="bg-[#4B0082] hover:bg-indigo-900 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5">
                        Criar Loja Grátis
                    </Button>
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-xl">
                <div className="flex flex-col gap-4">
                    <a href="#funcionalidades" className="text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Funcionalidades</a>
                    <a href="#planos" className="text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Planos</a>
                    <hr className="border-gray-100"/>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="full">Entrar</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button size="full" className="bg-[#4B0082] text-white">Começar Agora</Button>
                    </Link>
                </div>
            </div>
        )}
      </nav>

      {/* SEÇÃO 1: HERO (A Promessa) */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 px-6 relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10 opacity-60"></div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left space-y-8 animate-slide-up">
                  <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 rounded-full px-4 py-1.5 shadow-sm">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4B0082]"></span>
                      </span>
                      <span className="text-xs font-bold text-[#4B0082] tracking-wide uppercase">Nova Versão 2.0</span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                      Sua Loja Online Pronta em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4B0082] to-blue-600">30 Segundos</span>.
                  </h1>
                  
                  <p className="text-lg lg:text-xl text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                      Transforme seu WhatsApp em uma máquina de vendas automática. Sem programar, sem taxas escondidas e com visual profissional.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link to="/register" className="w-full sm:w-auto">
                          <Button size="lg" className="w-full h-14 text-base px-8 bg-[#4B0082] hover:bg-indigo-900 text-white shadow-xl shadow-indigo-200 hover:shadow-indigo-300">
                              Começar Gratuitamente
                              <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                      </Link>
                      <a href="#como-funciona" className="w-full sm:w-auto">
                        <Button variant="secondary" size="lg" className="w-full h-14 text-base px-8 bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                             Ver como funciona
                        </Button>
                      </a>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-6 text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1"><Check size={14} className="text-green-500"/> Sem cartão de crédito</span>
                      <span className="flex items-center gap-1"><Check size={14} className="text-green-500"/> Cancele quando quiser</span>
                  </div>
              </div>

              {/* Hero Image / Mockup */}
              <div className="relative mx-auto lg:mr-0 max-w-[320px] lg:max-w-md animate-fade-in delay-100">
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#4B0082] to-blue-500 rounded-[2.5rem] rotate-6 opacity-20 blur-2xl"></div>
                   <div className="relative bg-gray-900 rounded-[2.5rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden aspect-[9/19]">
                        {/* Mockup Screen Content */}
                        <div className="bg-white h-full w-full flex flex-col">
                            {/* Header Mock */}
                            <div className="bg-[#4B0082] h-32 p-6 flex flex-col justify-end text-white">
                                <div className="w-12 h-12 bg-white rounded-full mb-3 shadow-md"></div>
                                <div className="h-4 w-32 bg-white/30 rounded mb-2"></div>
                                <div className="h-2 w-20 bg-white/30 rounded"></div>
                            </div>
                            {/* Products Mock */}
                            <div className="p-4 grid grid-cols-2 gap-3 overflow-hidden">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-2 space-y-2">
                                        <div className="aspect-square bg-gray-200 rounded-lg"></div>
                                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                                        <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                            {/* Floating Cart Button */}
                            <div className="absolute bottom-6 left-4 right-4 bg-[#4B0082] h-12 rounded-xl shadow-lg flex items-center justify-between px-4 text-white">
                                <span className="font-bold text-sm">Ver Sacola</span>
                                <span className="font-bold text-sm">R$ 159,90</span>
                            </div>
                        </div>
                   </div>
              </div>
          </div>
      </section>

      {/* SEÇÃO 2: PROVA SOCIAL (Impacto) */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
                  A plataforma escolhida por empreendedores modernos
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Fake Logos for Social Proof */}
                  <div className="flex items-center justify-center gap-2 font-bold text-xl text-gray-400">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div> BoutiqueAna
                  </div>
                  <div className="flex items-center justify-center gap-2 font-bold text-xl text-gray-400">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div> BurgerKing
                  </div>
                  <div className="flex items-center justify-center gap-2 font-bold text-xl text-gray-400">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div> TechZone
                  </div>
                  <div className="flex items-center justify-center gap-2 font-bold text-xl text-gray-400">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div> PetLove
                  </div>
              </div>
          </div>
      </section>

      {/* SEÇÃO 3: O PROBLEMA (Agitar a Dor) */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                      Vender pelo WhatsApp virou um <span className="text-red-600 decoration-red-200 underline decoration-4 underline-offset-4">caos</span>?
                  </h2>
                  <p className="text-lg text-gray-500">
                      Se você ainda envia 50 fotos na galeria, anota pedidos no caderno e perde clientes esperando resposta, você está deixando dinheiro na mesa.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <Card className="p-8 border-red-100 bg-red-50/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-bl-xl">JEITO ANTIGO</div>
                      <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
                          <X className="w-6 h-6 text-red-500" />
                          O Caos Manual
                      </h3>
                      <ul className="space-y-4">
                          <li className="flex gap-3 text-red-800/80">
                              <X size={20} className="shrink-0 text-red-400" />
                              Galeria do cliente lotada de fotos soltas.
                          </li>
                          <li className="flex gap-3 text-red-800/80">
                              <X size={20} className="shrink-0 text-red-400" />
                              "Tem tamanho M?" "Qual o preço?" (Repetitivo).
                          </li>
                          <li className="flex gap-3 text-red-800/80">
                              <X size={20} className="shrink-0 text-red-400" />
                              Erros ao somar o total ou calcular frete.
                          </li>
                          <li className="flex gap-3 text-red-800/80">
                              <X size={20} className="shrink-0 text-red-400" />
                              Sem histórico de quem comprou.
                          </li>
                      </ul>
                  </Card>

                  <Card className="p-8 border-green-100 bg-green-50/30 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-xl">COM KATALOGO</div>
                      <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          A Loja Automática
                      </h3>
                      <ul className="space-y-4">
                          <li className="flex gap-3 text-green-800/80">
                              <Check size={20} className="shrink-0 text-green-500" />
                              Cliente navega sozinho e escolhe os produtos.
                          </li>
                          <li className="flex gap-3 text-green-800/80">
                              <Check size={20} className="shrink-0 text-green-500" />
                              Preços, tamanhos e estoque sempre visíveis.
                          </li>
                          <li className="flex gap-3 text-green-800/80">
                              <Check size={20} className="shrink-0 text-green-500" />
                              Pedido chega pronto e somado no seu WhatsApp.
                          </li>
                          <li className="flex gap-3 text-green-800/80">
                              <Check size={20} className="shrink-0 text-green-500" />
                              Painel de gestão profissional de pedidos.
                          </li>
                      </ul>
                  </Card>
              </div>
          </div>
      </section>

      {/* SEÇÃO 4: FUNCIONALIDADES (O "Como") */}
      <section id="funcionalidades" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                      Tudo o que você precisa para vender
                  </h2>
                  <p className="text-gray-500">Ferramentas poderosas escondidas em uma interface simples.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-[#4B0082] mb-6 group-hover:scale-110 transition-transform">
                          <Smartphone size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Catálogo Interativo</h3>
                      <p className="text-gray-500 leading-relaxed">
                          Seus produtos organizados por categorias, com fotos, descrição e variações. Uma experiência de app, sem baixar nada.
                      </p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                          <Zap size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Checkout WhatsApp</h3>
                      <p className="text-gray-500 leading-relaxed">
                          O cliente monta o carrinho, preenche o endereço e envia o pedido pronto para o seu número. Zero fricção.
                      </p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                          <TrendingUp size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Gestão de Pedidos</h3>
                      <p className="text-gray-500 leading-relaxed">
                          Um painel Kanban (estilo Trello) para você mover pedidos de "Novo" para "Entregue" e organizar sua operação.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* SEÇÃO 5: PASSO A PASSO (Simplicidade) */}
      <section id="como-funciona" className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1 relative">
                      {/* Abstract decorative circles */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl -z-10"></div>
                      
                      <div className="space-y-12">
                          <div className="flex gap-6 relative">
                              <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-full bg-[#4B0082] text-white flex items-center justify-center font-bold text-lg shadow-lg z-10">1</div>
                                  <div className="h-full w-0.5 bg-gray-200 my-2"></div>
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">Crie sua conta em segundos</h3>
                                  <p className="text-gray-500">Defina o nome da sua loja e seu número de WhatsApp. Pronto, sua loja já existe.</p>
                              </div>
                          </div>

                          <div className="flex gap-6 relative">
                              <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#4B0082] text-[#4B0082] flex items-center justify-center font-bold text-lg shadow-lg z-10">2</div>
                                  <div className="h-full w-0.5 bg-gray-200 my-2"></div>
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cadastre seus produtos</h3>
                                  <p className="text-gray-500">Adicione fotos, preços e descrições. É tão fácil quanto postar no Instagram.</p>
                              </div>
                          </div>

                          <div className="flex gap-6 relative">
                              <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg shadow-lg z-10">3</div>
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">Compartilhe e venda</h3>
                                  <p className="text-gray-500">Envie seu link (ex: katalogo.digital/sualoja) para seus clientes e receba os pedidos organizados.</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="order-1 lg:order-2 text-center lg:text-left">
                      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                          Tão simples que parece mágica.
                      </h2>
                      <p className="text-lg text-gray-500 mb-8">
                          Eliminamos toda a complexidade. Você não precisa saber design, programação ou marketing. O Katalogo faz o trabalho pesado.
                      </p>
                      <Link to="/register">
                        <Button size="lg" className="bg-[#4B0082] text-white shadow-xl shadow-indigo-200 h-12 px-8">
                            Criar Loja Agora
                        </Button>
                      </Link>
                  </div>
              </div>
          </div>
      </section>

      {/* SEÇÃO 6: PREÇOS (Oferta Matadora) */}
      <section id="planos" className="py-24 bg-[#111827] text-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                      Um investimento minúsculo para seu negócio
                  </h2>
                  <p className="text-gray-400">
                      Quanto custa perder uma venda? Muito mais do que nossos planos.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Plano Básico */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 hover:border-gray-600 transition-all">
                      <h3 className="text-xl font-medium text-gray-300 mb-2">Plano Inicial</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-4xl font-bold">R$ 29,90</span>
                          <span className="text-sm text-gray-400">/mês</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-8 border-b border-gray-700 pb-8">
                          Para quem está começando e quer organizar as primeiras vendas.
                      </p>
                      <ul className="space-y-4 mb-8">
                          <li className="flex gap-3 text-sm text-gray-300">
                              <Check size={18} className="text-[#4B0082]" /> Até 20 produtos
                          </li>
                          <li className="flex gap-3 text-sm text-gray-300">
                              <Check size={18} className="text-[#4B0082]" /> Link da loja personalizado
                          </li>
                          <li className="flex gap-3 text-sm text-gray-300">
                              <Check size={18} className="text-[#4B0082]" /> Pedidos ilimitados
                          </li>
                      </ul>
                      <Link to="/register?plan=basic">
                          <Button variant="outline" size="full" className="border-gray-600 text-white hover:bg-gray-700 hover:text-white hover:border-gray-500">
                              Escolher Básico
                          </Button>
                      </Link>
                  </div>

                  {/* Plano Pro (Destaque) */}
                  <div className="bg-gradient-to-b from-[#4B0082] to-indigo-900 rounded-3xl p-8 border border-indigo-500/50 shadow-2xl relative transform md:scale-105">
                      <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">
                          Recomendado
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Plano Pro</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-4xl font-bold">R$ 49,90</span>
                          <span className="text-sm text-indigo-200">/mês</span>
                      </div>
                      <p className="text-sm text-indigo-200 mb-8 border-b border-indigo-700 pb-8">
                          Para quem quer escalar e profissionalizar a marca de verdade.
                      </p>
                      <ul className="space-y-4 mb-8">
                          <li className="flex gap-3 text-sm font-medium">
                              <div className="bg-white/20 p-0.5 rounded-full"><Check size={12} className="text-white" /></div> Produtos Ilimitados
                          </li>
                          <li className="flex gap-3 text-sm font-medium">
                              <div className="bg-white/20 p-0.5 rounded-full"><Check size={12} className="text-white" /></div> Gestão de Estoque
                          </li>
                          <li className="flex gap-3 text-sm font-medium">
                              <div className="bg-white/20 p-0.5 rounded-full"><Check size={12} className="text-white" /></div> Relatórios de Venda
                          </li>
                          <li className="flex gap-3 text-sm font-medium">
                              <div className="bg-white/20 p-0.5 rounded-full"><Check size={12} className="text-white" /></div> Suporte Prioritário
                          </li>
                      </ul>
                      <Link to="/register?plan=pro">
                          <Button size="full" className="bg-white text-[#4B0082] hover:bg-gray-100 border-none font-bold h-12 shadow-lg">
                              Testar 7 Dias Grátis
                          </Button>
                      </Link>
                      <p className="text-xs text-center text-indigo-300 mt-4 opacity-80">
                          Sem cobrança hoje. Cancele quando quiser.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* SEÇÃO 7: FAQ & CTA FINAL */}
      <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Perguntas Frequentes</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-20">
                  <div className="space-y-2">
                      <h4 className="font-bold text-gray-900">Preciso ter CNPJ?</h4>
                      <p className="text-sm text-gray-500">Não! Você pode começar apenas com seu CPF e dados básicos.</p>
                  </div>
                  <div className="space-y-2">
                      <h4 className="font-bold text-gray-900">Cobra comissão por venda?</h4>
                      <p className="text-sm text-gray-500">Zero. Não cobramos nenhuma taxa sobre suas vendas. O lucro é todo seu.</p>
                  </div>
                  <div className="space-y-2">
                      <h4 className="font-bold text-gray-900">Funciona no iPhone e Android?</h4>
                      <p className="text-sm text-gray-500">Sim! O Katalogo roda direto no navegador do celular, sem instalar nada.</p>
                  </div>
                  <div className="space-y-2">
                      <h4 className="font-bold text-gray-900">Como recebo o dinheiro?</h4>
                      <p className="text-sm text-gray-500">Diretamente na sua conta (via PIX) ou maquininha. Nós apenas organizamos o pedido.</p>
                  </div>
              </div>

              {/* FINAL CALL TO ACTION */}
              <div className="bg-[#4B0082] rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                      <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                          Pare de perder tempo anotando pedidos.
                      </h2>
                      <p className="text-lg text-indigo-200 mb-8 max-w-2xl mx-auto">
                          Junte-se a centenas de lojistas que profissionalizaram o atendimento e aumentaram suas vendas com o Katalogo.
                      </p>
                      <Link to="/register">
                          <Button size="lg" className="h-16 px-10 text-lg bg-white text-[#4B0082] hover:bg-gray-100 border-none font-bold shadow-xl transition-transform hover:scale-105">
                              Criar Minha Loja Grátis
                          </Button>
                      </Link>
                      <p className="text-sm text-indigo-300 mt-6">
                          Teste grátis de 7 dias &bull; Instalação em segundos &bull; Suporte incluso
                      </p>
                  </div>
              </div>

              <div className="text-center mt-12 pt-8 border-t border-gray-100">
                  <p className="text-sm text-gray-400">
                      &copy; 2025 Katalogo App. Feito para empreendedores.
                  </p>
              </div>
          </div>
      </section>

    </div>
  );
};

export default LandingPage;
