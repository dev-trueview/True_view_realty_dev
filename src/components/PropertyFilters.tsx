import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface FilterOptions {
  location: string;
  priceMin: string;
  priceMax: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sqftMin: string;
  sqftMax: string;
  amenities: string[];
}

interface PropertyFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const PropertyFilters = ({ onFiltersChange, className = '' }: PropertyFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    priceMin: '',
    priceMax: '',
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    sqftMin: '',
    sqftMax: '',
    amenities: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const amenityOptions = [
    'Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Security', 'Lift', 'AC', 
    'Furnished', 'Pet Friendly', 'Internet', 'Power Backup', 'Water Supply'
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = filters.amenities;
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      location: '',
      priceMin: '',
      priceMax: '',
      propertyType: 'all',
      bedrooms: 'any',
      bathrooms: 'any',
      sqftMin: '',
      sqftMax: '',
      amenities: []
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = filters.location !== '' || 
    filters.priceMin !== '' || 
    filters.priceMax !== '' || 
    (filters.propertyType !== 'all' && filters.propertyType !== '') ||
    (filters.bedrooms !== 'any' && filters.bedrooms !== '') ||
    (filters.bathrooms !== 'any' && filters.bathrooms !== '') ||
    filters.sqftMin !== '' || 
    filters.sqftMax !== '' ||
    filters.amenities.length > 0;

  return (
    <Card className={`bg-white shadow-lg ${className}`}>
      <CardContent className="p-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
              <SelectItem value="Penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
            />
            <Input
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex-1"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Less' : 'More'} Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="px-3"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+ Bed</SelectItem>
                  <SelectItem value="2">2+ Beds</SelectItem>
                  <SelectItem value="3">3+ Beds</SelectItem>
                  <SelectItem value="4">4+ Beds</SelectItem>
                  <SelectItem value="5">5+ Beds</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+ Bath</SelectItem>
                  <SelectItem value="2">2+ Baths</SelectItem>
                  <SelectItem value="3">3+ Baths</SelectItem>
                  <SelectItem value="4">4+ Baths</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Min Sq Ft"
                value={filters.sqftMin}
                onChange={(e) => handleFilterChange('sqftMin', e.target.value)}
              />

              <Input
                placeholder="Max Sq Ft"
                value={filters.sqftMax}
                onChange={(e) => handleFilterChange('sqftMax', e.target.value)}
              />
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-medium mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((amenity) => (
                  <Badge
                    key={amenity}
                    variant={filters.amenities.includes(amenity) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    {amenity}
                    {filters.amenities.includes(amenity) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {filters.location && <Badge variant="secondary">{filters.location}</Badge>}
              {filters.propertyType && filters.propertyType !== 'all' && <Badge variant="secondary">{filters.propertyType}</Badge>}
              {filters.priceMin && <Badge variant="secondary">Min: {filters.priceMin}</Badge>}
              {filters.priceMax && <Badge variant="secondary">Max: {filters.priceMax}</Badge>}
              {filters.bedrooms && filters.bedrooms !== 'any' && <Badge variant="secondary">{filters.bedrooms}+ Beds</Badge>}
              {filters.bathrooms && filters.bathrooms !== 'any' && <Badge variant="secondary">{filters.bathrooms}+ Baths</Badge>}
              {filters.amenities.map(amenity => (
                <Badge key={amenity} variant="secondary">{amenity}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyFilters;