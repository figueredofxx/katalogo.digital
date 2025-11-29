
import { useState, useEffect, useCallback } from 'react';
import { pb } from '../lib/pocketbase';
import { Product, Category, Brand, DashboardMetric, Order, OrderStatus, SupportTicket } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { PLAN_LIMITS } from '../constants';

export const useAdmin = () => {
  const { tenant } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [loading, setLoading] = useState(false);

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);

    try {
      // 1. Fetch Categories
      const catRecords = await pb.collection('categories').getFullList({
          filter: `tenant = "${tenant.id}"`,
          sort: 'created'
      });
      setCategories(catRecords.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          imageUrl: c.image ? pb.files.getUrl(c, c.image) : '',
          active: true
      })));

      // 2. Fetch Products
      const prodRecords = await pb.collection('products').getFullList({
          filter: `tenant = "${tenant.id}"`,
          sort: '-created'
      });
      setProducts(prodRecords.map(p => ({
          id: p.id,
          tenantId: p.tenant,
          categoryId: p.category,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          promoPrice: p.promo_price ? Number(p.promo_price) : undefined,
          imageUrl: p.image ? pb.files.getUrl(p, p.image) : '',
          active: p.active,
          stockQuantity: p.stock_quantity,
          minStockLevel: p.min_stock_level
      })));

      // 3. Fetch Orders
      const orderRecords = await pb.collection('orders').getFullList({
          filter: `tenant = "${tenant.id}"`,
          sort: '-created'
      });
      
      const mappedOrders = orderRecords.map(o => ({
          id: o.id,
          tenantId: o.tenant,
          customerName: o.customer_json?.name || 'Cliente',
          customerPhone: o.customer_json?.phone || '',
          deliveryMethod: o.customer_json?.deliveryMethod,
          address: o.address_json,
          items: o.items_json,
          total: Number(o.total),
          paymentMethod: o.customer_json?.paymentMethod,
          notes: o.notes,
          status: o.status,
          createdAt: o.created,
          timeline: o.timeline_json || []
      }));
      setOrders(mappedOrders);

      // 4. Metrics Calc
      const totalSales = mappedOrders.reduce((acc, o) => acc + Number(o.total), 0) || 0;
      const countOrders = mappedOrders.length || 0;
      
      setMetrics([
          { label: 'Faturamento Total', value: `R$ ${totalSales.toFixed(2)}`, trend: '-', positive: true },
          { label: 'Total de Pedidos', value: countOrders.toString(), trend: '-', positive: true },
          { label: 'Ticket Médio', value: `R$ ${(countOrders > 0 ? totalSales / countOrders : 0).toFixed(2)}`, trend: '-', positive: true }
      ]);

    } catch (e) {
      console.error("Erro admin data (PB):", e);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  // Realtime Subscription
  useEffect(() => {
      if (!tenant) return;
      
      fetchData();

      // Subscribe to Orders changes
      pb.collection('orders').subscribe('*', function (e) {
          console.log("Realtime update:", e.action, e.record);
          fetchData(); // Reload data on any change
      });

      return () => {
          pb.collection('orders').unsubscribe('*');
      };
  }, [tenant, fetchData]);

  // --- ACTIONS ---

  const saveProduct = async (product: Partial<Product>) => {
    if (!tenant) return { error: 'No tenant' };

    // --- PLAN LIMIT CHECK (BACKEND GUARD) ---
    if (!product.id) { // Only check on creation
        const currentPlan = tenant.plan === 'pro' ? 'pro' : 'basic';
        const limit = PLAN_LIMITS[currentPlan].maxProducts;

        if (limit !== Infinity) {
            // Count current products (server-side verify)
            const countResult = await pb.collection('products').getList(1, 1, {
                filter: `tenant = "${tenant.id}"`,
            });
            
            if (countResult.totalItems >= limit) {
                return { error: `Limite do plano atingido (${limit} produtos). Faça upgrade para continuar.` };
            }
        }
    }

    // Prepare FormData for file upload support
    const formData = new FormData();
    formData.append('tenant', tenant.id);
    formData.append('name', product.name || '');
    formData.append('description', product.description || '');
    formData.append('price', String(product.price || 0));
    if (product.promoPrice) formData.append('promo_price', String(product.promoPrice));
    if (product.categoryId) formData.append('category', product.categoryId);
    formData.append('active', String(product.active));
    
    // Handle Image upload if necessary (simplified for mock/base64 scenarios)
    // In a real file upload, product.imageUrl would be a File object here.
    
    try {
        if (product.id) {
            await pb.collection('products').update(product.id, formData);
        } else {
            await pb.collection('products').create(formData);
        }
        await fetchData();
        return { error: null };
    } catch (e: any) {
        return { error: e.message };
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
        await pb.collection('products').delete(productId);
        await fetchData();
        return { error: null };
    } catch (e: any) {
        return { error: e.message };
    }
  };

  const saveCategory = async (category: Partial<Category>) => {
      if (!tenant) return { error: 'No tenant' };
      try {
          const data = {
              tenant: tenant.id,
              name: category.name,
              slug: category.name?.toLowerCase().replace(/\s+/g, '-'),
          };
          if (category.id) await pb.collection('categories').update(category.id, data);
          else await pb.collection('categories').create(data);
          
          await fetchData();
          return { error: null };
      } catch (e: any) {
          return { error: e.message };
      }
  };

  const deleteCategory = async (id: string) => {
      try {
          await pb.collection('categories').delete(id);
          await fetchData();
          return { error: null };
      } catch (e: any) {
          return { error: e.message };
      }
  };

  const saveBrand = async (brand: Partial<Brand>) => {
      return { error: null };
  };

  const deleteBrand = async (id: string) => {
      return { error: null };
  };

  const createTicket = async (subject: string, priority: string, message: string) => {
        try {
            if (!tenant) return { error: 'No tenant' };
             await pb.collection('support_tickets').create({
                tenant: tenant.id,
                subject,
                priority,
                message, // or description
                status: 'open'
             });
             return { error: null };
        } catch (e: any) {
             return { error: e.message || 'Error creating ticket' };
        }
    };

  const updateTenantSettings = async (updates: any) => {
    if (!tenant) return { error: 'No tenant' };
    
    // --- PLAN LIMIT CHECK FOR DOMAIN ---
    if (updates.customDomain) {
        const currentPlan = tenant.plan === 'pro' ? 'pro' : 'basic';
        if (!PLAN_LIMITS[currentPlan].allowCustomDomain) {
            // Silently strip custom domain or return error
            delete updates.customDomain;
            // Optionally: return { error: "Plano atual não permite domínio próprio" };
        }
    }

    // Merge config_json
    const configData = {
        paymentMethods: updates.paymentMethods || tenant.paymentMethods,
        deliveryConfig: updates.deliveryConfig || tenant.deliveryConfig
    };

    const payload = {
        name: updates.name,
        slug: updates.slug,
        primary_color: updates.primaryColor,
        whatsapp_number: updates.whatsappNumber,
        description: updates.description,
        address: updates.address,
        config_json: configData,
        custom_domain: updates.customDomain // Ensure mapping to snake_case for DB
    };

    // Remove undefined
    Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);

    try {
        await pb.collection('tenants').update(tenant.id, payload);
        return { error: null };
    } catch (e: any) {
        return { error: e.message };
    }
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
      try {
          await pb.collection('orders').update(orderId, { status: newStatus });
          // Timeline update logic would require fetching current, appending, and saving
          return { error: null };
      } catch (e: any) {
          return { error: e.message };
      }
  };

  return {
    products, categories, brands: [], // Brands not impl in this PB snippet
    metrics, orders, recentOrders: orders.slice(0, 5), tickets: [],
    loading,
    saveProduct, deleteProduct,
    saveCategory, deleteCategory,
    saveBrand, deleteBrand,
    updateTenantSettings, updateOrderStatus, 
    createTicket,
    refresh: fetchData
  };
};
