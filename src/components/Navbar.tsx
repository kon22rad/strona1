import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Warehouse, Settings, LogOut, User, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client
import { Session } from '@supabase/supabase-js';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Redirect to home page after logout
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
            {session ? (
              <>
                {/* Sprawdzenie czy użytkownik to admin - można ulepszyć o role */} 
                {session.user?.email === 'admin@admin.com' ? (
                  <Link to="/admin/orders" className="flex items-center text-gray-700 hover:text-blue-600">
                    <Settings className="h-5 w-5 mr-1" /> Panel Admina
                  </Link>
                ) : (
                  <Link to="/customer-panel" className="flex items-center text-gray-700 hover:text-blue-600">
                    <User className="h-5 w-5 mr-1" /> Moje Konto
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5 mr-1" /> Wyloguj się
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-600">
                   <LogIn className="h-5 w-5 mr-1" /> Zaloguj się
                </Link>
                 {/* Można dodać link do rejestracji obok logowania, jeśli strona Login.tsx obsługuje przełączanie */} 
                 {/* <Link to="/login?register=true" className="text-gray-700 hover:text-blue-600">Zarejestruj się</Link> */} 
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;