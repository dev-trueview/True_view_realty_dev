import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Calendar } from "lucide-react";
import { databaseAPI, Property } from "@/utils/database";

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
  } | null;
}

const PropertyDetailsModal = ({ isOpen, onClose, onEnquiry, property }: PropertyDetailsModalProps) => {
  const [detailedProperty, setDetailedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch detailed property data when modal opens
  useEffect(() => {
    if (isOpen && property?.id) {
      setLoading(true);
      const fetchDetails = async () => {
        try {
          const details = await databaseAPI.fetchPropertyDetails(property.id);
          if (details) {
            setDetailedProperty(details);
          } else {
            // Fallback to basic property data with default values
            setDetailedProperty({
              ...property,
              status: 'active',
              description: `This stunning modern ${property.type.toLowerCase()} offers the perfect blend of luxury and comfort in ${property.location}.`,
              features: [
                "Modern kitchen with stainless steel appliances",
                "Hardwood floors throughout",
                "In-unit washer and dryer",
                "Private balcony with city views"
              ],
              year_built: 2019,
              neighborhood_info: {
                walkScore: 95,
                transitScore: 88,
                bikeScore: 82,
                schools: "Excellent",
                shopping: "World-class",
                dining: "Outstanding"
              },
              images: [property.image, property.image, property.image]
            });
          }
        } catch (error) {
          console.error('Error fetching property details:', error);
          // Use basic property data as fallback
          setDetailedProperty({
            ...property,
            status: 'active',
            description: `Property in ${property.location}`,
            features: [],
            images: [property.image]
          });
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [isOpen, property]);

  // Early return if property is null
  if (!property) {
    return null;
  }

  // Show loading state
  if (loading || !detailedProperty) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Loading Property Details...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
              src={detailedProperty.images?.[0] || detailedProperty.image}
              alt="Main property image"
              className="w-full h-64 object-cover rounded-lg"
            />
            {detailedProperty.images && detailedProperty.images.length > 1 && (
              <div className="grid grid-cols-2 gap-2">
                {detailedProperty.images.slice(1, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Property image ${index + 2}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="space-y-4">
            <div>
              <Badge className="mb-2 bg-blue-600">{detailedProperty.type}</Badge>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{detailedProperty.price}</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{detailedProperty.location}</span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Bed className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">{detailedProperty.bedrooms}</p>
                <p className="text-xs text-gray-600">Bedrooms</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Bath className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">{detailedProperty.bathrooms}</p>
                <p className="text-xs text-gray-600">Bathrooms</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Square className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">{detailedProperty.sqft}</p>
                <p className="text-xs text-gray-600">Sq Ft</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">{detailedProperty.year_built || 'N/A'}</p>
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
          {detailedProperty.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Property Description</h3>
                <p className="text-gray-600 leading-relaxed">{detailedProperty.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Features */}
            {detailedProperty.features && detailedProperty.features.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Features & Amenities</h3>
                  <div className="space-y-2">
                    {detailedProperty.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Neighborhood */}
            {detailedProperty.neighborhood_info && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Neighborhood</h3>
                  <div className="space-y-3">
                    {detailedProperty.neighborhood_info.walkScore && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Walk Score</span>
                        <span className="font-semibold">{detailedProperty.neighborhood_info.walkScore}/100</span>
                      </div>
                    )}
                    {detailedProperty.neighborhood_info.transitScore && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transit Score</span>
                        <span className="font-semibold">{detailedProperty.neighborhood_info.transitScore}/100</span>
                      </div>
                    )}
                    {detailedProperty.neighborhood_info.bikeScore && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bike Score</span>
                        <span className="font-semibold">{detailedProperty.neighborhood_info.bikeScore}/100</span>
                      </div>
                    )}
                    {detailedProperty.neighborhood_info.schools && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Schools</span>
                        <span className="font-semibold">{detailedProperty.neighborhood_info.schools}</span>
                      </div>
                    )}
                    {detailedProperty.neighborhood_info.shopping && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shopping</span>
                        <span className="font-semibold">{detailedProperty.neighborhood_info.shopping}</span>
                      </div>
                    )}
                    {detailedProperty.neighborhood_info.dining && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dining</span>
                        <span className="font-semibold">{detailedProperty.neighborhood_info.dining}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
