
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Calendar } from "lucide-react";

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnquiry: () => void;
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
}

const PropertyDetailsModal = ({ isOpen, onClose, onEnquiry, property }: PropertyDetailsModalProps) => {
  // Extended property data for modal
  const extendedProperty = {
    ...property,
    images: [property.image, property.image, property.image],
    yearBuilt: 2019,
    description: `This stunning modern ${property.type.toLowerCase()} offers the perfect blend of luxury and comfort in ${property.location}. With floor-to-ceiling windows, high-end finishes, and breathtaking views, this property represents the pinnacle of urban living.`,
    features: [
      "Modern kitchen with stainless steel appliances",
      "Hardwood floors throughout",
      "In-unit washer and dryer",
      "Private balcony with city views",
      "Fitness center and rooftop terrace",
      "24/7 concierge service",
      "Pet-friendly building",
      "Underground parking included"
    ],
    neighborhood: {
      walkScore: 95,
      transitScore: 88,
      bikeScore: 82,
      schools: "Excellent",
      shopping: "World-class",
      dining: "Outstanding"
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Property Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Images */}
          <div className="space-y-4">
            <img
              src={extendedProperty.images[0]}
              alt="Main property image"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              {extendedProperty.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property image ${index + 2}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Property Info */}
          <div className="space-y-4">
            <div>
              <Badge className="mb-2 bg-blue-600">{extendedProperty.type}</Badge>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{extendedProperty.price}</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{extendedProperty.location}</span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Bed className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">{extendedProperty.bedrooms}</p>
                <p className="text-xs text-gray-600">Bedrooms</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Bath className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">{extendedProperty.bathrooms}</p>
                <p className="text-xs text-gray-600">Bathrooms</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Square className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">{extendedProperty.sqft}</p>
                <p className="text-xs text-gray-600">Sq Ft</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">{extendedProperty.yearBuilt}</p>
                <p className="text-xs text-gray-600">Year Built</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={onEnquiry}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Get Enquiry
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Viewing
              </Button>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="mt-6 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Property Description</h3>
              <p className="text-gray-600 leading-relaxed">{extendedProperty.description}</p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Features & Amenities</h3>
                <div className="space-y-2">
                  {extendedProperty.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Neighborhood */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Neighborhood</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Walk Score</span>
                    <span className="font-semibold">{extendedProperty.neighborhood.walkScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transit Score</span>
                    <span className="font-semibold">{extendedProperty.neighborhood.transitScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bike Score</span>
                    <span className="font-semibold">{extendedProperty.neighborhood.bikeScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Schools</span>
                    <span className="font-semibold">{extendedProperty.neighborhood.schools}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shopping</span>
                    <span className="font-semibold">{extendedProperty.neighborhood.shopping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dining</span>
                    <span className="font-semibold">{extendedProperty.neighborhood.dining}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
