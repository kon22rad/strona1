import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Warehouse, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Warehouse className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MetallGaragen</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            {!isAdminPage && (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600">Startseite</Link>
                <Link to="/konfigurator" className="text-gray-700 hover:text-blue-600">Konfigurator</Link>
                <Link to="/galerie" className="text-gray-700 hover:text-blue-600">Galerie</Link>
                <Link to="/kontakt" className="text-gray-700 hover:text-blue-600">Kontakt</Link>
              </>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                  <Settings className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;