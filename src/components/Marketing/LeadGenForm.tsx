import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, ArrowRight, ArrowLeft, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackFormSubmit, trackLeadGeneration } from '@/components/Analytics/GoogleTagManager';
import { trackLeadGeneration as trackPixelLead } from '@/components/Analytics/MarketingPixels';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;
  budget: string;
  timeline: string;
  message: string;
  source: string;
}

interface LeadGenFormProps {
  isModal?: boolean;
  propertyId?: string;
  source?: string;
  onClose?: () => void;
  compact?: boolean;
}

const LeadGenForm: React.FC<LeadGenFormProps> = ({ 
  isModal = false, 
  propertyId, 
  source = 'website',
  onClose,
  compact = false 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: '',
    budget: '',
    timeline: '',
    message: '',
    source
  });

  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  const totalSteps = compact ? 2 : 4;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<LeadFormData> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Valid email is required';
      }
    }

    if (step === 2) {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.phone && !/^[+]?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Valid phone number is required';
      }
    }

    if (step === 3 && !compact) {
      if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
      if (!formData.budget) newErrors.budget = 'Budget range is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Track form submission
      trackFormSubmit('lead_generation', {
        property_id: propertyId,
        source: formData.source,
        property_type: formData.propertyType,
        budget: formData.budget
      });

      trackLeadGeneration(formData.source, propertyId);
      trackPixelLead(formData.source, propertyId);

      // Here you would typically submit to your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      setIsSuccess(true);
      
      toast({
        title: "Thank You!",
        description: "Our team will contact you within 24 hours.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStep = () => {
    if (isSuccess) {
      return (
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-4">
            Your inquiry has been received. Our expert team will contact you within 24 hours 
            to discuss your property requirements.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>Call us: +91 7620658446</span>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            {compact && (
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  placeholder="Tell us about your property requirements..."
                  rows={4}
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="propertyType">Property Type *</Label>
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => updateFormData('propertyType', e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="">Select Property Type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="plot">Plot</option>
              </select>
              {errors.propertyType && <p className="text-sm text-red-500">{errors.propertyType}</p>}
            </div>
            <div>
              <Label htmlFor="budget">Budget Range *</Label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => updateFormData('budget', e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="">Select Budget Range</option>
                <option value="under-50L">Under ₹50 Lakhs</option>
                <option value="50L-1Cr">₹50L - ₹1 Crore</option>
                <option value="1Cr-2Cr">₹1 - ₹2 Crores</option>
                <option value="2Cr-5Cr">₹2 - ₹5 Crores</option>
                <option value="above-5Cr">Above ₹5 Crores</option>
              </select>
              {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="timeline">Purchase Timeline</Label>
              <select
                id="timeline"
                value={formData.timeline}
                onChange={(e) => updateFormData('timeline', e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="">Select Timeline</option>
                <option value="immediate">Immediate</option>
                <option value="1-3months">1-3 Months</option>
                <option value="3-6months">3-6 Months</option>
                <option value="6-12months">6-12 Months</option>
                <option value="research">Just Researching</option>
              </select>
            </div>
            <div>
              <Label htmlFor="message">Additional Requirements</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => updateFormData('message', e.target.value)}
                placeholder="Any specific requirements or questions?"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const FormContent = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Get Expert Property Consultation
        </CardTitle>
        {!isSuccess && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          {!isSuccess && (
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {currentStep === totalSteps ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                  <MessageSquare className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <FormContent />
        </DialogContent>
      </Dialog>
    );
  }

  return <FormContent />;
};

export default LeadGenForm;