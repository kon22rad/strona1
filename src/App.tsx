import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Warehouse } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Configurator from './pages/Configurator';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import AdminOrders from './pages/admin/Orders';
import AdminGallery from './pages/admin/Gallery';
import AdminStats from './pages/admin/Stats';
import AdminDashboard from './pages/admin/Dashboard';
import Login from './pages/Login';
import VisitorTracker from './components/VisitorTracker';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <VisitorTracker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/konfigurator" element={<Configurator />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery" element={
            <ProtectedRoute>
              <AdminGallery />
            </ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute>
              <AdminStats />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;