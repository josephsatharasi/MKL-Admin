import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, AlertTriangle, Menu, X, LogOut } from 'lucide-react';
import logo from '../assets/logo.JPG';

const Layout = ({ children, setIsLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/customers', icon: Users, label: 'Customer Profile' },
    { path: '/admin/add-customer', icon: UserPlus, label: 'Add Customer' },
    { path: '/admin/expiry-alerts', icon: AlertTriangle, label: 'Services' },
  ];

  return (
    <div className="flex h-screen bg-teal-50">
      {/* Desktop Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-teal-600 to-teal-700 text-white transition-all duration-300 hidden md:flex flex-col shadow-xl`}>
        <div className="p-4 flex items-center justify-between border-b border-teal-500">
          {isSidebarOpen && (
            <img src={logo} alt="MKL" className="h-12 bg-white p-1 rounded" />
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:text-teal-200">
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 mb-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'hover:bg-teal-600 text-teal-50'
                }`}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div className="p-4 border-t border-teal-500">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-teal-600 to-teal-700 text-white z-50" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between border-b border-teal-500">
              <img src={logo} alt="MKL" className="h-12 bg-white p-1 rounded" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                <X size={20} />
              </button>
            </div>
            
            <nav className="p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 mb-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-teal-500 text-white'
                        : 'hover:bg-teal-600 text-teal-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-teal-700">
              <Menu size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-teal-700">MKL Water Purifier Admin</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-teal-600 hidden md:block">Admin Panel</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
