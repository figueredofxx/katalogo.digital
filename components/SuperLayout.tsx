
import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LifeBuoy, LogOut, Settings, Command, PieChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const SuperLayout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { tenant, loading } = useAuth();

  // Security Guard: Check if user is actually a super admin in DB
  useEffect(() => {
      if (!loading) {
          if (!tenant) {
              navigate('/login');
          } else if (!tenant.isSuperAdmin) {
              // Redirect unauthorized access back to normal dashboard
              navigate('/admin/dashboard');
          }
      }
  }, [tenant, loading, navigate]);

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/super-admin/dashboard' },
    { icon: Users, label: 'Lojas (Tenants)', path: '/super-admin/tenants' },
    { icon: LifeBuoy, label: 'Suporte', path: '/super-admin/support' },
    { icon: PieChart, label: 'Financeiro', path: '/super-admin/finance' },
    { icon: Settings, label: 'Config. SaaS', path: '/super-admin/settings' },
  ];

  if (loading || !tenant?.isSuperAdmin) return null; // Prevent flash of content

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* --- SAAS SIDEBAR (DARK THEME) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1e1b4b] border-r border-indigo-900 fixed h-full z-20 text-white shadow-2xl">
        <div className="p-5 border-b border-indigo-900/50 flex items-center gap-3">
          <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
            <Command className="text-white w-5 h-5" />
          </div>
          <div>
             <span className="font-bold text-lg tracking-tight block leading-none">Katalogo</span>
             <span className="text-[10px] text-indigo-300 uppercase tracking-wider font-bold">Super Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:text-white hover:bg-indigo-900/50 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' : 'text-indigo-200'}`}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-indigo-900/50">
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-indigo-900/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-400/30">SA</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Super Admin</p>
                    <p className="text-[10px] text-indigo-400 truncate">{tenant.ownerEmail}</p>
                </div>
            </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-indigo-300 hover:text-white hover:bg-indigo-900/50 transition-colors"
          >
            <LogOut size={18} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT (BOXED) --- */}
      <main className="flex-1 md:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-[#1e1b4b] text-white p-4 sticky top-0 z-10 flex items-center justify-between shadow-lg">
             <div className="flex items-center gap-2">
                 <Command className="text-indigo-400 w-5 h-5" />
                 <span className="font-bold">SaaS Admin</span>
             </div>
             <button onClick={handleLogout} className="text-indigo-300">
                <LogOut size={20} />
             </button>
        </div>

        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperLayout;
