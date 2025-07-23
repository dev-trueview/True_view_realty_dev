-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT,
  price TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  sqft INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Extended properties
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  year_built INTEGER,
  neighborhood_info JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  views_count INTEGER DEFAULT 0,
  enquiries_count INTEGER DEFAULT 0
);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  property_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property_analytics table for tracking
CREATE TABLE public.property_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'enquiry', 'contact')),
  user_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for properties (public read access)
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Only admins can update properties" 
ON public.properties 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
));

-- Create policies for enquiries
CREATE POLICY "Anyone can submit enquiries" 
ON public.enquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view enquiries" 
ON public.enquiries 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
));

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for analytics (admin only)
CREATE POLICY "Only admins can view analytics" 
ON public.property_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Anyone can insert analytics" 
ON public.property_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-avatars', 'admin-avatars', false);

-- Create storage policies for property images (public access)
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Only admins can upload property images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'property-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Only admins can update property images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'property-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Create storage policies for admin avatars
CREATE POLICY "Admins can view their own avatars" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'admin-avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can upload their own avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'admin-avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for better performance
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_location ON public.properties(location);
CREATE INDEX idx_properties_created_at ON public.properties(created_at);
CREATE INDEX idx_enquiries_property_id ON public.enquiries(property_id);
CREATE INDEX idx_enquiries_created_at ON public.enquiries(created_at);
CREATE INDEX idx_analytics_property_id ON public.property_analytics(property_id);
CREATE INDEX idx_analytics_event_type ON public.property_analytics(event_type);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, role)
  VALUES (NEW.id, NEW.email, 'admin');
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();