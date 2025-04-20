import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Import shared Supabase client
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
  status: string; // Changed to string to handle more statuses
  total_price: number;
}

interface VisitorStats {
  total: number;
  byPage: Record<string, number>;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Usunięto lokalną inicjalizację klienta Supabase

  // Definicja możliwych statusów zamówienia
  const orderStatuses: Array<{ value: string; label: string }> = [
    { value: 'pending', label: 'Oczekujące' }, // Dodano brakujący przecinek
    { value: 'approved', label: 'Zatwierdzone' },
    { value: 'shipped', label: 'Wysłane' },
    { value: 'delivered', label: 'Dostarczone' }, // Dodano 'Dostarczone' (Odebrane)
    { value: 'rejected', label: 'Odrzucone' },
  ];

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

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
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

  // Funkcje pomocnicze do statusów (można przenieść do utils)
  const translateStatus = (status: string): string => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bestellungen verwalten</h1>
        {/* Usunięto tymczasowe linki */}
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
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {translateStatus(order.status)} {/* Użycie funkcji pomocniczych */}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* Rozwijana lista do zmiany statusu */}
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    // Simplified dynamic classes
                    className={`border rounded px-2 py-1 text-sm ${getStatusSelectClasses(order.status)}`}
                  >
                    {orderStatuses.map((statusOption) => (
                      <option key={statusOption.value} value={statusOption.value}>
                        {statusOption.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function for select element classes (can be moved to utils)
const getStatusSelectClasses = (status: string): string => {
  switch (status) {
    case 'pending': return 'border-yellow-300 bg-yellow-50 text-yellow-800';
    case 'approved': return 'border-blue-300 bg-blue-50 text-blue-800';
    case 'shipped': return 'border-indigo-300 bg-indigo-50 text-indigo-800';
    case 'delivered': return 'border-green-300 bg-green-50 text-green-800';
    case 'rejected': return 'border-red-300 bg-red-50 text-red-800';
    default: return 'border-gray-300 bg-gray-50 text-gray-800';
  }
};

export default AdminOrders;