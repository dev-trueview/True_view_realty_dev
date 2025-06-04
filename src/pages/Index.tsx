
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PropertyCarousel from "@/components/PropertyCarousel";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import EnquiryForm from "@/components/EnquiryForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import Footer from "@/components/Footer";
import { useProperties } from "@/hooks/useProperties";

const Index = () => {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showAutoPopup, setShowAutoPopup] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [hasSubmittedEnquiry, setHasSubmittedEnquiry] = useState(false);
  const { toast } = useToast();

  // Use the custom hook to fetch properties from database
  const { properties, loading, error } = useProperties();

  // Check localStorage for enquiry submission status
  useEffect(() => {
    const enquirySubmitted = localStorage.getItem('enquirySubmitted');
    if (enquirySubmitted === 'true') {
      setHasSubmittedEnquiry(true);
    }
  }, []);

  // Auto popup every minute (only if user hasn't submitted enquiry)
  useEffect(() => {
    if (hasSubmittedEnquiry) return;

    const interval = setInterval(() => {
      setShowAutoPopup(true);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [hasSubmittedEnquiry]);

  const filteredProperties = properties.filter(property => {
    const matchesLocation = !searchLocation || property.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = !propertyType || property.type === propertyType;
    return matchesLocation && matchesType;
  });

  const handleEnquiry = (property: any) => {
    setSelectedProperty(property);
    setShowEnquiryModal(true);
  };

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  const handleFormSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
    localStorage.setItem('enquirySubmitted', 'true');
    setHasSubmittedEnquiry(true);
    
    toast({
      title: "Enquiry Submitted Successfully!",
      description: "Our agent will contact you within 24 hours.",
    });
    setShowEnquiryModal(false);
    setShowAutoPopup(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Carousel */}
      <PropertyCarousel />

      {/* Search Section */}
      <section className="py-12 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Find Your Perfect Property</h2>
            <div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-lg card-gradient">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex-1">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-500k">$0 - $500K</SelectItem>
                    <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                    <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                    <SelectItem value="2m+">$2M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Active Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEnquiry={() => handleEnquiry(property)}
                onViewDetails={() => handleViewDetails(property)}
              />
            ))}
          </div>
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
              <p className="text-gray-400">Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer />

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onEnquiry={() => {
          setShowDetailsModal(false);
          handleEnquiry(selectedProperty);
        }}
        property={selectedProperty}
      />

      {/* Enquiry Modal */}
      <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Property Enquiry</DialogTitle>
          </DialogHeader>
          <EnquiryForm 
            property={selectedProperty}
            onSubmit={handleFormSubmit}
            onClose={() => setShowEnquiryModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Auto Popup */}
      <Dialog open={showAutoPopup} onOpenChange={setShowAutoPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Connect with Our Professional Agent</DialogTitle>
          </DialogHeader>
          <div className="text-center mb-4">
            <p className="text-gray-600">Connect with our professional agent and find your dream home.</p>
          </div>
          <EnquiryForm 
            onSubmit={handleFormSubmit}
            onClose={() => setShowAutoPopup(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
