
export interface Tenant {
  id: string;
  slug: string; // subdomain (e.g., 'lojadocarlos')
  customDomain?: string; // Novo: Domínio personalizado
  name: string;
  description?: string; // Novo: Bio da loja
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  whatsappNumber: string;
  instagram?: string; // Novo
  address?: string; // Novo
  openingHours?: string; // Novo
  pixKey?: string;
  plan: 'basic' | 'pro'; // Novo: Controle de Planos
  creditCardInterestRate?: number; // Novo: Taxa de juros mensal (%)
  paymentMethods?: PaymentMethods; // Novo: Configuração de pagamentos
  deliveryConfig?: DeliveryConfig; // Novo: Configuração de Frete
  subscriptionStatus?: 'active' | 'past_due' | 'trial' | 'canceled' | 'suspended'; // Novo: Status financeiro
  trialEndsAt?: string; // Novo: Data de término do teste grátis (ISO String)
  nextBillingDate?: string; // Novo: Data de renovação
  ownerEmail?: string; // Novo: Email do dono para gestão
  joinedAt?: string; // Novo: Data de cadastro
  orderControlMode?: 'kanban' | 'list' | 'kitchen'; // Novo: Modo de visualização de pedidos
  
  // Novos Campos
  isSuperAdmin?: boolean; // Flag para acesso ao painel SaaS
  slugHistory?: { slug: string, date: string }[]; // Histórico de mudanças
}

export interface DeliveryConfig {
    mode: 'fixed' | 'radius' | 'regions' | 'pickup';
    fixedPrice?: number;
    radiusConfig?: {
        pricePerKm: number;
        minPrice: number;
        maxRadiusKm: number;
        freeShippingThreshold?: number;
    };
    regions?: DeliveryRegion[];
}

export interface DeliveryRegion {
    id: string;
    name: string; // Pode ser Cidade ou Bairro
    price: number;
    active: boolean;
}

export interface PaymentMethods {
    pix: boolean;
    creditCard: boolean;
    debitCard: boolean;
    boleto: boolean;
    boletoInstallment: boolean; // Boleto Parcelado
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  active?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  active: boolean;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  brandId?: string; // Novo
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  imageUrl: string;
  active: boolean;
  stockQuantity?: number; // Novo: Estoque atual
  minStockLevel?: number; // Novo: Nível de alerta
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

// --- ORDER MANAGEMENT ---

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'shipping' | 'delivered' | 'canceled';

export interface OrderTimelineEvent {
    status: OrderStatus;
    timestamp: string;
    description?: string;
}

export interface Order {
  id: string; // UUID or Short ID
  tenantId: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement?: string;
  };
  items: CartItem[];
  total: number;
  paymentMethod: 'pix' | 'credit_card' | 'debit_card' | 'boleto' | 'boleto_installment' | 'money';
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  timeline: OrderTimelineEvent[];
}

// Admin Metrics
export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
  positive: boolean;
}

// Notifications
export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    timestamp: string;
}

// SaaS / Super Admin Types
export type TicketStatus = 'open' | 'pending' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface SupportTicket {
    id: string;
    tenantId: string;
    tenantName: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    lastUpdate: string;
}

// --- CHAT & CONNECTION ---

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read'
}

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  status?: MessageStatus;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessage: string;
  timestamp: string;
  status: string;
}
