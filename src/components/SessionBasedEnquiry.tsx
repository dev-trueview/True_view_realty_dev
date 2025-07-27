import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EnquiryForm from './EnquiryForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SessionBasedEnquiry = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [hasSubmittedEnquiry, setHasSubmittedEnquiry] = useState(false);
  const { toast } = useToast();

  // Generate or get session ID
  useEffect(() => {
    let storedSessionId = sessionStorage.getItem('user_session_id');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('user_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
    
    // Check if user has already submitted enquiry in this session
    const enquirySubmitted = sessionStorage.getItem('enquiry_submitted');
    if (enquirySubmitted === 'true') {
      setHasSubmittedEnquiry(true);
    }
  }, []);

  // Check database for session enquiry status
  useEffect(() => {
    if (sessionId) {
      checkSessionEnquiryStatus();
    }
  }, [sessionId]);

  const checkSessionEnquiryStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('enquiry_submitted')
        .eq('session_id', sessionId)
        .single();

      if (data && data.enquiry_submitted) {
        setHasSubmittedEnquiry(true);
        sessionStorage.setItem('enquiry_submitted', 'true');
      }
    } catch (error) {
      // Session not found in database, create it
      await supabase
        .from('user_sessions')
        .insert([{ session_id: sessionId, enquiry_submitted: false }]);
    }
  };

  // Auto popup timer - show every 30 seconds unless enquiry submitted
  useEffect(() => {
    if (hasSubmittedEnquiry) return;

    const showEnquiryPopup = () => {
      if (!hasSubmittedEnquiry && !showPopup) {
        setShowPopup(true);
      }
    };

    // Show popup after 30 seconds initially, then every 30 seconds
    const initialTimeout = setTimeout(showEnquiryPopup, 30000); // 30 seconds
    const interval = setInterval(showEnquiryPopup, 30000); // Every 30 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [hasSubmittedEnquiry, showPopup]);

  const handleEnquirySubmit = async (formData: any) => {
    try {
      // Update session in database
      await supabase
        .from('user_sessions')
        .upsert([{ session_id: sessionId, enquiry_submitted: true }]);

      // Update local state and storage
      setHasSubmittedEnquiry(true);
      sessionStorage.setItem('enquiry_submitted', 'true');
      
      setShowPopup(false);
      
      toast({
        title: "Enquiry Submitted Successfully!",
        description: "Our agent will contact you within 24 hours.",
      });
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: "Error",
        description: "Failed to process enquiry",
        variant: "destructive"
      });
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Don't render if user has already submitted enquiry
  if (hasSubmittedEnquiry) {
    return null;
  }

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">🏠 Find Your Dream Property!</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Get personalized property recommendations and exclusive listings delivered to your inbox.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClosePopup}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => {
                // Show enquiry form
                setShowPopup(false);
                // You can emit an event here to show the main enquiry form
                window.dispatchEvent(new CustomEvent('showEnquiryForm'));
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionBasedEnquiry;