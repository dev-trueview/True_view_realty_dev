
import { useState, useEffect } from 'react';
import { databaseAPI, Property } from '@/utils/database';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await databaseAPI.fetchActiveProperties();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    
    // Refresh properties every 30 seconds to sync with backend
    const interval = setInterval(fetchProperties, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { properties, loading, error, refetch: fetchProperties };
};
