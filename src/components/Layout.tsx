import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, Plus, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white shadow-lg">
          <div className="flex items-center flex-shrink-0 px-6">
            <h1 className="text-2xl font-bold text-blue-600">Secosha</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 pb-4 space-y-2">
              <Link
                to="/"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Browse Items
              </Link>
              <Link
                to="/account"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/account') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                My Account
              </Link>
              <Link
                to="/settings"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/settings') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav className="flex justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center py-2 px-4 ${
              isActive('/') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Browse</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center py-2 px-4 ${
              isActive('/search') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <Link
            to="/create"
            className={`flex flex-col items-center py-2 px-4 ${
              isActive('/create') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs mt-1">Sell</span>
          </Link>
          <Link
            to="/account"
            className={`flex flex-col items-center py-2 px-4 ${
              isActive('/account') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Account</span>
          </Link>
          <Link
            to="/settings"
            className={`flex flex-col items-center py-2 px-4 ${
              isActive('/settings') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;