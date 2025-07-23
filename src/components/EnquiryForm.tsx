
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { databaseAPI } from "@/utils/database";
import { useToast } from "@/hooks/use-toast";

interface EnquiryFormProps {
  property?: any;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const EnquiryForm = ({ property, onSubmit, onClose }: EnquiryFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const enquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        property: property?.location || "General Enquiry",
        property_id: property?.id || null
      };
      
      console.log('Submitting enquiry:', enquiryData);
      
      // Submit to Supabase
      const success = await databaseAPI.submitEnquiry(enquiryData);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Your enquiry has been submitted successfully. We'll contact you soon.",
        });
        onSubmit(enquiryData);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error('Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
      setErrors({ submit: 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {property && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            Enquiry for: <strong>{property.location}</strong> - {property.price}
          </p>
        </div>
      )}
      
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>
      
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={errors.email ? "border-red-500" : ""}
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>
      
      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={errors.phone ? "border-red-500" : ""}
          placeholder="Enter your phone number"
          disabled={isSubmitting}
        />
        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
      </div>
      
      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Any specific requirements or questions..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      
      {errors.submit && (
        <div className="text-red-500 text-sm">{errors.submit}</div>
      )}
      
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
        </Button>
      </div>
    </form>
  );
};

export default EnquiryForm;
