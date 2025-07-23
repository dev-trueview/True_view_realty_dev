
import { useState, useEffect, useCallback } from 'react';
import { databaseAPI, Property } from '@/utils/database';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      
      console.log('Fetching properties from Supabase...');
      const data = await databaseAPI.fetchActiveProperties();
      
      if (data && data.length > 0) {
        setProperties(data);
        console.log(`Successfully loaded ${data.length} properties from Supabase`);
      } else {
        setProperties([]);
        console.log('No properties found in Supabase');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
      setProperties([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Expose manual refresh for user-initiated updates only
  const manualRefresh = useCallback(() => {
    fetchProperties(false);
  }, [fetchProperties]);

  return { 
    properties, 
    loading, 
    error, 
    refetch: manualRefresh
  };
};
