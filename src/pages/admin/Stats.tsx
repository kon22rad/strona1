import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart3, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface VisitorStats {
  total: number;
  byPage: Record<string, number>;
  byDate: Record<string, number>;
}

const AdminStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<VisitorStats>({
    total: 0,
    byPage: {},
    byDate: {}
  });

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    fetchStats();
  }, []);

  // Usunięto funkcję checkAuth, ponieważ ProtectedRoute obsługuje uwierzytelnianie

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('visited_at', { ascending: false });

    if (error) {
      console.error('Error fetching stats:', error);
      return;
    }

    const byPage = data.reduce((acc: Record<string, number>, curr) => {
      acc[curr.page] = (acc[curr.page] || 0) + 1;
      return acc;
    }, {});

    const byDate = data.reduce((acc: Record<string, number>, curr) => {
      const date = new Date(curr.visited_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    setStats({
      total: data.length,
      byPage,
      byDate
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Besucherstatistiken</h1>
        <Link
          to="/admin"
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Zurück zum Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Gesamtübersicht</h2>
          </div>
          <div className="text-3xl font-bold mb-2">{stats.total}</div>
          <div className="text-gray-600">Gesamtbesucher</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Besucher nach Seiten</h2>
          <div className="space-y-4">
            {Object.entries(stats.byPage).map(([page, count]) => (
              <div key={page} className="flex justify-between items-center">
                <span className="text-gray-700">{page}</span>
                <span className="text-lg font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Besucher nach Datum</h2>
          <div className="space-y-4">
            {Object.entries(stats.byDate).map(([date, count]) => (
              <div key={date} className="flex justify-between items-center">
                <span className="text-gray-700">{date}</span>
                <span className="text-lg font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;