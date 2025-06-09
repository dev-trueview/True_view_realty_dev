
import { useState, useEffect, useCallback } from 'react';
import { databaseAPI, Property } from '@/utils/database';
import { fallbackProperties } from '@/data/fallbackProperties';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

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
        setLastFetchTime(Date.now());
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

  // Background refresh function that doesn't disrupt UI
  const backgroundRefresh = useCallback(async () => {
    // Only refresh if we're not using fallback and it's been at least 30 seconds
    if (!usingFallback && Date.now() - lastFetchTime > 30000) {
      try {
        const data = await databaseAPI.fetchActiveProperties();
        if (data && data.length > 0) {
          setProperties(data);
          setLastFetchTime(Date.now());
        }
      } catch (err) {
        // Silently fail for background updates
        console.log('Background refresh failed, keeping current data');
      }
    }
  }, [usingFallback, lastFetchTime]);

  useEffect(() => {
    fetchProperties();
    
    // Set up background polling that doesn't cause full page refreshes
    const interval = setInterval(() => {
      backgroundRefresh();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchProperties, backgroundRefresh]);

  // Expose manual refresh for user-initiated updates
  const manualRefresh = useCallback(() => {
    fetchProperties(false);
  }, [fetchProperties]);

  return { 
    properties, 
    loading, 
    error, 
    refetch: manualRefresh,
    usingFallback,
    lastUpdated: lastFetchTime
  };
};
