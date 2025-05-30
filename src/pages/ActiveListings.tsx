
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";

const ActiveListings = () => {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const { toast } = useToast();

  const activeProperties = [
    {
      id: 1,
      image: "/placeholder.svg",
      price: "$750,000 - $850,000",
      location: "Downtown Seattle",
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800
    },
    {
      id: 2,
      image: "/placeholder.svg", 
      price: "$1,200,000 - $1,400,000",
      location: "Beverly Hills",
      type: "Villa",
      bedrooms: 5,
      bathrooms: 4,
      sqft: 3200
    },
    {
      id: 3,
      image: "/placeholder.svg",
      price: "$450,000 - $550,000",
      location: "Austin Texas",
      type: "Condo",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200
    },
    {
      id: 4,
      image: "/placeholder.svg",
      price: "$2,100,000 - $2,500,000",
      location: "Manhattan NYC",
      type: "Penthouse",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800
    },
    {
      id: 5,
      image: "/placeholder.svg",
      price: "$650,000 - $750,000",
      location: "San Francisco",
      type: "Townhouse",
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 2100
    },
    {
      id: 6,
      image: "/placeholder.svg",
      price: "$900,000 - $1,100,000",
      location: "Miami Beach",
      type: "Condo",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1600
    }
  ];

  const filteredProperties = activeProperties.filter(property => {
    const matchesLocation = !searchLocation || property.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = !propertyType || property.type === propertyType;
    return matchesLocation && matchesType;
  });

  const handleEnquiry = (property: any) => {
    setSelectedProperty(property);
    setShowEnquiryModal(true);
  };

  const handleFormSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
    toast({
      title: "Enquiry Submitted Successfully!",
      description: "Our agent will contact you within 24 hours.",
    });
    setShowEnquiryModal(false);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Active Property Listings</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover your dream home from our carefully curated selection of premium properties.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEnquiry={() => handleEnquiry(property)}
              />
            ))}
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
            </div>
          )}
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
