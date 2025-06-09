
import { useState, useEffect, useCallback } from 'react';
import { databaseAPI, Property } from '@/utils/database';
import { fallbackProperties } from '@/data/fallbackProperties';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProperties = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      
      const data = await databaseAPI.fetchActiveProperties();
      
      if (data && data.length > 0) {
        setProperties(data);
        setUsingFallback(false);
        setError(null);
      } else {
        // Use fallback data if backend returns empty or fails
        setProperties(fallbackProperties);
        setUsingFallback(true);
        setError(null);
      }
    } catch (err) {
      console.log('Backend unavailable, using fallback data');
      setProperties(fallbackProperties);
      setUsingFallback(true);
      setError(null);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    // Remove the aggressive polling that was causing flickering
  }, [fetchProperties]);

  // Expose manual refresh for user-initiated updates only
  const manualRefresh = useCallback(() => {
    fetchProperties(false);
  }, [fetchProperties]);

  return { 
    properties, 
    loading, 
    error, 
    refetch: manualRefresh,
    usingFallback
  };
};
