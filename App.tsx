
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import AdminLayout from './components/Layout';
import SuperLayout from './components/SuperLayout';
import Dashboard from './pages/admin/Dashboard';
import Customize from './pages/admin/Customize';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Brands from './pages/admin/Brands';
import Orders from './pages/admin/Orders';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import TenantSupport from './pages/admin/TenantSupport'; 
import SuperDashboard from './pages/super-admin/SuperDashboard'; 
import Tenants from './pages/super-admin/Tenants'; 
import Support from './pages/super-admin/Support'; 
import Finance from './pages/super-admin/Finance';
import SaaSSettings from './pages/super-admin/SaaSSettings';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import PlanCheckout from './pages/PlanCheckout';
import Onboarding from './pages/Onboarding';
import LandingPage from './pages/LandingPage';
import StoreFront from './pages/store/StoreFront';
import OrderTracking from './pages/store/OrderTracking';
import CustomerArea from './pages/store/CustomerArea';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SupabaseWarning, ToastContainer } from './components/ui/Components';

// --- LÓGICA DE DETECÇÃO DE AMBIENTE ---
const getAppMode = (): 'landing' | 'app' | 'store' => {
    const hostname = window.location.hostname;

    // 1. Landing Page (katalogo.digital ou www.katalogo.digital)
    if (hostname === 'katalogo.digital' || hostname === 'www.katalogo.digital') {
        return 'landing';
    }

    // 2. Sistema / Admin (app.katalogo.digital ou localhost para desenvolvimento do painel)
    // Nota: Mantemos localhost aqui para facilitar dev, mas em produção o admin é 'app.'
    if (hostname === 'app.katalogo.digital' || hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'app';
    }

    // 3. Loja (Qualquer outro subdomínio ex: lojamaria.katalogo.digital ou domínio próprio)
    return 'store';
};

const AdminRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen flex items-center justify-center text-gray-500 text-sm">Carregando aplicação...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

// Wrapper para Lojas (Storefront)
const StoreWrapper = () => {
    const params = useParams<{slug?: string}>();
    const hostname = window.location.hostname;
    
    let identifier = params.slug;

    // Se não houver slug na URL (rota raiz), tentar inferir pelo subdomínio
    if (!identifier) {
        if (hostname.includes('katalogo.digital')) {
            // É um subdomínio (ex: lojamaria.katalogo.digital)
            const parts = hostname.split('.');
            // Ignora 'app' ou 'www' se por acaso caírem aqui
            if (parts[0] !== 'app' && parts[0] !== 'www') {
                identifier = parts[0];
            }
        } else {
            // É um domínio próprio completo (ex: lojamaria.com.br)
            identifier = hostname;
        }
    }

    // Fallback para dev/demo se não conseguir identificar
    if (!identifier && (hostname === 'localhost' || hostname === '127.0.0.1')) {
        identifier = 'demo';
    }

    return (
        <Routes>
            <Route path="/" element={<StoreFront subdomain={identifier} />} />
            <Route path="/track/:orderId" element={<OrderTracking />} />
            <Route path="/account" element={<CustomerArea />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

// Rotas do Sistema Administrativo (app.katalogo.digital)
const AppRoutes = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
            {/* Rotas Públicas de Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout-plan" element={<PlanCheckout />} />
            
            {/* Redireciona a raiz do 'app' para login ou dashboard */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rotas Protegidas */}
            <Route path="/onboarding" element={<AdminRouteWrapper><Onboarding /></AdminRouteWrapper>} />
            
            {/* Tenant Admin */}
            <Route path="/admin/*" element={
                <AdminRouteWrapper>
                    <AdminLayout>
                        <Routes>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="customize" element={<Customize />} />
                            <Route path="products" element={<Products />} />
                            <Route path="categories" element={<Categories />} />
                            <Route path="brands" element={<Brands />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="support" element={<TenantSupport />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </AdminLayout>
                </AdminRouteWrapper>
            } />

            {/* Super Admin */}
            <Route path="/super-admin/*" element={
                <AdminRouteWrapper>
                    <SuperLayout>
                        <Routes>
                            <Route path="dashboard" element={<SuperDashboard />} />
                            <Route path="tenants" element={<Tenants />} />
                            <Route path="support" element={<Support />} />
                            <Route path="finance" element={<Finance />} />
                            <Route path="settings" element={<SaaSSettings />} />
                            <Route path="*" element={<div className="p-8">Em construção...</div>} />
                        </Routes>
                    </SuperLayout>
                </AdminRouteWrapper>
            } />
            
            {/* Rota de Fallback para Links de Rastreio Direto no domínio App */}
            <Route path="/track/:orderId" element={<OrderTracking />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default function App() {
  const [mode, setMode] = useState<'landing' | 'app' | 'store'>(getAppMode());

  return (
    <HashRouter>
      <SupabaseWarning />
      <ToastContainer />
      
      {mode === 'landing' && (
          <Routes>
              <Route path="*" element={<LandingPage />} />
          </Routes>
      )}

      {mode === 'app' && <AppRoutes />}

      {mode === 'store' && (
          <Routes>
              <Route path="/*" element={<StoreWrapper />} />
          </Routes>
      )}
    </HashRouter>
  );
}
