
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";

const PropertyDetails = () => {
  const { id } = useParams();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const { toast } = useToast();

  // Mock property data - in a real app, this would come from an API
  const property = {
    id: parseInt(id || "1"),
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    price: "$750,000 - $850,000",
    location: "Downtown Seattle",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    yearBuilt: 2019,
    description: "This stunning modern apartment offers the perfect blend of luxury and comfort in the heart of downtown Seattle. With floor-to-ceiling windows, high-end finishes, and breathtaking city views, this property represents the pinnacle of urban living.",
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

  const handleFormSubmit = (formData: any) => {
    console.log("Property enquiry submitted:", formData);
    toast({
      title: "Enquiry Submitted Successfully!",
      description: "Our agent will contact you within 24 hours.",
    });
    setShowEnquiryModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link to="/active-listings" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Link>
        </div>
      </section>

      {/* Property Images */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <img
                src={property.images[0]}
                alt="Main property image"
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                {property.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Property image ${index + 2}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2 bg-blue-600">{property.type}</Badge>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.price}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold">{property.bedrooms}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold">{property.bathrooms}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold">{property.sqft}</p>
                  <p className="text-sm text-gray-600">Sq Ft</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold">{property.yearBuilt}</p>
                  <p className="text-sm text-gray-600">Year Built</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowEnquiryModal(true)}
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
        </div>
      </section>

      {/* Property Details */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Description & Features */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Description</h2>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Features & Amenities</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Neighborhood Info */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Neighborhood</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Walk Score</span>
                      <span className="font-semibold">{property.neighborhood.walkScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transit Score</span>
                      <span className="font-semibold">{property.neighborhood.transitScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bike Score</span>
                      <span className="font-semibold">{property.neighborhood.bikeScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schools</span>
                      <span className="font-semibold">{property.neighborhood.schools}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shopping</span>
                      <span className="font-semibold">{property.neighborhood.shopping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dining</span>
                      <span className="font-semibold">{property.neighborhood.dining}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Enquiry Modal */}
      <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Property Enquiry</DialogTitle>
          </DialogHeader>
          <EnquiryForm 
            property={property}
            onSubmit={handleFormSubmit}
            onClose={() => setShowEnquiryModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetails;
