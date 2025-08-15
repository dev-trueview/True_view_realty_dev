
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { databaseAPI, NewPropertyData } from '@/utils/database';
import FormFieldWithTooltip from './FormFieldWithTooltip';
import OptimizedImageUpload from './OptimizedImageUpload';

interface AddPropertyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPropertyForm = ({ onSuccess, onCancel }: AddPropertyFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [customType, setCustomType] = useState(false);
  
  // Production mode - no demo messages
  
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

      if (images.length > 5) {
        toast({
          title: "Too many images",
          description: "Maximum 5 images allowed per property",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Upload images with retry logic
      const uploadedImageUrls: string[] = [];
      let uploadErrors = 0;
      
      for (const image of images) {
        try {
          const imageUrl = await databaseAPI.uploadImage(image, 'properties');
          if (imageUrl) {
            uploadedImageUrls.push(imageUrl);
          } else {
            uploadErrors++;
          }
        } catch (error) {
          console.error('Individual image upload failed:', error);
          uploadErrors++;
        }
      }

      if (uploadedImageUrls.length === 0) {
        toast({
          title: "Image upload failed",
          description: "Failed to upload property images. Please check your internet connection and try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (uploadErrors > 0) {
        toast({
          title: "Some images failed to upload",
          description: `${uploadedImageUrls.length} out of ${images.length} images uploaded successfully. Proceeding with available images.`,
        });
      }

      const filteredFeatures = features.filter(f => f.trim() !== '');
      const propertyData = {
        ...formData,
        features: filteredFeatures,
        image: uploadedImageUrls[0], // Primary image
        images: uploadedImageUrls // All images
      };

      console.log('Submitting property data:', propertyData);
      console.log('Images uploaded:', uploadedImageUrls.length);

      const result = await databaseAPI.addProperty(propertyData);

      if (result) {
        toast({
          title: "Property Added Successfully",
          description: `New property listing created with ${uploadedImageUrls.length} image(s)`,
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
        throw new Error('Property creation failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred while adding the property",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

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
                {customType ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter custom property type"
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="bg-slate-800/50 border-gray-600 text-white"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCustomType(false);
                        handleInputChange('type', '');
                      }}
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
                    >
                      Use Dropdown Instead
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Select value={formData.type} onValueChange={(value) => {
                      if (value === 'Other') {
                        setCustomType(true);
                        handleInputChange('type', '');
                      } else {
                        handleInputChange('type', value);
                      }
                    }}>
                      <SelectTrigger className="bg-slate-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                        <SelectItem value="Other">Other (Custom)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
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

            {/* Optimized Image Upload */}
            <FormFieldWithTooltip
              label="Property Images (Max 5)"
              tooltip="Upload high-quality images of the property. Each image can be up to 5MB. Supported formats: JPEG, PNG, WebP. Images will be automatically optimized for better performance."
            >
              <OptimizedImageUpload 
                images={images}
                onImagesChange={setImages}
                maxImages={5}
                maxSizePerImage={5}
              />
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
