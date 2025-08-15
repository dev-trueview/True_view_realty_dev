import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OptimizedImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  acceptedTypes?: string[];
}

const OptimizedImageUpload = ({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  maxSizePerImage = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: OptimizedImageUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const compressImage = useCallback((file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const validateFiles = useCallback((files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, and WebP are allowed.`);
        return;
      }

      // Check file size
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSizePerImage) {
        errors.push(`${file.name}: File too large (${sizeInMB.toFixed(1)}MB). Maximum size is ${maxSizePerImage}MB.`);
        return;
      }

      validFiles.push(file);
    });

    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: "Upload Validation Failed",
        description: errors.slice(0, 3).join('\n') + (errors.length > 3 ? '\n...' : ''),
        variant: "destructive",
      });
    }

    return validFiles;
  }, [acceptedTypes, maxSizePerImage, toast]);

  const handleFileSelection = useCallback(async (files: FileList) => {
    if (images.length >= maxImages) {
      toast({
        title: "Upload Limit Reached",
        description: `Maximum ${maxImages} images allowed.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      const validFiles = validateFiles(files);
      const remainingSlots = maxImages - images.length;
      const filesToProcess = validFiles.slice(0, remainingSlots);

      if (filesToProcess.length < validFiles.length) {
        toast({
          title: "Some Files Skipped",
          description: `Only ${filesToProcess.length} files selected due to ${maxImages} image limit.`,
        });
      }

      // Compress images in parallel
      const compressedFiles = await Promise.all(
        filesToProcess.map(file => compressImage(file))
      );

      onImagesChange([...images, ...compressedFiles]);

      if (compressedFiles.length > 0) {
        toast({
          title: "Images Uploaded Successfully",
          description: `${compressedFiles.length} image(s) added and optimized.`,
        });
      }
    } catch (error) {
      console.error('Image processing error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onImagesChange, validateFiles, compressImage, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
    // Reset input value to allow re-selecting the same files
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast({
      title: "Image Removed",
      description: "Image has been removed from the list.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-2">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Processing images...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP up to {maxSizePerImage}MB each (max {maxImages} images)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Upload Status */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            {images.length} of {maxImages} images selected
          </span>
          {images.length >= maxImages && (
            <span className="flex items-center text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              Upload limit reached
            </span>
          )}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                {(image.size / (1024 * 1024)).toFixed(1)}MB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptimizedImageUpload;