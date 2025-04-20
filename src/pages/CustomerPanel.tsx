import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Placeholder for order type - define this more accurately later
interface Order {
  id: string;
  created_at: string;
  status: string; // np. 'pending', 'approved', 'shipped', 'delivered', 'rejected'
  // Możesz dodać inne szczegóły zamówienia, jeśli są dostępne w bazie
  // config?: any; // Jeśli chcesz wyświetlić szczegóły konfiguracji
  // total_price?: number;
}

const CustomerPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      setLoading(true);
      setError(null);

      // 1. Check session and get user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('Error fetching session or no session:', sessionError);
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      const user = session.user;
      if (!user) {
        navigate('/login');
        return;
      }
      setUserEmail(user.email || 'Nieznany email');

      // 2. Fetch orders for the logged-in user
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders') // Używamy tabeli 'orders'
        .select('*') // Pobieramy wszystkie kolumny
        .eq('user_id', user.id) // Filtrujemy zamówienia po ID zalogowanego użytkownika
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        setError('Nie udało się załadować zamówień.');
      } else {
        // Mapujemy dane z Supabase do interfejsu Order
        const fetchedOrders: Order[] = (ordersData || []).map((dbOrder: any) => ({
          id: dbOrder.id,
          created_at: dbOrder.created_at,
          status: dbOrder.status || 'Nieznany', // Pobieramy status
          // Możesz dodać mapowanie innych pól zamówienia tutaj
          // config: dbOrder.config,
          // total_price: dbOrder.total_price,
        }));
        setOrders(fetchedOrders);
      }

      setLoading(false);
    };

    fetchUserDataAndOrders();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      navigate('/'); // Redirect to home page after logout
    }
  };

  // Funkcje pomocnicze do statusów
  const translateStatus = (status: string): string => {
    switch (status) {
      case 'pending': return 'Oczekujące';
      case 'approved': return 'Zatwierdzone';
      case 'shipped': return 'Wysłane';
      case 'delivered': return 'Dostarczone';
      case 'rejected': return 'Odrzucone';
      default: return status; // Zwróć oryginalny status, jeśli nie ma tłumaczenia
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800'; // Zmieniono kolor dla 'approved'
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel Klienta</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Wyloguj się
        </button>
      </div>

      {userEmail && <p className="mb-6 text-gray-700">Zalogowano jako: <strong>{userEmail}</strong></p>}

      <h2 className="text-2xl font-semibold mb-4">Twoje Zamówienia</h2>

      {loading && <p>Ładowanie zamówień...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <p>Nie masz jeszcze żadnych zamówień.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">Zamówienie #{order.id.substring(0, 8)}...</h3>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Data złożenia: {new Date(order.created_at).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  {/* Możesz dodać więcej szczegółów zamówienia tutaj, jeśli są dostępne w 'order' */}
                  {/* np. <p>Cena: {order.total_price} zł</p> */}
                  {/* np. <p>Konfiguracja: {JSON.stringify(order.config)}</p> */}
                </div>
              ))}
            </div>
          )
        }
        </>
      )}
    </div>
  );
};

export default CustomerPanel;