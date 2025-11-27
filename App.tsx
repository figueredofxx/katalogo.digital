
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
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
import { SupabaseWarning } from './components/ui/Components';

// Função aprimorada para detectar o modo do app baseado no domínio
const getAppMode = (): 'admin' | 'store' | 'super-admin' => {
    const hostname = window.location.hostname;
    
    // Lista de domínios que são considerados "Admin" ou "Landing Page"
    const adminDomains = [
        'katalogo.digital',
        'www.katalogo.digital',
        'app.katalogo.digital',
        'admin.katalogo.digital',
        'localhost', 
        '127.0.0.1'
    ];

    if (adminDomains.includes(hostname)) {
        return 'admin';
    }
    
    // Se não for um domínio admin, assumimos que é uma LOJA (seja subdomínio ou domínio próprio)
    return 'store';
};

const AdminRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

// Updated StoreWrapper to correctly handle slug OR custom domain
const StoreWrapper = () => {
    const params = useParams<{slug?: string}>();
    const hostname = window.location.hostname;
    
    let identifier = params.slug;

    if (!identifier) {
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            identifier = 'demo';
        } else if (hostname.includes('katalogo.digital')) {
            // É um subdomínio (ex: lojamaria.katalogo.digital)
            const parts = hostname.split('.');
            if (parts[0] === 'www' && parts.length > 3) {
                identifier = parts[1];
            } else if (parts[0] !== 'www') {
                identifier = parts[0];
            }
        } else {
            // É um domínio próprio completo
            identifier = hostname;
        }
    }

    return (
        <Routes>
            <Route index element={<StoreFront subdomain={identifier} />} />
            <Route path="track/:orderId" element={<OrderTracking />} />
            <Route path="account" element={<CustomerArea />} />
            <Route path="*" element={<Navigate to="" />} />
        </Routes>
    );
}

const AdminRoutes = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout-plan" element={<PlanCheckout />} />
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
                        <Route path="*" element={<Navigate to="dashboard" />} />
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
        
        {/* Store Public Routes (Accessible via path even on admin domain for testing) */}
        <Route path="/store/:slug/*" element={<StoreWrapper />} />
        
        {/* Direct Tracking Link */}
        <Route path="/track/:orderId" element={<OrderTracking />} />

        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default function App() {
  const [mode, setMode] = useState<'admin' | 'store' | 'super-admin'>(getAppMode());

  // Listen to hash changes (cleaner logic for production routing)
  useEffect(() => {
      const handleHashChange = () => {
          if (window.location.hash.includes('/store')) setMode('admin');
      };
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <HashRouter>
      <SupabaseWarning />
      {mode === 'store' ? <StoreWrapper /> : <AdminRoutes />}
    </HashRouter>
  );
}
