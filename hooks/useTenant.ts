
import { useState, useEffect } from 'react';
import { Tenant, Product, Category, Order } from '../types';
import { pb } from '../lib/pocketbase';

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

        // 1. Buscar Tenant pelo Slug
        const tenantRecord = await pb.collection('tenants').getFirstListItem(`slug="${identifier}"`);

        if (!tenantRecord) throw new Error('Loja não encontrada');

        const mappedTenant: Tenant = {
             id: tenantRecord.id,
             name: tenantRecord.name,
             slug: tenantRecord.slug,
             primaryColor: tenantRecord.primary_color || '#4B0082',
             whatsappNumber: tenantRecord.whatsapp_number,
             bannerUrl: tenantRecord.banner ? pb.files.getUrl(tenantRecord, tenantRecord.banner) : '',
             logoUrl: tenantRecord.logo ? pb.files.getUrl(tenantRecord, tenantRecord.logo) : '',
             description: tenantRecord.description,
             address: tenantRecord.address,
             plan: tenantRecord.plan,
             paymentMethods: tenantRecord.config_json?.paymentMethods,
             deliveryConfig: tenantRecord.config_json?.deliveryConfig,
             instagram: tenantRecord.instagram,
             openingHours: tenantRecord.opening_hours
        };
        setTenant(mappedTenant);

        // 2. Buscar Categorias
        const catRecords = await pb.collection('categories').getList(1, 50, {
            filter: `tenant = "${tenantRecord.id}"`,
            sort: 'created'
        });
            
        setCategories(catRecords.items.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            active: true
        })));

        // 3. Buscar Produtos
        const prodRecords = await pb.collection('products').getList(1, 200, {
            filter: `tenant = "${tenantRecord.id}" && active = true`,
            sort: '-created'
        });

        if (prodRecords.items) {
             setProducts(prodRecords.items.map((p: any) => ({
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
        }

      } catch (err: any) {
        console.error("Erro useTenant (PB):", err);
        setError(err.message || 'Erro ao carregar loja');
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
        fetchStoreData();
    }
  }, [identifier]);

  // Rastreamento de Pedido
  const trackOrder = async (orderId: string): Promise<Order | null> => {
      try {
          const data = await pb.collection('orders').getOne(orderId);
          if (data) {
              return {
                  id: data.id,
                  tenantId: data.tenant,
                  status: data.status,
                  timeline: data.timeline_json || [],
                  total: Number(data.total),
                  items: data.items_json,
                  createdAt: data.created,
                  customerName: data.customer_json?.name,
                  customerPhone: data.customer_json?.phone,
                  deliveryMethod: data.customer_json?.deliveryMethod,
                  paymentMethod: data.customer_json?.paymentMethod,
                  notes: data.notes,
                  address: data.address_json
              } as Order;
          }
      } catch (e) {
          console.error("Order not found", e);
      }
      return null;
  };

  const createOrder = async (order: Partial<Order>) => {
     if (!tenant) return { error: 'Loja não carregada' };
     
     const payload = {
         tenant: tenant.id,
         total: order.total,
         status: 'pending',
         customer_json: {
             name: order.customerName,
             phone: order.customerPhone,
             deliveryMethod: order.deliveryMethod,
             paymentMethod: order.paymentMethod
         },
         address_json: order.address,
         items_json: order.items,
         notes: order.notes,
         timeline_json: [{ status: 'pending', timestamp: new Date().toISOString() }]
     };

     try {
         const record = await pb.collection('orders').create(payload);
         return { data: { id: record.id }, error: null };
     } catch (e: any) {
         return { data: null, error: e.message };
     }
  };

  const fetchCustomerOrders = async (phone: string) => {
      // Not implemented for generic tenant view yet due to privacy, 
      // but logic would filter orders where customer_json.phone = phone
      return [];
  };

  return { tenant, products, categories, loading, error, trackOrder, createOrder, fetchCustomerOrders };
};
