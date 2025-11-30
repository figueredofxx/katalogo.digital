import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Tenant, SupportTicket } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useSuperAdmin = () => {
  const { tenant } = useAuth();
  
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
            return;
        }

        setLoading(true);
        try {
            // 1. Fetch ALL Tenants
            const { data: allTenants } = await api.get('/super-admin/tenants');
            
            setTenants(allTenants.map((t: any) => ({
                id: t._id || t.id,
                name: t.name,
                slug: t.slug,
                primaryColor: t.primary_color,
                whatsappNumber: t.whatsapp_number,
                plan: t.plan,
                ownerEmail: t.owner?.email || '',
                subscriptionStatus: t.subscription_status,
                joinedAt: t.createdAt,
                isSuperAdmin: t.isSuperAdmin || false
            })));

            // 2. Fetch Tickets (Global)
            const { data: allTickets } = await api.get('/super-admin/tickets');

            setTickets(allTickets.map((t: any) => ({
                id: t._id || t.id,
                tenantId: t.tenant?._id || t.tenant,
                tenantName: t.tenant?.name || 'Lojista', 
                subject: t.subject,
                status: t.status,
                priority: t.priority,
                createdAt: new Date(t.createdAt).toLocaleDateString(),
                lastUpdate: new Date(t.updatedAt).toLocaleDateString()
            })));
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
    
    try {
        await api.patch(`/super-admin/tenants/${tenantId}/status`, { status: newStatus });
        setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, subscriptionStatus: newStatus } : t));
    } catch (e) {
        console.error("Error updating status", e);
    }
  };

  const updateTenantPlan = (tenantId: string, newPlan: 'basic' | 'pro') => {
      // Logic would go here
  };

  const resolveTicket = async (ticketId: string) => {
      try {
        await api.patch(`/super-admin/tickets/${ticketId}`, { status: 'closed' });
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t));
      } catch(e) { console.error(e); }
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