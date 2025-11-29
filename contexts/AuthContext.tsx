
import React, { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';
import { Tenant } from '../types';

interface AuthContextType {
  user: any | null;
  tenant: Tenant | null;
  loading: boolean;
  signOut: () => void;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(pb.authStore.model);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTenant = async (userId: string) => {
    try {
      // Busca o tenant onde 'owner' é igual ao ID do usuário
      const records = await pb.collection('tenants').getList(1, 1, {
          filter: `owner = "${userId}"`,
          expand: 'owner'
      });

      if (records.items.length > 0) {
         const data = records.items[0];
         
         const mappedTenant: Tenant = {
             id: data.id,
             name: data.name,
             slug: data.slug,
             primaryColor: data.primary_color || '#4B0082',
             whatsappNumber: data.whatsapp_number,
             bannerUrl: data.banner ? pb.files.getUrl(data, data.banner) : '',
             logoUrl: data.logo ? pb.files.getUrl(data, data.logo) : '',
             description: data.description,
             address: data.address,
             plan: data.plan,
             // Mapeia campos JSON se existirem
             paymentMethods: data.config_json?.paymentMethods,
             deliveryConfig: data.config_json?.deliveryConfig,
             openingHours: data.opening_hours,
             subscriptionStatus: data.subscription_status || 'trial',
             trialEndsAt: data.trial_ends_at, // DATA DO TRIAL
             ownerEmail: user?.email,
             isSuperAdmin: user?.is_super_admin
         };
         setTenant(mappedTenant);
      } else {
         setTenant(null); 
      }
    } catch (err) {
      console.error("Erro ao buscar tenant (PB):", err);
      setTenant(null);
    }
  };

  const refreshTenant = async () => {
    if (pb.authStore.isValid && pb.authStore.model) {
        await fetchTenant(pb.authStore.model.id);
    }
  };

  useEffect(() => {
    // Check initial session
    if (pb.authStore.isValid && pb.authStore.model) {
        setUser(pb.authStore.model);
        fetchTenant(pb.authStore.model.id).finally(() => setLoading(false));
    } else {
        setUser(null);
        setLoading(false);
    }

    // Listen to auth changes
    const removeListener = pb.authStore.onChange((token, model) => {
        setUser(model);
        if (model) {
            fetchTenant(model.id);
        } else {
            setTenant(null);
        }
    });

    return () => {
        removeListener();
    };
  }, []);

  const signOut = () => {
    pb.authStore.clear();
    setTenant(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, loading, signOut, refreshTenant }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
