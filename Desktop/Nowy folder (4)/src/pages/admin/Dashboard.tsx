import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Image, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Bestellungen</h2>
              <p className="text-gray-600">Bestellungen verwalten</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/gallery"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <Image className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Galerie</h2>
              <p className="text-gray-600">Bilder verwalten</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/stats"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Statistiken</h2>
              <p className="text-gray-600">Besucherstatistiken anzeigen</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;