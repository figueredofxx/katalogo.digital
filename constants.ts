
import { DashboardMetric, ChatSession, Tenant } from './types';

// Instrução padrão para IA (mantida pois é uma constante de configuração)
export const DEFAULT_BOT_INSTRUCTION = `Você é um assistente virtual inteligente e prestativo para uma loja online ou clínica.
Seu objetivo é ajudar os clientes a encontrar produtos, tirar dúvidas sobre serviços, agendar horários ou realizar compras.
Seja sempre educado, direto e use emojis ocasionalmente para manter a conversa leve.
Se não souber uma resposta, ofereça transferir para um atendente humano.
Preços e condições de pagamento devem ser informados claramente quando solicitados.`;

// Métricas iniciais vazias (placeholder visual enquanto carrega)
export const EMPTY_METRICS: DashboardMetric[] = [
  { label: 'Faturamento Hoje', value: 'R$ 0,00', trend: '0%', positive: true },
  { label: 'Pedidos Pendentes', value: '0', trend: '0', positive: true },
  { label: 'Novos Clientes', value: '0', trend: '0', positive: true },
];

export const KPI_METRICS: DashboardMetric[] = [
    { label: 'Faturamento Hoje', value: 'R$ 1.250,00', trend: '+15%', positive: true },
    { label: 'Pedidos Pendentes', value: '12', trend: '+4', positive: true },
    { label: 'Novos Clientes', value: '5', trend: '+2', positive: true },
];

export const MOCK_CHATS: ChatSession[] = [
    { id: '1', customerName: 'Maria Silva', customerPhone: '11999999999', lastMessage: 'Olá, qual o valor do frete?', timestamp: '10:30', status: 'Pendente' },
    { id: '2', customerName: 'João Santos', customerPhone: '11988888888', lastMessage: 'Pedido recebido, obrigado!', timestamp: '09:15', status: 'Concluído' },
    { id: '3', customerName: 'Ana Oliveira', customerPhone: '11977777777', lastMessage: 'Gostaria de agendar...', timestamp: 'Ontem', status: 'Agendado' },
];

export const MOCK_ALL_TENANTS: Tenant[] = [
    {
        id: '1',
        name: 'Loja Modelo',
        slug: 'lojamodelo',
        primaryColor: '#4B0082',
        whatsappNumber: '5511999999999',
        plan: 'pro',
        ownerEmail: 'contato@lojamodelo.com',
        subscriptionStatus: 'active',
        joinedAt: '2023-01-15'
    },
    {
        id: '2',
        name: 'Boutique Fashion',
        slug: 'boutique',
        primaryColor: '#db2777',
        whatsappNumber: '5511988888888',
        plan: 'basic',
        ownerEmail: 'ana@boutique.com',
        subscriptionStatus: 'active',
        joinedAt: '2023-03-20'
    },
    {
        id: '3',
        name: 'Tech Store',
        slug: 'techstore',
        primaryColor: '#2563eb',
        whatsappNumber: '5511977777777',
        plan: 'pro',
        ownerEmail: 'vendas@techstore.com',
        subscriptionStatus: 'past_due',
        joinedAt: '2023-05-10'
    }
];
