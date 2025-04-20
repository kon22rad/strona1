import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Remove unused import
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Configurator from './pages/Configurator';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
// Usunięto zduplikowane importy
import AdminDashboard from './pages/admin/Dashboard';
import AdminStats from './pages/admin/Stats';
import AdminGalleryManager from './pages/admin/GalleryManager';
import AdminOrders from './pages/admin/orders'; // Poprawiono wielkość liter w nazwie pliku
import CustomerPanel from './pages/CustomerPanel';
import ProtectedRoute from './components/ProtectedRoute'; // Zachowano importowany komponent
import Login from './pages/Login';
// Usunięto zduplikowany import CustomerPanel
import VisitorTracker from './components/VisitorTracker';
import { supabase } from './lib/supabaseClient'; // Import shared Supabase client

// Usunięto lokalną definicję ProtectedRoute

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (isMounted) {
          setIsAuthenticated(!!session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking initial session:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthenticated(!!session);
        setIsLoading(false); // Update loading state on auth change too
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <BrowserRouter>
      <VisitorTracker />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/konfigurator" element={<Configurator />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/login" element={<Login />} />

        {/* Panel Klienta - chroniony */}
        <Route
          path="/panel-klienta"
          element={
            <ProtectedRoute>
              <CustomerPanel />
            </ProtectedRoute>
          }
        />

        {/* Panel Admina - chroniony */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute>
              <AdminGalleryManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute>
              <AdminStats />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;