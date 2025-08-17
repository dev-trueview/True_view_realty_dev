-- Fix function search path security issue
-- Update the cleanup function to have a proper search_path setting

CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < now();
END;
$$;