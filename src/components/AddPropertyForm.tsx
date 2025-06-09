
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { databaseAPI, NewPropertyData } from '@/utils/database';

interface AddPropertyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPropertyForm = ({ onSuccess, onCancel }: AddPropertyFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  
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

      const result = await databaseAPI.addProperty(propertyData, images);

      if (result.success) {
        toast({
          title: "Property Added Successfully",
          description: "The new property listing has been created",
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
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-white">Add New Property Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Price Range</Label>
              <Input
                placeholder="e.g., $750,000 - $850,000"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="bg-slate-800/50 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Location</Label>
              <Input
                placeholder="e.g., Downtown Seattle"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-slate-800/50 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Property Type</Label>
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
            </div>
            <div>
              <Label className="text-gray-300">Year Built</Label>
              <Input
                type="number"
                value={formData.year_built}
                onChange={(e) => handleInputChange('year_built', parseInt(e.target.value))}
                className="bg-slate-800/50 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-300">Bedrooms</Label>
              <Input
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                className="bg-slate-800/50 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Bathrooms</Label>
              <Input
                type="number"
                min="1"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                className="bg-slate-800/50 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Square Feet</Label>
              <Input
                type="number"
                min="1"
                value={formData.sqft}
                onChange={(e) => handleInputChange('sqft', parseInt(e.target.value))}
                className="bg-slate-800/50 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              placeholder="Detailed property description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-slate-800/50 border-gray-600 text-white min-h-[100px]"
              required
            />
          </div>

          {/* Features */}
          <div>
            <Label className="text-gray-300">Features</Label>
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
          </div>

          {/* Neighborhood Info */}
          <div>
            <Label className="text-gray-300">Neighborhood Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <Label className="text-sm text-gray-400">Walk Score (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.neighborhood_info.walkScore}
                  onChange={(e) => handleNeighborhoodChange('walkScore', parseInt(e.target.value))}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-400">Transit Score (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.neighborhood_info.transitScore}
                  onChange={(e) => handleNeighborhoodChange('transitScore', parseInt(e.target.value))}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-400">Bike Score (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.neighborhood_info.bikeScore}
                  onChange={(e) => handleNeighborhoodChange('bikeScore', parseInt(e.target.value))}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label className="text-sm text-gray-400">Schools</Label>
                <Input
                  placeholder="e.g., Excellent"
                  value={formData.neighborhood_info.schools}
                  onChange={(e) => handleNeighborhoodChange('schools', e.target.value)}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-400">Shopping</Label>
                <Input
                  placeholder="e.g., World-class"
                  value={formData.neighborhood_info.shopping}
                  onChange={(e) => handleNeighborhoodChange('shopping', e.target.value)}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-400">Dining</Label>
                <Input
                  placeholder="e.g., Outstanding"
                  value={formData.neighborhood_info.dining}
                  onChange={(e) => handleNeighborhoodChange('dining', e.target.value)}
                  className="bg-slate-800/50 border-gray-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-gray-300">Property Images (Max 10)</Label>
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
          </div>

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
  );
};

export default AddPropertyForm;
