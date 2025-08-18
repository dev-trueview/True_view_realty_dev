import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GTMProps {
  gtmId: string;
  dataLayerEvents?: object[];
  enableConsent?: boolean;
}

const GoogleTagManager: React.FC<GTMProps> = ({ 
  gtmId = 'GTM-XXXXXXX', 
  dataLayerEvents = [],
  enableConsent = true 
}) => {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Push initial consent state if enabled
    if (enableConsent) {
      window.dataLayer.push({
        'event': 'default_consent',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'granted',
        'personalization_storage': 'denied',
        'security_storage': 'granted'
      });
    }

    // Push custom events
    dataLayerEvents.forEach(event => {
      window.dataLayer.push(event);
    });

    // GTM initialization
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      'event': 'gtm.js'
    });
  }, [dataLayerEvents, enableConsent]);

  return (
    <Helmet>
      {/* Google Tag Manager */}
      <script async src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}></script>
      <script>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </script>
      
      {/* NoScript fallback */}
      <noscript>
        <iframe 
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0" 
          width="0" 
          style={{display: 'none', visibility: 'hidden'}}
        ></iframe>
      </noscript>
    </Helmet>
  );
};

// DataLayer utility functions
export const pushToDataLayer = (event: object) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  pushToDataLayer({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href
  });
};

export const trackEvent = (eventName: string, parameters: object = {}) => {
  pushToDataLayer({
    event: eventName,
    ...parameters
  });
};

// Enhanced tracking functions for real estate
export const trackPropertyView = (propertyId: string, propertyData: any) => {
  trackEvent('view_property', {
    property_id: propertyId,
    property_type: propertyData.type,
    property_price: propertyData.price,
    property_location: propertyData.location,
    property_bedrooms: propertyData.bedrooms,
    property_area: propertyData.area
  });
};

export const trackEnquiry = (source: string, propertyId?: string) => {
  trackEvent('generate_lead', {
    lead_source: source,
    property_id: propertyId,
    event_category: 'Lead Generation',
    event_label: propertyId ? `Property ${propertyId}` : 'General Enquiry'
  });
};

export const trackLeadGeneration = trackEnquiry; // Alias for consistency

export const trackFormSubmit = (formType: string, formData: any = {}) => {
  trackEvent('form_submit', {
    form_type: formType,
    form_location: window.location.pathname,
    ...formData
  });
};

export const trackFileDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
    download_location: window.location.pathname
  });
};

export const updateConsent = (consentUpdate: object) => {
  pushToDataLayer({
    event: 'consent_update',
    ...consentUpdate
  });
};

export default GoogleTagManager;