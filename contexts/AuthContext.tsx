
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Tenant } from '../types';

interface AuthContextType {
  user: any | null;
  tenant: Tenant | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTenant = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
         // Map database snake_case to TypeScript camelCase
         const mappedTenant: Tenant = {
             id: data.id,
             name: data.name,
             slug: data.slug,
             primaryColor: data.primary_color || '#4B0082',
             whatsappNumber: data.whatsapp_number,
             bannerUrl: data.banner_url,
             logoUrl: data.logo_url,
             description: data.description,
             address: data.address,
             plan: data.plan,
             customDomain: data.custom_domain,
             creditCardInterestRate: data.credit_card_interest_rate,
             paymentMethods: data.payment_methods_json,
             deliveryConfig: data.delivery_config,
             orderControlMode: data.order_control_mode,
             instagram: data.instagram,
             openingHours: data.opening_hours,
             subscriptionStatus: data.subscription_status,
             trialEndsAt: data.trial_ends_at, // Novo Campo Mapeado
             ownerEmail: user?.email
         };
         setTenant(mappedTenant);
      } else {
         setTenant(null); 
      }
    } catch (err) {
      console.error("Erro ao buscar tenant:", err);
      setTenant(null);
    }
  };

  const refreshTenant = async () => {
    if (user) await fetchTenant(user.id);
  };

  useEffect(() => {
    const checkSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchTenant(session.user.id);
            }
        } catch (error) {
            console.error("Erro auth:", error);
        } finally {
            setLoading(false);
        }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchTenant(session.user.id);
      } else {
        setTenant(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
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
