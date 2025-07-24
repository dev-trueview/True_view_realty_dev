
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  property: {
    id: string | number;
    image: string;
    price: string;
    location: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
  };
  onEnquiry: () => void;
  onViewDetails: () => void;
}

const PropertyCard = ({ property, onEnquiry, onViewDetails }: PropertyCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return '/placeholder.svg';
    }
    return property.image || '/placeholder.svg';
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <div className="relative cursor-pointer overflow-hidden" onClick={onViewDetails}>
        <div className="relative h-48 bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <img
            src={getImageSrc()}
            alt={`Property in ${property.location}`}
            className={`w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg font-semibold px-3 py-1">
          {property.type}
        </Badge>
        
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="cursor-pointer" onClick={onViewDetails}>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium">{property.location}</span>
          </div>
          
          <h3 className="font-bold text-2xl text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-300 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
            {property.price}
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex items-center justify-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Bed className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">{property.bedrooms}</span>
          </div>
          <div className="flex items-center justify-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <Bath className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">{property.bathrooms}</span>
          </div>
          <div className="flex items-center justify-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <Square className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">{property.sqft}</span>
          </div>
        </div>
        
        <Button 
          onClick={onEnquiry}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0"
        >
          Get Enquiry
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
