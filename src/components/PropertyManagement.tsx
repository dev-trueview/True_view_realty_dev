import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Eye, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { databaseAPI, Property } from '@/utils/database';

const PropertyManagement = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    price: '',
    location: '',
    type: '',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    year_built: 2020,
    description: '',
    features: [] as string[],
    amenities: [] as string[]
  });
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await databaseAPI.fetchAllProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      price: property.price,
      location: property.location,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      year_built: property.year_built || 2020,
      description: property.description || '',
      features: property.features || [],
      amenities: property.amenities || []
    });
    setShowEditDialog(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    setLoading(true);
    try {
      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        for (const image of images) {
          const imageUrl = await databaseAPI.uploadImage(image, 'properties');
          if (imageUrl) {
            uploadedImageUrls.push(imageUrl);
          }
        }
      }

      const updateData = {
        ...formData,
        ...(uploadedImageUrls.length > 0 && {
          image: uploadedImageUrls[0],
          images: [...(editingProperty.images || []), ...uploadedImageUrls]
        })
      };

      const result = await databaseAPI.updateProperty(editingProperty.id, updateData);

      if (result) {
        toast({
          title: "Success",
          description: "Property updated successfully"
        });
        setShowEditDialog(false);
        setEditingProperty(null);
        setImages([]);
        fetchProperties();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    setDeleteLoading(propertyId);
    try {
      const result = await databaseAPI.deleteProperty(propertyId);
      
      if (result) {
        toast({
          title: "Success",
          description: "Property deleted successfully"
        });
        // Update properties list immediately without refetching
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please check your permissions and try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  if (loading && properties.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">Property Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Image</TableHead>
                <TableHead className="text-gray-300">Price</TableHead>
                <TableHead className="text-gray-300">Location</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Bed/Bath</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    {property.image ? (
                      <img 
                        src={property.image} 
                        alt="Property" 
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-white">{property.price}</TableCell>
                  <TableCell className="text-gray-300">{property.location}</TableCell>
                  <TableCell className="text-gray-300">{property.type}</TableCell>
                  <TableCell className="text-gray-300">
                    {property.bedrooms}BR/{property.bathrooms}BA
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {property.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(property)}
                        className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-800 border-cyan-500/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Property</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Are you sure you want to delete this property? This action cannot be undone.
                              All related images and data will be permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(property.id)}
                              disabled={deleteLoading === property.id}
                              className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
                            >
                              {deleteLoading === property.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-slate-800 border-cyan-500/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Property</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-slate-700 border-gray-600 text-white"
                  placeholder="₹50 Lakhs"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-slate-700 border-gray-600 text-white"
                  placeholder="Pune, Maharashtra"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Property Type *</label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="bg-slate-700 border-gray-600 text-white"
                  placeholder="Apartment, Villa, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year Built</label>
                <Input
                  type="number"
                  value={formData.year_built}
                  onChange={(e) => setFormData(prev => ({ ...prev, year_built: parseInt(e.target.value) }))}
                  className="bg-slate-700 border-gray-600 text-white"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms *</label>
                <Input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                  className="bg-slate-700 border-gray-600 text-white"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bathrooms *</label>
                <Input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                  className="bg-slate-700 border-gray-600 text-white"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Square Feet *</label>
                <Input
                  type="number"
                  value={formData.sqft}
                  onChange={(e) => setFormData(prev => ({ ...prev, sqft: parseInt(e.target.value) }))}
                  className="bg-slate-700 border-gray-600 text-white"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-gray-600 text-white"
                rows={3}
                placeholder="Property description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="bg-slate-700 border-gray-600 text-white flex-1"
                    placeholder="Feature description"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
              >
                Add Feature
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Images</label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="bg-slate-700 border-gray-600 text-white"
              />
              <p className="text-sm text-gray-400 mt-1">
                Select new images to add to this property
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600"
              >
                {loading ? 'Updating...' : 'Update Property'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyManagement;