
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  property: {
    id: number;
    image: string;
    price: string;
    location: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
  };
  onEnquiry: () => void;
}

const PropertyCard = ({ property, onEnquiry }: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <Link to={`/property/${property.id}`}>
        <div className="relative">
          <img
            src={property.image}
            alt={`Property in ${property.location}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-blue-600">
            {property.type}
          </Badge>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/property/${property.id}`}>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
          
          <h3 className="font-bold text-xl text-gray-800 mb-2 hover:text-blue-600 transition-colors">
            {property.price}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>
        
        <Button 
          onClick={onEnquiry}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Get Enquiry
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
