import React from 'react';
import { BookOpen, PenTool, LayoutGrid, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <BookOpen className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Gilber Blog</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/">
              <button className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Feed</span>
              </button>
            </Link>
            
            {/* If logged in, show Admin button, otherwise hiding it implies only admins know the route (or we can show it and it redirects) */}
            <Link to="/admin">
              <button className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
                <PenTool className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </Link>

            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ml-2 border border-transparent hover:border-red-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};