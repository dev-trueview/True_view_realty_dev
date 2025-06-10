
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
const BACKEND_URL = 'http://localhost:3001';

// Enhanced caching with image URL processing
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Check if we're in Lovable environment (no backend available)
const isLovableEnvironment = () => {
  return window.location.hostname.includes('lovableproject.com') || 
         window.location.hostname.includes('lovable.dev');
};

// Helper function to process image URLs
const processImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it starts with /images/, prepend backend URL
  if (imagePath.startsWith('/images/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // If it's just a filename, construct full path
  if (!imagePath.startsWith('/')) {
    return `${BACKEND_URL}/images/${imagePath}`;
  }
  
  return imagePath;
};

// Helper function to process property images
const processPropertyImages = (property: any): any => {
  const processedProperty = { ...property };
  
  // Process main image
  if (processedProperty.image) {
    processedProperty.image = processImageUrl(processedProperty.image);
  }
  
  // Process images array
  if (processedProperty.images && Array.isArray(processedProperty.images)) {
    processedProperty.images = processedProperty.images.map(processImageUrl);
  } else if (processedProperty.image) {
    // Fallback: if no images array but has main image, create array
    processedProperty.images = [processedProperty.image];
  }
  
  return processedProperty;
};

// Mock successful property addition for demo purposes
const mockSuccessfulPropertyAddition = async (propertyData: NewPropertyData, images: File[]): Promise<{ success: boolean; id?: number; message?: string }> => {
  console.log('Mock: Adding property to demo environment');
  console.log('Property data:', propertyData);
  console.log('Images:', images.length);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a mock ID
  const mockId = Date.now();
  
  console.log('Mock: Property added successfully with ID:', mockId);
  
  return {
    success: true,
    id: mockId,
    message: 'Property added successfully (Demo Mode - No backend connected)'
  };
};

export const databaseAPI = {
  // Submit enquiry to database with enhanced error handling
  submitEnquiry: async (enquiryData: EnquiryData): Promise<boolean> => {
    if (isLovableEnvironment()) {
      console.log('Demo Mode: Enquiry would be submitted:', enquiryData);
      return true;
    }

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
        const errorText = await response.text();
        throw new Error(`Failed to submit enquiry: ${response.status} - ${errorText}`);
      }
      
      // Clear properties cache after enquiry submission
      cache.delete('properties');
      return true;
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      return false;
    }
  },

  // Enhanced property addition with better error handling and demo mode support
  addProperty: async (propertyData: NewPropertyData, images: File[]): Promise<{ success: boolean; id?: number; message?: string }> => {
    // Check if we're in Lovable environment (demo mode)
    if (isLovableEnvironment()) {
      return await mockSuccessfulPropertyAddition(propertyData, images);
    }

    try {
      console.log('Starting property addition process');
      console.log('Property data:', propertyData);
      console.log('Images count:', images.length);

      const formData = new FormData();
      
      // Validate required fields
      const requiredFields = ['price', 'location', 'type', 'bedrooms', 'bathrooms', 'sqft'];
      for (const field of requiredFields) {
        if (!propertyData[field as keyof NewPropertyData]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      // Append property data with validation
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Validate and append image files
      if (images && images.length > 0) {
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        
        for (const image of images) {
          if (!validImageTypes.includes(image.type)) {
            throw new Error(`Invalid image type: ${image.type}. Allowed types: ${validImageTypes.join(', ')}`);
          }
          if (image.size > maxFileSize) {
            throw new Error(`Image ${image.name} is too large. Maximum size is 5MB.`);
          }
          formData.append('images', image);
        }
      }

      console.log('Sending request to backend...');
      
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Failed to add property: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Backend success response:', result);
      
      // Clear cache after adding property
      cache.delete('properties');
      
      return {
        success: true,
        id: result.id,
        message: 'Property added successfully'
      };
    } catch (error) {
      console.error('Error adding property:', error);
      
      // If it's a network error and we're not in demo mode, suggest backend connection
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return { 
          success: false, 
          message: 'Backend server not available. Please ensure the backend server is running on localhost:3001 or switch to demo mode.'
        };
      }
      
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to add property'
      };
    }
  },

  // Enhanced property fetching with improved image handling
  fetchActiveProperties: async (): Promise<Property[]> => {
    const cacheKey = 'properties';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // If in Lovable environment, return fallback data immediately
    if (isLovableEnvironment()) {
      console.log('Demo Mode: Using fallback properties');
      const { fallbackProperties } = await import('@/data/fallbackProperties');
      return fallbackProperties;
    }

    try {
      console.log('Fetching properties from backend...');
      
      const response = await fetch(`${API_BASE_URL}/properties`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }
      
      const properties = await response.json();
      console.log('Fetched properties:', properties.length);
      
      // Process all properties to fix image URLs
      const processedProperties = properties.map(processPropertyImages);
      
      // Cache the processed results
      cache.set(cacheKey, {
        data: processedProperties,
        timestamp: Date.now()
      });
      
      return processedProperties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Fallback to demo data if backend fails
      const { fallbackProperties } = await import('@/data/fallbackProperties');
      return fallbackProperties;
    }
  },

  // Enhanced property details fetching
  fetchPropertyDetails: async (propertyId: number): Promise<Property | null> => {
    if (isLovableEnvironment()) {
      console.log('Demo Mode: Fetching property details for ID:', propertyId);
      const { fallbackProperties } = await import('@/data/fallbackProperties');
      return fallbackProperties.find(p => p.id === propertyId) || null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch property details: ${response.status}`);
      }
      
      const property = await response.json();
      return processPropertyImages(property);
    } catch (error) {
      console.error('Error fetching property details:', error);
      return null;
    }
  },

  // Enhanced image fetching
  fetchPropertyImages: async (propertyId: number): Promise<string[]> => {
    if (isLovableEnvironment()) {
      console.log('Demo Mode: Fetching images for property ID:', propertyId);
      return ['/placeholder.svg'];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/images`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch property images: ${response.status}`);
      }

      const images = await response.json();
      return images.map(processImageUrl);
    } catch (error) {
      console.error('Error fetching property images:', error);
      return ['/placeholder.svg'];
    }
  },

  // Test connection to backend
  testConnection: async (): Promise<boolean> => {
    if (isLovableEnvironment()) {
      console.log('Demo Mode: Backend connection test skipped');
      return false;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }
};
