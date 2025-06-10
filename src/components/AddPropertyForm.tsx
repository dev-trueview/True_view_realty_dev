import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { databaseAPI, NewPropertyData } from '@/utils/database';
import FormFieldWithTooltip from './FormFieldWithTooltip';

interface AddPropertyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPropertyForm = ({ onSuccess, onCancel }: AddPropertyFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  
  // Check if we're in demo mode
  const isDemo = window.location.hostname.includes('lovableproject.com') || 
                 window.location.hostname.includes('lovable.dev');
  
  const [formData, setFormData] = useState<NewPropertyData>({
    price: '',
    location: '',
    type: '',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 0,
    year_built: new Date().getFullYear(),
    description: '',
    features: [],
    neighborhood_info: {
      walkScore: 50,
      transitScore: 50,
      bikeScore: 50,
      schools: '',
      shopping: '',
      dining: ''
    }
  });

  const handleInputChange = (field: keyof NewPropertyData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNeighborhoodChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      neighborhood_info: {
        ...prev.neighborhood_info,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast({
        title: "Too many images",
        description: "Maximum 10 images allowed per property",
        variant: "destructive"
      });
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFeatures(prev => [...prev, '']);
  };

  const updateFeature = (index: number, value: string) => {
    setFeatures(prev => prev.map((feature, i) => i === index ? value : feature));
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (images.length === 0) {
        toast({
          title: "Images required",
          description: "Please upload at least one property image",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const filteredFeatures = features.filter(f => f.trim() !== '');
      const propertyData = {
        ...formData,
        features: filteredFeatures
      };

      console.log('Submitting property data:', propertyData);
      console.log('Images to upload:', images.length);

      const result = await databaseAPI.addProperty(propertyData, images);

      if (result.success) {
        toast({
          title: "Property Added Successfully",
          description: result.message || "The new property listing has been created",
        });
        
        // Reset form
        setFormData({
          price: '',
          location: '',
          type: '',
          bedrooms: 1,
          bathrooms: 1,
          sqft: 0,
          year_built: new Date().getFullYear(),
          description: '',
          features: [],
          neighborhood_info: {
            walkScore: 50,
            transitScore: 50,
            bikeScore: 50,
            schools: '',
            shopping: '',
            dining: ''
          }
        });
        setImages([]);
        setFeatures(['']);
        
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add property",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the property",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Demo Mode Notice */}
      {isDemo && (
        <div className="bg-blue-900/50 border border-blue-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-blue-200">
            <Info className="w-5 h-5" />
            <span className="font-medium">Demo Mode Active</span>
          </div>
          <p className="text-blue-300 mt-1 text-sm">
            You're running in demo mode. Property submissions will be simulated since no backend server is connected.
            To enable full functionality, run the backend server on localhost:3001.
          </p>
        </div>
      )}

      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">Add New Property Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldWithTooltip
                label="Price Range"
                tooltip="Enter the property price range, e.g., '$750,000 - $850,000' or '$1.2M'. Include currency symbol."
                htmlFor="price"
              >
                <Input
                  id="price"
                  placeholder="e.g., $750,000 - $850,000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  required
                />
              </FormFieldWithTooltip>
              
              <FormFieldWithTooltip
                label="Location"
                tooltip="Enter the neighborhood or area name, e.g., 'Downtown Seattle', 'Manhattan Upper East Side'"
                htmlFor="location"
              >
                <Input
                  id="location"
                  placeholder="e.g., Downtown Seattle"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  required
                />
              </FormFieldWithTooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldWithTooltip
                label="Property Type"
                tooltip="Select the type of property from the dropdown options"
                htmlFor="type"
              >
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="bg-slate-800/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWithTooltip>
              
              <FormFieldWithTooltip
                label="Year Built"
                tooltip="Enter the year the property was constructed (4-digit year, e.g., 2020)"
                htmlFor="year_built"
              >
                <Input
                  id="year_built"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear() + 2}
                  value={formData.year_built}
                  onChange={(e) => handleInputChange('year_built', parseInt(e.target.value))}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  required
                />
              </FormFieldWithTooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormFieldWithTooltip
                label="Bedrooms"
                tooltip="Number of bedrooms (minimum 1)"
                htmlFor="bedrooms"
              >
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  required
                />
              </FormFieldWithTooltip>
              
              <FormFieldWithTooltip
                label="Bathrooms"
                tooltip="Number of bathrooms (can include half baths, e.g., 2.5)"
                htmlFor="bathrooms"
              >
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  max="20"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  required
                />
              </FormFieldWithTooltip>
              
              <FormFieldWithTooltip
                label="Square Feet"
                tooltip="Total living area in square feet (numbers only, e.g., 1500)"
                htmlFor="sqft"
              >
                <Input
                  id="sqft"
                  type="number"
                  min="1"
                  value={formData.sqft}
                  onChange={(e) => handleInputChange('sqft', parseInt(e.target.value))}
                  className="bg-slate-800/50 border-gray-600 text-white"
                  required
                />
              </FormFieldWithTooltip>
            </div>

            {/* Description */}
            <FormFieldWithTooltip
              label="Description"
              tooltip="Detailed description of the property. Include highlights, unique features, and selling points (minimum 50 characters)"
              htmlFor="description"
            >
              <Textarea
                id="description"
                placeholder="Detailed property description..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-slate-800/50 border-gray-600 text-white min-h-[100px]"
                required
              />
            </FormFieldWithTooltip>

            {/* Features */}
            <FormFieldWithTooltip
              label="Features"
              tooltip="List key property features. Each feature should be specific and detailed (e.g., 'Granite countertops in kitchen', 'Walk-in closet in master bedroom')"
            >
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Modern kitchen with stainless steel appliances"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="bg-slate-800/50 border-gray-600 text-white"
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </FormFieldWithTooltip>

            {/* Neighborhood Info */}
            <FormFieldWithTooltip
              label="Neighborhood Information"
              tooltip="Provide neighborhood details to help buyers understand the area's livability and amenities"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <FormFieldWithTooltip
                  label="Walk Score (0-100)"
                  tooltip="Walkability rating: 0-24 (Car-dependent), 25-49 (Some errands), 50-69 (Somewhat walkable), 70-89 (Very walkable), 90-100 (Walker's paradise)"
                  htmlFor="walkScore"
                >
                  <Input
                    id="walkScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.neighborhood_info.walkScore}
                    onChange={(e) => handleNeighborhoodChange('walkScore', parseInt(e.target.value))}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </FormFieldWithTooltip>
                
                <FormFieldWithTooltip
                  label="Transit Score (0-100)"
                  tooltip="Public transportation convenience: 0-24 (Minimal), 25-49 (Some), 50-69 (Good), 70-89 (Excellent), 90-100 (Paradise)"
                  htmlFor="transitScore"
                >
                  <Input
                    id="transitScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.neighborhood_info.transitScore}
                    onChange={(e) => handleNeighborhoodChange('transitScore', parseInt(e.target.value))}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </FormFieldWithTooltip>
                
                <FormFieldWithTooltip
                  label="Bike Score (0-100)"
                  tooltip="Bikeability rating: 0-24 (Not bikeable), 25-49 (Some bike infrastructure), 50-69 (Bikeable), 70-89 (Very bikeable), 90-100 (Biker's paradise)"
                  htmlFor="bikeScore"
                >
                  <Input
                    id="bikeScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.neighborhood_info.bikeScore}
                    onChange={(e) => handleNeighborhoodChange('bikeScore', parseInt(e.target.value))}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </FormFieldWithTooltip>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormFieldWithTooltip
                  label="Schools"
                  tooltip="Describe local school quality (e.g., 'Excellent', 'Good', 'Top-rated district')"
                  htmlFor="schools"
                >
                  <Input
                    id="schools"
                    placeholder="e.g., Excellent"
                    value={formData.neighborhood_info.schools}
                    onChange={(e) => handleNeighborhoodChange('schools', e.target.value)}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </FormFieldWithTooltip>
                
                <FormFieldWithTooltip
                  label="Shopping"
                  tooltip="Describe shopping options nearby (e.g., 'World-class', 'Convenient', 'Mall within walking distance')"
                  htmlFor="shopping"
                >
                  <Input
                    id="shopping"
                    placeholder="e.g., World-class"
                    value={formData.neighborhood_info.shopping}
                    onChange={(e) => handleNeighborhoodChange('shopping', e.target.value)}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </FormFieldWithTooltip>
                
                <FormFieldWithTooltip
                  label="Dining"
                  tooltip="Describe dining and restaurant options (e.g., 'Outstanding', 'Diverse options', 'Fine dining available')"
                  htmlFor="dining"
                >
                  <Input
                    id="dining"
                    placeholder="e.g., Outstanding"
                    value={formData.neighborhood_info.dining}
                    onChange={(e) => handleNeighborhoodChange('dining', e.target.value)}
                    className="bg-slate-800/50 border-gray-600 text-white"
                  />
                </FormFieldWithTooltip>
              </div>
            </FormFieldWithTooltip>

            {/* Image Upload */}
            <FormFieldWithTooltip
              label="Property Images (Max 10)"
              tooltip="Upload high-quality images of the property. Supported formats: JPG, PNG, WebP. Recommended size: 1920x1080 or higher. First image will be the main listing photo."
            >
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400">Click to upload images</p>
                  </div>
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </FormFieldWithTooltip>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPropertyForm;
