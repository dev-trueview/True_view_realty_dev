-- Add missing DELETE policy for properties table to allow admin deletions
CREATE POLICY "Only admins can delete properties" 
ON public.properties 
FOR DELETE 
USING (EXISTS (
  SELECT 1 
  FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin'::text, 'super_admin'::text])
));