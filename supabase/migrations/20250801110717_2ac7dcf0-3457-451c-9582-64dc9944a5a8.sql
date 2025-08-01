-- Create storage bucket for property images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for property images
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Admins can upload property images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'property-images' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Admins can update property images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'property-images' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Admins can delete property images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'property-images' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
));