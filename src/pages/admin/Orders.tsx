import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Check, X, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  created_at: string;
  config: {
    width: number;
    length: number;
    height: number;
    color: string;
    roofType: string;
    gateType: string;
    extras: string[];
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  total_price: number;
}

interface VisitorStats {
  total: number;
  byPage: Record<string, number>;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    total: 0,
    byPage: {}
  });

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    };

    const fetchVisitorStats = async () => {
      const { data, error } = await supabase
        .from('visitors')
        .select('page');

      if (error) {
        console.error('Error fetching visitors:', error);
        return;
      }

      const stats = {
        total: data.length,
        byPage: data.reduce((acc: Record<string, number>, curr) => {
          acc[curr.page] = (acc[curr.page] || 0) + 1;
          return acc;
        }, {})
      };

      setVisitorStats(stats);
    };

    fetchOrders();
    fetchVisitorStats();
  }, []);

  const updateOrderStatus = async (orderId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
      return;
    }

    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bestellungen verwalten</h1>
        <div className="flex space-x-4">
          <Link to="/admin/gallery" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Galerie verwalten
          </Link>
        </div>
      </div>

      {/* Visitor Statistics */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Besucherstatistiken</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">{visitorStats.total}</div>
            <div className="text-gray-600">Gesamtbesucher</div>
          </div>
          {Object.entries(visitorStats.byPage).map(([page, count]) => (
            <div key={page} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-gray-600">{page}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kunde
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konfiguration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                  <div className="text-sm text-gray-500">{order.customer.email}</div>
                  {order.customer.phone && (
                    <div className="text-sm text-gray-500">{order.customer.phone}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.config.width}x{order.config.length}x{order.config.height} cm
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.config.roofType}, {order.config.gateType}
                  </div>
                  {order.config.extras.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Extras: {order.config.extras.join(', ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.total_price.toLocaleString()} €
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'approved' ? 'bg-green-100 text-green-800' :
                    order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'approved' ? 'Genehmigt' :
                     order.status === 'rejected' ? 'Abgelehnt' :
                     'Ausstehend'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {order.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;