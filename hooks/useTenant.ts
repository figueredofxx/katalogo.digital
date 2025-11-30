
import { useState, useEffect } from 'react';
import { Tenant, Product, Category, Order } from '../types';
import { api, handleApiError } from '../lib/api';

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
        if (!identifier) throw new Error('Identificador da loja não especificado');

        // Endpoint público que retorna tudo da loja
        const { data } = await api.get(`/public/store/${identifier}`);
        
        setTenant(data.tenant);
        setProducts(data.products);
        setCategories(data.categories);

      } catch (err: any) {
        const { error: errMsg } = handleApiError(err);
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) fetchStoreData();
  }, [identifier]);

  // Rastreamento de Pedido
  const trackOrder = async (orderId: string): Promise<Order | null> => {
      try {
          const { data } = await api.get(`/public/orders/${orderId}`);
          return data;
      } catch (e) {
          console.error("Order not found", e);
          return null;
      }
  };

  const createOrder = async (order: Partial<Order>) => {
     try {
         if (!tenant) throw new Error("Loja não carregada");
         const { data } = await api.post(`/public/store/${tenant.slug}/orders`, order);
         return { data, error: null };
     } catch (e: any) {
         return handleApiError(e);
     }
  };

  const fetchCustomerOrders = async (phone: string) => {
      try {
          const { data } = await api.get(`/public/customer/orders?phone=${phone}&tenant=${tenant?.id}`);
          return data;
      } catch {
          return [];
      }
  };

  return { tenant, products, categories, loading, error, trackOrder, createOrder, fetchCustomerOrders };
};
