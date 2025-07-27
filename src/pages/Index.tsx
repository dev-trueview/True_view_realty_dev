
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import DynamicHeroCarousel from "@/components/DynamicHeroCarousel";
import SessionBasedEnquiry from "@/components/SessionBasedEnquiry";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import EnquiryForm from "@/components/EnquiryForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import Footer from "@/components/Footer";
import { useProperties } from "@/hooks/useProperties";
import { databaseAPI } from "@/utils/database";

const Index = () => {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [hasSubmittedEnquiry, setHasSubmittedEnquiry] = useState(false);
  const [showAutoPopup, setShowAutoPopup] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [showGlobalEnquiry, setShowGlobalEnquiry] = useState(false);
  const { toast } = useToast();

  // Use the custom hook to fetch properties from Supabase
  const { properties, loading, error, refetch } = useProperties();

  // Check sessionStorage for enquiry submission status
  useEffect(() => {
    const enquirySubmitted = sessionStorage.getItem('enquiry_submitted');
    if (enquirySubmitted === 'true') {
      setHasSubmittedEnquiry(true);
    }
  }, []);

  // Listen for global enquiry form events
  useEffect(() => {
    const handleShowEnquiryForm = () => {
      setShowGlobalEnquiry(true);
    };
    window.addEventListener('showEnquiryForm', handleShowEnquiryForm);
    return () => window.removeEventListener('showEnquiryForm', handleShowEnquiryForm);
  }, []);

  // Filter properties based on filters
  const applyFilters = (property: any) => {
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.propertyType && property.type !== filters.propertyType) {
      return false;
    }
    if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) {
      return false;
    }
    if (filters.bathrooms && property.bathrooms < parseInt(filters.bathrooms)) {
      return false;
    }
    if (filters.priceMin || filters.priceMax) {
      // Simple price filtering - you might want to implement more sophisticated price parsing
      const priceStr = property.price.replace(/[^0-9]/g, '');
      const price = parseInt(priceStr);
      if (filters.priceMin && price < parseInt(filters.priceMin.replace(/[^0-9]/g, ''))) {
        return false;
      }
      if (filters.priceMax && price > parseInt(filters.priceMax.replace(/[^0-9]/g, ''))) {
        return false;
      }
    }
    if (filters.sqftMin && property.sqft < parseInt(filters.sqftMin)) {
      return false;
    }
    if (filters.sqftMax && property.sqft > parseInt(filters.sqftMax)) {
      return false;
    }
    if (filters.amenities && filters.amenities.length > 0) {
      const hasRequiredAmenities = filters.amenities.some((amenity: string) =>
        property.amenities.includes(amenity) || property.features.includes(amenity)
      );
      if (!hasRequiredAmenities) {
        return false;
      }
    }
    return true;
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchLocation || property.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = !propertyType || property.type === propertyType;
    const matchesFilters = applyFilters(property);
    return matchesSearch && matchesType && matchesFilters;
  });

  const handleEnquiry = (property: any) => {
    setSelectedProperty(property);
    setShowEnquiryModal(true);
    setShowAutoPopup(false); // Close auto popup if open
  };

  const handleAutoPopupEnquiry = () => {
    setSelectedProperty(null); // No specific property for auto popup
    setShowEnquiryModal(true);
    setShowAutoPopup(false);
  };

  const handleViewDetails = async (property: any) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
    
    // Track property view
    if (property.id) {
      await databaseAPI.trackPropertyView(property.id);
    }
  };

  const handleFormSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
    sessionStorage.setItem('enquiry_submitted', 'true');
    setHasSubmittedEnquiry(true);
    
    toast({
      title: "Enquiry Submitted Successfully!",
      description: "Our agent will contact you within 24 hours.",
    });
    
    setShowEnquiryModal(false);
    setShowGlobalEnquiry(false);
    setShowAutoPopup(false);
    setSelectedProperty(null);
    
    // Refresh properties to update enquiry counts
    refetch();
  };

  const handleCloseAutoPopup = () => {
    setShowAutoPopup(false);
  };

  const handleCloseEnquiryModal = () => {
    setShowEnquiryModal(false);
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
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Dynamic Hero Carousel */}
      <DynamicHeroCarousel />

      {/* Session-based Enquiry Popup */}
      <SessionBasedEnquiry />

      {/* Advanced Property Filters */}
      <section className="py-8 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="container mx-auto px-4">
          <PropertyFilters onFiltersChange={setFilters} />
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Quick search by location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex-1">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
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
          {properties.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No properties available at the moment.</p>
              <p className="text-gray-400">Please check back later or contact us for more information.</p>
            </div>
          )}
          {filteredProperties.length === 0 && properties.length > 0 && (
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

      {/* Auto Lead Capture Popup */}
      <Dialog open={showAutoPopup} onOpenChange={setShowAutoPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">🏠 Find Your Dream Property!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Get personalized property recommendations and exclusive listings delivered to your inbox.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCloseAutoPopup}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleAutoPopupEnquiry}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enquiry Modal */}
      <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Property Enquiry</DialogTitle>
          </DialogHeader>
          <EnquiryForm 
            property={selectedProperty}
            onSubmit={handleFormSubmit}
            onClose={handleCloseEnquiryModal}
          />
        </DialogContent>
      </Dialog>

      {/* Global Enquiry Modal */}
      <Dialog open={showGlobalEnquiry} onOpenChange={setShowGlobalEnquiry}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Property Enquiry</DialogTitle>
          </DialogHeader>
          <EnquiryForm 
            property={null}
            onSubmit={handleFormSubmit}
            onClose={() => setShowGlobalEnquiry(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
