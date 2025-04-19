import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

const VisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      await supabase
        .from('visitors')
        .insert([{
          page: location.pathname,
          user_agent: navigator.userAgent
        }]);
    };
    
    trackVisit();
  }, [location.pathname]);

  return null;
};

export default VisitorTracker;