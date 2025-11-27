
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Palette, LogOut, Settings, Store, BarChart3, ShoppingBag, Bell, Trash2, LifeBuoy, Tags, Grid, Clock, Lock } from 'lucide-react';
import { ToastContainer, Drawer, Logo, SupabaseWarning, Button } from './ui/Components';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { tenant } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  // --- TRIAL LOGIC ---
  let trialDaysLeft = 0;
  let isTrialExpired = false;

  if (tenant?.subscriptionStatus === 'trial' && tenant.trialEndsAt) {
      const end = new Date(tenant.trialEndsAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      trialDaysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (trialDaysLeft <= 0) isTrialExpired = true;
  }

  // --- BLOCK SCREEN IF EXPIRED ---
  if (isTrialExpired) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <Lock size={32} className="text-red-600" />
                  </div>
                  <div>
                      <h2 className="text-2xl font-bold text-gray-900">Período de Teste Expirou</h2>
                      <p className="text-gray-500 mt-2">Sua loja está bloqueada. Para continuar vendendo e acessando o painel, escolha um plano.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-left space-y-3">
                      <div className="flex justify-between font-medium">
                          <span>Plano Pro</span>
                          <span>R$ 49,90/mês</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-500">
                          <span>Plano Básico</span>
                          <span>R$ 29,90/mês</span>
                      </div>
                  </div>
                  <Button size="full" onClick={() => window.open('https://wa.me/5511999999999?text=Quero%20assinar%20o%20plano', '_blank')}>
                      Assinar Agora
                  </Button>
                  <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 underline">
                      Sair da conta
                  </button>
              </div>
          </div>
      );
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/admin/dashboard' },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders' }, 
    { icon: Package, label: 'Produtos', path: '/admin/products' },
    { icon: Grid, label: 'Categorias', path: '/admin/categories' }, 
    { icon: Tags, label: 'Marcas', path: '/admin/brands' }, 
    { icon: BarChart3, label: 'Relatórios', path: '/admin/reports' },
    { icon: Palette, label: 'Loja', path: '/admin/customize' },
    { icon: LifeBuoy, label: 'Ajuda', path: '/admin/support' },
    { icon: Settings, label: 'Config', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row font-sans text-gray-900">
      <SupabaseWarning />
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
             <Logo className="w-8 h-8 text-gray-900" />
             <span className="font-bold text-lg tracking-tight text-gray-900">Katalogo</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
           {/* Notification Trigger Desktop */}
           <button 
              onClick={() => setIsNotifOpen(true)}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors relative"
           >
              <Bell size={18} />
              Notificações
              {unreadCount > 0 && (
                  <span className="absolute right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                  </span>
              )}
           </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-1 safe-area-pb shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar">
        <nav className="flex justify-between items-center min-w-[320px]">
            {navItems.map((item) => {
              return (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[60px] ${
                        isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {({ isActive }) => (
                        <>
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[9px] font-medium mt-1 whitespace-nowrap">{item.label}</span>
                        </>
                    )}
                </NavLink>
              );
            })}
        </nav>
      </div>

      {/* --- MAIN CONTENT (BOXED) --- */}
      <main className="flex-1 md:ml-64 min-h-screen pb-24 md:pb-0 bg-gray-50 flex flex-col">
        
        {/* Trial Banner */}
        {tenant?.subscriptionStatus === 'trial' && trialDaysLeft > 0 && (
            <div className="bg-indigo-600 text-white px-4 py-2 text-xs font-bold flex justify-between items-center shadow-md z-30 relative">
                <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Seu teste grátis acaba em {trialDaysLeft} dias.</span>
                </div>
                <button onClick={() => navigate('/admin/settings#finance')} className="bg-white text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50 transition-colors">
                    Assinar Agora
                </button>
            </div>
        )}

        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <Logo className="w-6 h-6 text-gray-900" />
                 <span className="font-bold text-lg text-gray-900 tracking-tight">Katalogo</span>
             </div>
             <div className="flex items-center gap-3">
                 <button onClick={() => setIsNotifOpen(true)} className="relative text-gray-500">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                 </button>
                 <button onClick={handleLogout} className="text-gray-500">
                    <LogOut size={20} />
                 </button>
             </div>
        </div>

        {/* THE BOXED CONTAINER */}
        <div className="max-w-7xl mx-auto p-4 md:p-8 w-full flex-1">
          {children}
        </div>
      </main>
      
      {/* Notifications Drawer */}
      <Drawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} title="Notificações">
          <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{unreadCount} novas</span>
                  <div className="flex gap-3">
                      <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline font-medium">Marcar todas</button>
                      <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
              </div>
              
              <div className="space-y-2">
                  {notifications.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                          <Bell className="mx-auto mb-3 opacity-20" size={40} />
                          <p className="text-sm font-medium">Tudo limpo por aqui.</p>
                      </div>
                  ) : (
                      notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            onClick={() => markAsRead(notif.id)}
                            className={`p-3 rounded-lg border transition-all cursor-pointer relative group ${
                                notif.read ? 'bg-white border-gray-100 text-gray-500' : 'bg-blue-50/40 border-blue-100 text-gray-900'
                            }`}
                          >
                              {!notif.read && <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>}
                              <h4 className="font-semibold text-sm mb-1 pr-4">{notif.title}</h4>
                              <p className="text-xs mb-2 leading-relaxed opacity-90">{notif.message}</p>
                              <span className="text-[10px] text-gray-400">{notif.timestamp}</span>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </Drawer>

      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
