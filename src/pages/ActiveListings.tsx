
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";
import { useProperties } from "@/hooks/useProperties";

const ActiveListings = () => {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const { toast } = useToast();

  // Use the same hook as Index page for consistency
  const { properties, loading, error } = useProperties();

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
    console.log("Property enquiry submitted:", formData);
    localStorage.setItem('enquirySubmitted', 'true');
    
    toast({
      title: "Enquiry Submitted Successfully!",
      description: "Our agent will contact you within 24 hours.",
    });
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Active Property Listings
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover your dream home from our curated collection of premium properties
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Find Your Perfect Property</h2>
            <div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-lg">
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
              <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredProperties.length} Properties Available
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
};

export default ActiveListings;
