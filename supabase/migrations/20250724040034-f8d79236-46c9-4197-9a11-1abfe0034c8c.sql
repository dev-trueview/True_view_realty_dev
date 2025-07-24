-- Fix the security warning by setting a proper search path
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Update or insert admin profile for the user
  INSERT INTO public.profiles (user_id, username, role)
  SELECT 
    auth.users.id,
    user_email,
    'admin'
  FROM auth.users 
  WHERE auth.users.email = user_email
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'admin', username = user_email;
END;
$$;