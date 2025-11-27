
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category, Brand, DashboardMetric, Order, OrderStatus, SupportTicket } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useAdmin = () => {
  const { tenant } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);

    try {
      // 1. Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*').eq('tenant_id', tenant.id);
      if (catData) setCategories(catData.map((c:any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          imageUrl: c.image_url,
          active: c.active
      })));

      // 2. Fetch Brands
      const { data: brandData } = await supabase.from('brands').select('*').eq('tenant_id', tenant.id);
      if (brandData) setBrands(brandData.map((b:any) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          imageUrl: b.image_url,
          active: b.active
      })));

      // 3. Fetch Products
      const { data: prodData } = await supabase.from('products').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false });
      if (prodData) {
          setProducts(prodData.map((p:any) => ({
              id: p.id,
              tenantId: p.tenant_id,
              categoryId: p.category_id,
              brandId: p.brand_id,
              name: p.name,
              description: p.description,
              price: Number(p.price),
              promoPrice: p.promo_price ? Number(p.promo_price) : undefined,
              imageUrl: p.image_url,
              active: p.active,
              stockQuantity: p.stock_quantity,
              minStockLevel: p.min_stock_level
          })));
      }

      // 4. Fetch Orders
      const { data: orderData } = await supabase.from('orders').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false });
      if (orderData) {
          const mappedOrders = orderData.map((o: any) => ({
              id: o.id,
              tenantId: o.tenant_id,
              customerName: o.customer_name,
              customerPhone: o.customer_phone,
              deliveryMethod: o.delivery_method,
              address: o.address_json,
              items: o.items_json,
              total: Number(o.total),
              paymentMethod: o.payment_method,
              notes: o.notes,
              status: o.status,
              createdAt: o.created_at,
              timeline: o.timeline_json || []
          }));
          setOrders(mappedOrders);
      }

      // 5. Fetch Tickets
      const { data: ticketData } = await supabase.from('support_tickets').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false });
      if (ticketData) {
          setTickets(ticketData.map((t:any) => ({
              id: t.id,
              tenantId: t.tenant_id,
              tenantName: tenant.name,
              subject: t.subject,
              status: t.status,
              priority: t.priority,
              createdAt: new Date(t.created_at).toLocaleDateString(),
              lastUpdate: new Date(t.updated_at).toLocaleDateString()
          })));
      }

      // 6. Metrics (Real Calc)
      const totalSales = orderData?.reduce((acc, o) => acc + Number(o.total), 0) || 0;
      const countOrders = orderData?.length || 0;
      
      setMetrics([
          { label: 'Faturamento Total', value: `R$ ${totalSales.toFixed(2)}`, trend: '-', positive: true },
          { label: 'Total de Pedidos', value: countOrders.toString(), trend: '-', positive: true },
          { label: 'Ticket Médio', value: `R$ ${(countOrders > 0 ? totalSales / countOrders : 0).toFixed(2)}`, trend: '-', positive: true }
      ]);

    } catch (e) {
      console.error("Erro ao carregar dados do admin", e);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- PRODUCT ACTIONS ---

  const saveProduct = async (product: Partial<Product>) => {
    if (!tenant) return { error: 'No tenant' };

    const payload = {
      tenant_id: tenant.id,
      name: product.name,
      description: product.description,
      price: product.price,
      promo_price: product.promoPrice || null,
      category_id: product.categoryId,
      brand_id: product.brandId,
      image_url: product.imageUrl,
      stock_quantity: product.stockQuantity,
      min_stock_level: product.minStockLevel,
      active: product.active
    };
    
    let error;
    if (product.id) {
      const { error: e } = await supabase.from('products').update(payload).eq('id', product.id);
      error = e;
    } else {
      const { error: e } = await supabase.from('products').insert([payload]);
      error = e;
    }
      
    if (!error) fetchData();
    return { error };
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (!error) setProducts(prev => prev.filter(p => p.id !== productId));
    return { error };
  };

  // --- CATEGORY ACTIONS ---

  const saveCategory = async (category: Partial<Category>) => {
      if (!tenant) return { error: 'No tenant' };
      
      const payload = {
          tenant_id: tenant.id,
          name: category.name,
          slug: category.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'cat',
          image_url: category.imageUrl,
          active: category.active
      };

      let error;
      if (category.id) {
          const { error: e } = await supabase.from('categories').update(payload).eq('id', category.id);
          error = e;
      } else {
          const { error: e } = await supabase.from('categories').insert([payload]);
          error = e;
      }
      if (!error) fetchData();
      return { error };
  };

  const deleteCategory = async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) fetchData();
      return { error };
  };

  // --- BRAND ACTIONS ---

  const saveBrand = async (brand: Partial<Brand>) => {
      if (!tenant) return { error: 'No tenant' };

      const payload = {
          tenant_id: tenant.id,
          name: brand.name,
          slug: brand.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'brand',
          image_url: brand.imageUrl,
          active: brand.active
      };

      let error;
      if (brand.id) {
          const { error: e } = await supabase.from('brands').update(payload).eq('id', brand.id);
          error = e;
      } else {
          const { error: e } = await supabase.from('brands').insert([payload]);
          error = e;
      }
      if (!error) fetchData();
      return { error };
  };

  const deleteBrand = async (id: string) => {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (!error) fetchData();
      return { error };
  };

  // --- SETTINGS ACTIONS ---

  const updateTenantSettings = async (updates: any) => {
    if (!tenant) return { error: 'No tenant' };
    
    const dbUpdates: any = {
       name: updates.name,
       slug: updates.slug,
       primary_color: updates.primaryColor,
       banner_url: updates.bannerUrl,
       logo_url: updates.logoUrl,
       whatsapp_number: updates.whatsappNumber,
       description: updates.description,
       address: updates.address,
       instagram: updates.instagram,
       opening_hours: updates.openingHours,
       custom_domain: updates.customDomain,
       credit_card_interest_rate: updates.creditCardInterestRate,
       payment_methods_json: updates.paymentMethods,
       delivery_config: updates.deliveryConfig,
       order_control_mode: updates.orderControlMode
    };

    // Remove undefined
    Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

    const { error } = await supabase.from('tenants').update(dbUpdates).eq('id', tenant.id);
    return { error };
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
      if (!tenant) return { error: 'No tenant' };

      const currentOrder = orders.find(o => o.id === orderId);
      const newEvent = { status: newStatus, timestamp: new Date().toISOString() };
      const updatedTimeline = currentOrder ? [...currentOrder.timeline, newEvent] : [newEvent];

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, timeline_json: updatedTimeline })
        .eq('id', orderId);

      if (!error) {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, timeline: updatedTimeline } : o));
      }
      return { error };
  };

  const createTicket = async (subject: string, priority: 'low' | 'medium' | 'high', message: string) => {
      if (!tenant) return { error: 'No tenant' };

      const { error } = await supabase.from('support_tickets').insert([{
          tenant_id: tenant.id,
          subject: subject,
          priority: priority,
          message: message,
          status: 'open'
      }]);

      if (!error) fetchData();
      return { error };
  };

  const recentOrders = orders.slice(0, 5);

  return {
    products, categories, brands,
    metrics, orders, recentOrders, tickets, loading,
    saveProduct, deleteProduct,
    saveCategory, deleteCategory,
    saveBrand, deleteBrand,
    updateTenantSettings, updateOrderStatus, createTicket, refresh: fetchData
  };
};
