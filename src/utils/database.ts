
// Database configuration and connection utilities
export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  property: string;
  created_at?: string;
}

export interface Property {
  id: number;
  image: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: 'active' | 'sold' | 'pending';
  created_at?: string;
  // Extended properties for detailed view
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

export interface NewPropertyData {
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  year_built: number;
  description: string;
  features: string[];
  neighborhood_info: {
    walkScore?: number;
    transitScore?: number;
    bikeScore?: number;
    schools?: string;
    shopping?: string;
    dining?: string;
  };
}

// API endpoints for backend communication
const API_BASE_URL = 'http://localhost:3001/api';

export const databaseAPI = {
  // Submit enquiry to database
  submitEnquiry: async (enquiryData: EnquiryData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...enquiryData,
          created_at: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      return false;
    }
  },

  // Add new property listing (Admin only)
  addProperty: async (propertyData: NewPropertyData, images: File[]): Promise<{ success: boolean; id?: number; message?: string }> => {
    try {
      const formData = new FormData();
      
      // Append property data
      Object.entries(propertyData).forEach(([key, value]) => {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });
      
      // Append image files
      images.forEach((image, index) => {
        formData.append('images', image);
      });
      
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to add property');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding property:', error);
      return { success: false, message: 'Failed to add property' };
    }
  },

  // Fetch active properties from database
  fetchActiveProperties: async (): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const properties = await response.json();
      return properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  // Fetch detailed property information by ID
  fetchPropertyDetails: async (propertyId: number): Promise<Property | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }
      
      const property = await response.json();
      return property;
    } catch (error) {
      console.error('Error fetching property details:', error);
      return null;
    }
  },

  // Fetch property images from folder
  fetchPropertyImages: async (propertyId: number): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/images`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch property images');
      }

      const images = await response.json();
      return images;
    } catch (error) {
      console.error('Error fetching property images:', error);
      return [];
    }
  }
};
