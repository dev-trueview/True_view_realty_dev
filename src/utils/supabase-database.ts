// Supabase database utilities for TrueView Reality
import { supabase } from '@/integrations/supabase/client';

export interface Property {
  id: string;
  image?: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: 'active' | 'sold' | 'pending';
  created_at?: string;
  updated_at?: string;
  description?: string;
  features?: string[];
  amenities?: string[];
  year_built?: number;
  neighborhood_info?: {
    walkScore?: number;
    transitScore?: number;
    bikeScore?: number;
    schools?: string;
    shopping?: string;
    dining?: string;
  };
  images?: string[];
  views_count?: number;
  enquiries_count?: number;
}

export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  property_id?: string;
  property_details?: any;
}

export interface NewPropertyData {
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  year_built?: number;
  description?: string;
  features?: string[];
  amenities?: string[];
  neighborhood_info?: {
    walkScore?: number;
    transitScore?: number;
    bikeScore?: number;
    schools?: string;
    shopping?: string;
    dining?: string;
  };
}

export interface PropertyAnalytics {
  property_id: string;
  event_type: 'view' | 'enquiry' | 'contact';
  user_ip?: string;
  user_agent?: string;
}

export const supabaseAPI = {
  // Fetch active properties
  fetchActiveProperties: async (): Promise<Property[]> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchActiveProperties:', error);
      return [];
    }
  },

  // Fetch all properties (admin only)
  fetchAllProperties: async (): Promise<Property[]> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all properties:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchAllProperties:', error);
      return [];
    }
  },

  // Fetch property by ID
  fetchPropertyById: async (id: string): Promise<Property | null> => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchPropertyById:', error);
      return null;
    }
  },

  // Add new property
  addProperty: async (propertyData: NewPropertyData, imageFiles?: File[]): Promise<{ success: boolean; id?: string; message?: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'Authentication required' };
      }

      // Upload images to storage if provided
      let imageUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          imageUrls.push(publicUrl);
        }
      }

      // Insert property into database
      const propertyInsert = {
        ...propertyData,
        image: imageUrls[0] || null,
        images: imageUrls,
        status: 'active' as const
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(propertyInsert)
        .select()
        .single();

      if (error) {
        console.error('Error inserting property:', error);
        return { success: false, message: error.message };
      }

      return { success: true, id: data.id, message: 'Property added successfully' };
    } catch (error) {
      console.error('Error in addProperty:', error);
      return { success: false, message: 'Failed to add property' };
    }
  },

  // Submit enquiry
  submitEnquiry: async (enquiryData: EnquiryData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .insert(enquiryData);

      if (error) {
        console.error('Error submitting enquiry:', error);
        return false;
      }

      // Update enquiry count for the property if property_id is provided
      if (enquiryData.property_id) {
        await supabase.rpc('increment_enquiry_count', { 
          property_id: enquiryData.property_id 
        });
      }

      return true;
    } catch (error) {
      console.error('Error in submitEnquiry:', error);
      return false;
    }
  },

  // Fetch enquiries (admin only)
  fetchEnquiries: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select(`
          *,
          properties:property_id(id, location, type, price)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching enquiries:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchEnquiries:', error);
      return [];
    }
  },

  // Track property analytics
  trackPropertyAnalytics: async (analyticsData: PropertyAnalytics): Promise<void> => {
    try {
      await supabase
        .from('property_analytics')
        .insert(analyticsData);
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  },

  // Get property analytics (admin only)
  getPropertyAnalytics: async (propertyId?: string): Promise<any[]> => {
    try {
      let query = supabase
        .from('property_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPropertyAnalytics:', error);
      return [];
    }
  },

  // Get user profile
  getUserProfile: async (): Promise<any> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  },

  // Authentication helpers
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// RPC functions for database operations
export const createRPCFunctions = async () => {
  // This would be called during setup to create necessary RPC functions
  const incrementEnquiryFunction = `
    CREATE OR REPLACE FUNCTION increment_enquiry_count(property_id UUID)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $$
    BEGIN
      UPDATE public.properties 
      SET enquiries_count = COALESCE(enquiries_count, 0) + 1 
      WHERE id = property_id;
    END;
    $$;
  `;

  const incrementViewFunction = `
    CREATE OR REPLACE FUNCTION increment_view_count(property_id UUID)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $$
    BEGIN
      UPDATE public.properties 
      SET views_count = COALESCE(views_count, 0) + 1 
      WHERE id = property_id;
    END;
    $$;
  `;

  // These would need to be executed via migration tool
  console.log('RPC Functions to create:', { incrementEnquiryFunction, incrementViewFunction });
};