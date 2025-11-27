
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Tenant, SupportTicket } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useSuperAdmin = () => {
  const { tenant } = useAuth(); // Tenant do usuário logado (para verificar se é super admin)
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    basicPlanPrice: 29.90,
    proPlanPrice: 49.90,
    maintenanceMode: false,
    allowNewRegisters: true
  });

  useEffect(() => {
    const init = async () => {
        // Security Check
        if (!tenant?.isSuperAdmin) {
            // Em produção real, você pode verificar isso aqui ou no componente de rota
        }

        setLoading(true);
        try {
            // 1. Fetch ALL Tenants (Requer RLS permissiva para super admin ou service_role,
            // mas aqui assumimos que o usuário logado tem a flag is_super_admin e RLS ajustada ou uso de função RPC)
            const { data: allTenants } = await supabase.from('tenants').select('*');
            if (allTenants) {
                setTenants(allTenants.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    slug: t.slug,
                    primaryColor: t.primary_color,
                    whatsappNumber: t.whatsapp_number,
                    plan: t.plan,
                    ownerEmail: t.email, // Supondo que adicionamos email na tabela tenants
                    subscriptionStatus: t.subscription_status,
                    joinedAt: t.created_at
                })));
            }

            // 2. Fetch Tickets (Global)
            const { data: allTickets } = await supabase.from('support_tickets').select('*');
            if (allTickets) {
                setTickets(allTickets.map((t: any) => ({
                    id: t.id,
                    tenantId: t.tenant_id,
                    tenantName: 'Lojista', // Join seria ideal aqui
                    subject: t.subject,
                    status: t.status,
                    priority: t.priority,
                    createdAt: new Date(t.created_at).toLocaleDateString(),
                    lastUpdate: new Date(t.updated_at).toLocaleDateString()
                })));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    if (tenant) init();
  }, [tenant]);

  const toggleTenantStatus = async (tenantId: string) => {
    const current = tenants.find(t => t.id === tenantId);
    if (!current) return;
    
    const newStatus = current.subscriptionStatus === 'active' ? 'suspended' : 'active';
    
    const { error } = await supabase.from('tenants').update({ subscription_status: newStatus }).eq('id', tenantId);
    
    if (!error) {
        setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, subscriptionStatus: newStatus } : t));
    }
  };

  const updateTenantPlan = (tenantId: string, newPlan: 'basic' | 'pro') => {
      // Logic would go here
  };

  const resolveTicket = async (ticketId: string) => {
      await supabase.from('support_tickets').update({ status: 'closed' }).eq('id', ticketId);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t));
  };
  
  const replyTicket = (ticketId: string, message: string) => {
      console.log(`Replying to ticket ${ticketId}: ${message}`);
  };

  const updateSettings = (newSettings: Partial<typeof settings>) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const metrics = {
      mrr: tenants.reduce((acc, t) => acc + (t.plan === 'pro' ? settings.proPlanPrice : settings.basicPlanPrice), 0),
      activeTenants: tenants.filter(t => t.subscriptionStatus === 'active').length,
      churnRate: '1.2%',
      openTickets: tickets.filter(t => t.status === 'open').length
  };

  return {
      tenants,
      tickets,
      transactions,
      settings,
      metrics,
      loading,
      toggleTenantStatus,
      updateTenantPlan,
      resolveTicket,
      replyTicket,
      updateSettings
  };
};
