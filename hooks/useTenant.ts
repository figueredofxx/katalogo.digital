
import { useState, useEffect } from 'react';
import { Tenant, Product, Category, Order } from '../types';
import { supabase } from '../lib/supabase';

export const useTenant = (identifier?: string) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!identifier) {
            throw new Error('Identificador da loja não especificado');
        }

        // 1. Buscar Tenant pelo Slug OU Custom Domain
        // Usamos o operador .or() do Supabase para verificar as duas colunas
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .or(`slug.eq.${identifier},custom_domain.eq.${identifier}`)
          .single();

        if (tenantError || !tenantData) throw new Error('Loja não encontrada');

        const mappedTenant: Tenant = {
             id: tenantData.id,
             name: tenantData.name,
             slug: tenantData.slug,
             primaryColor: tenantData.primary_color || '#4B0082',
             whatsappNumber: tenantData.whatsapp_number,
             bannerUrl: tenantData.banner_url,
             logoUrl: tenantData.logo_url,
             description: tenantData.description,
             address: tenantData.address,
             plan: tenantData.plan,
             customDomain: tenantData.custom_domain,
             creditCardInterestRate: tenantData.credit_card_interest_rate,
             paymentMethods: tenantData.payment_methods_json || { pix: true, creditCard: true, money: true },
             deliveryConfig: tenantData.delivery_config,
             instagram: tenantData.instagram
        };
        setTenant(mappedTenant);

        // 2. Buscar Categorias
        const { data: catData } = await supabase
            .from('categories')
            .select('*')
            .eq('tenant_id', tenantData.id)
            .eq('active', true);
            
        setCategories(catData || []);

        // 3. Buscar Produtos
        const { data: prodData } = await supabase
            .from('products')
            .select('*')
            .eq('tenant_id', tenantData.id)
            .eq('active', true);

        if (prodData) {
             setProducts(prodData.map((p: any) => ({
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

      } catch (err: any) {
        console.error("Erro useTenant:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
        fetchStoreData();
    }
  }, [identifier]);

  // Rastreamento de Pedido Real
  const trackOrder = async (orderId: string): Promise<Order | null> => {
      // Validação básica de UUID para evitar erro no Postgres se o ID for inválido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(orderId)) return null;

      const { data } = await supabase.from('orders').select('*').eq('id', orderId).single();
      if (data) {
          return {
              id: data.id,
              tenantId: data.tenant_id,
              status: data.status,
              timeline: data.timeline_json || [],
              total: Number(data.total),
              items: data.items_json,
              createdAt: data.created_at,
              customerName: data.customer_name,
              customerPhone: data.customer_phone,
              deliveryMethod: data.delivery_method,
              paymentMethod: data.payment_method,
              notes: data.notes,
              address: data.address_json
          } as Order;
      }
      return null;
  };

  const createOrder = async (order: Partial<Order>) => {
     if (!tenant) return { error: 'Loja não carregada' };
     
     const payload = {
         tenant_id: tenant.id,
         customer_name: order.customerName,
         customer_phone: order.customerPhone,
         delivery_method: order.deliveryMethod,
         address_json: order.address,
         items_json: order.items,
         total: order.total,
         payment_method: order.paymentMethod,
         notes: order.notes,
         status: 'pending',
         timeline_json: [{ status: 'pending', timestamp: new Date().toISOString() }]
     };

     const { data, error } = await supabase.from('orders').insert([payload]).select().single();
     return { data, error };
  };

  const fetchCustomerOrders = async (phone: string) => {
      if (!tenant) return [];

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('tenant_id', tenant.id)
        .ilike('customer_phone', `%${phone}%`)
        .order('created_at', { ascending: false });

      if (data) {
          return data.map((o: any) => ({
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
      }
      return [];
  };

  return { tenant, products, categories, loading, error, trackOrder, createOrder, fetchCustomerOrders };
};
