
import { useState, useEffect, useCallback } from 'react';
import { api, handleApiError } from '../lib/api';
import { Product, Category, Brand, DashboardMetric, Order, OrderStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useAdmin = () => {
  const { tenant } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);

    try {
      // Paraleliza as requisições para performance
      const [catsRes, prodsRes, ordersRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
          api.get('/orders')
      ]);

      setCategories(catsRes.data);
      setProducts(prodsRes.data);
      
      // Mapeamento de Orders (ajuste conforme retorno do Mongo)
      const mappedOrders = ordersRes.data.map((o: any) => ({
          ...o,
          id: o._id || o.id, // Mongo usa _id
          // Garantir compatibilidade de tipos
          total: Number(o.total)
      }));
      setOrders(mappedOrders);

      // Calculo de Métricas (Simples)
      const totalSales = mappedOrders.reduce((acc: number, o: Order) => acc + Number(o.total), 0);
      const countOrders = mappedOrders.length;
      
      setMetrics([
          { label: 'Faturamento Total', value: `R$ ${totalSales.toFixed(2)}`, trend: '-', positive: true },
          { label: 'Total de Pedidos', value: countOrders.toString(), trend: '-', positive: true },
          { label: 'Ticket Médio', value: `R$ ${(countOrders > 0 ? totalSales / countOrders : 0).toFixed(2)}`, trend: '-', positive: true }
      ]);

    } catch (e) {
      console.error("Erro carregando dados:", e);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
      if (tenant) fetchData();
      // Polling simples para substituir realtime do PocketBase (ou implementar Socket.io depois)
      const interval = setInterval(() => {
          if(tenant) fetchData();
      }, 15000); 
      return () => clearInterval(interval);
  }, [tenant, fetchData]);

  // --- ACTIONS ---

  const saveProduct = async (product: Partial<Product>) => {
    try {
        if (product.id) {
            await api.put(`/products/${product.id}`, product);
        } else {
            await api.post('/products', product);
        }
        await fetchData();
        return { error: null };
    } catch (e: any) {
        return handleApiError(e);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
        await api.delete(`/products/${productId}`);
        await fetchData();
        return { error: null };
    } catch (e: any) {
        return handleApiError(e);
    }
  };

  const saveCategory = async (category: Partial<Category>) => {
      try {
          if (category.id) await api.put(`/categories/${category.id}`, category);
          else await api.post('/categories', category);
          await fetchData();
          return { error: null };
      } catch (e: any) {
          return handleApiError(e);
      }
  };

  const deleteCategory = async (id: string) => {
      try {
          await api.delete(`/categories/${id}`);
          await fetchData();
          return { error: null };
      } catch (e: any) {
          return handleApiError(e);
      }
  };

  const saveBrand = async (brand: Partial<Brand>) => { return { error: null }; }; // Stub
  const deleteBrand = async (id: string) => { return { error: null }; }; // Stub

  const createTicket = async (subject: string, priority: string, message: string) => {
        try {
             await api.post('/tickets', { subject, priority, message });
             return { error: null };
        } catch (e: any) {
             return handleApiError(e);
        }
    };

  const updateTenantSettings = async (updates: any) => {
    try {
        await api.put('/tenant/settings', updates);
        return { error: null };
    } catch (e: any) {
        return handleApiError(e);
    }
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
      try {
          await api.patch(`/orders/${orderId}/status`, { status: newStatus });
          await fetchData();
          return { error: null };
      } catch (e: any) {
          return handleApiError(e);
      }
  };

  return {
    products, categories, brands: [],
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
