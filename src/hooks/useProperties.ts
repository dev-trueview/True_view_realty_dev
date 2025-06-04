
import { useState, useEffect } from 'react';
import { databaseAPI, Property } from '@/utils/database';
import { fallbackProperties } from '@/data/fallbackProperties';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    
    // Only set up polling if not using fallback data
    const interval = setInterval(() => {
      if (!usingFallback) {
        fetchProperties();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [usingFallback]);

  return { 
    properties, 
    loading, 
    error, 
    refetch: fetchProperties,
    usingFallback 
  };
};
