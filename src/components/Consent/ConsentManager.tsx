import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Cookie, Settings, ExternalLink } from 'lucide-react';
import { updateConsent } from '@/components/Analytics/GoogleTagManager';

interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  personalization: boolean;
}

interface ConsentManagerProps {
  onConsentUpdate?: (consents: ConsentSettings) => void;
}

const ConsentManager: React.FC<ConsentManagerProps> = ({ onConsentUpdate }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consents, setConsents] = useState<ConsentSettings>({
    analytics: false,
    marketing: false,
    functional: true,
    personalization: false
  });

  useEffect(() => {
    // Check if consent has been given before
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const parsed = JSON.parse(savedConsent);
      setConsents(parsed);
      updateGTMConsent(parsed);
    }
  }, []);

  const updateGTMConsent = (settings: ConsentSettings) => {
    // Update Google Consent Mode
    updateConsent({
      analytics_storage: settings.analytics ? 'granted' : 'denied',
      ad_storage: settings.marketing ? 'granted' : 'denied',
      ad_user_data: settings.marketing ? 'granted' : 'denied',
      ad_personalization: settings.personalization ? 'granted' : 'denied',
      functionality_storage: settings.functional ? 'granted' : 'denied',
      personalization_storage: settings.personalization ? 'granted' : 'denied'
    });
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      analytics: true,
      marketing: true,
      functional: true,
      personalization: true
    };
    
    setConsents(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('consent-timestamp', new Date().toISOString());
    
    updateGTMConsent(allAccepted);
    onConsentUpdate?.(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const rejected = {
      analytics: false,
      marketing: false,
      functional: true, // Always keep functional cookies
      personalization: false
    };
    
    setConsents(rejected);
    localStorage.setItem('cookie-consent', JSON.stringify(rejected));
    localStorage.setItem('consent-timestamp', new Date().toISOString());
    
    updateGTMConsent(rejected);
    onConsentUpdate?.(rejected);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(consents));
    localStorage.setItem('consent-timestamp', new Date().toISOString());
    
    updateGTMConsent(consents);
    onConsentUpdate?.(consents);
    setShowBanner(false);
    setShowSettings(false);
  };

  const updateConsentSetting = (key: keyof ConsentSettings, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">We use cookies</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="text-primary hover:underline"
                  >
                    Manage preferences
                  </button>
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="whitespace-nowrap"
              >
                Reject All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="whitespace-nowrap"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Preferences
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              We respect your privacy. Choose which cookies you'd like to allow. 
              You can change these settings at any time.
            </p>

            {/* Functional Cookies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Essential Cookies
                  <Switch
                    checked={consents.functional}
                    disabled
                    aria-label="Essential cookies (always enabled)"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These cookies are necessary for the website to function and cannot be switched off. 
                  They enable basic functions like page navigation and access to secure areas.
                </p>
              </CardContent>
            </Card>

            {/* Analytics Cookies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Analytics Cookies
                  <Switch
                    checked={consents.analytics}
                    onCheckedChange={(checked) => updateConsentSetting('analytics', checked)}
                    aria-label="Analytics cookies"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by 
                  collecting and reporting information anonymously.
                </p>
              </CardContent>
            </Card>

            {/* Marketing Cookies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Marketing Cookies
                  <Switch
                    checked={consents.marketing}
                    onCheckedChange={(checked) => updateConsentSetting('marketing', checked)}
                    aria-label="Marketing cookies"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These cookies track your online activity to help advertisers deliver more 
                  relevant advertising or to limit how many times you see an ad.
                </p>
              </CardContent>
            </Card>

            {/* Personalization Cookies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Personalization Cookies
                  <Switch
                    checked={consents.personalization}
                    onCheckedChange={(checked) => updateConsentSetting('personalization', checked)}
                    aria-label="Personalization cookies"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These cookies enable enhanced functionality and personalization, 
                  such as remembering your preferences and settings.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Privacy Policy
                </a>
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRejectAll}>
                  Reject All
                </Button>
                <Button onClick={handleSaveSettings}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsentManager;