-- Create a default admin user and profile for testing
-- First, we need to allow signup to create the user, then we'll create their profile

-- Insert a test admin profile (will be linked to user after signup)
-- Note: This will be linked manually or through the handle_new_user trigger

-- For now, let's make sure we have the right setup for admin auth
-- Let's also create a simple way to bootstrap an admin user

-- Create a function to promote a user to admin (for manual setup)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
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