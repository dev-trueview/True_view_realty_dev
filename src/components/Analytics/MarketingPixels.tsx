import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

declare global {
  interface Window {
    fbq: any;
    _linkedin_partner_id: string;
    ttq: any;
    lintrk: any;
  }
}

interface MarketingPixelsProps {
  facebookPixelId?: string;
  linkedinPartnerId?: string;
  tiktokPixelId?: string;
  enableConsent?: boolean;
}

const MarketingPixels: React.FC<MarketingPixelsProps> = ({
  facebookPixelId = '',
  linkedinPartnerId = '',
  tiktokPixelId = '',
  enableConsent = true
}) => {
  useEffect(() => {
    // Initialize pixels only if consent is granted or consent management is disabled
    const initializePixels = () => {
      // Facebook Pixel
      if (facebookPixelId && window.fbq) {
        window.fbq('init', facebookPixelId);
        window.fbq('track', 'PageView');
      }

      // LinkedIn Insight Tag
      if (linkedinPartnerId && window.lintrk) {
        window._linkedin_partner_id = linkedinPartnerId;
        window.lintrk('track', 'PageView');
      }

      // TikTok Pixel
      if (tiktokPixelId && window.ttq) {
        window.ttq.load(tiktokPixelId);
        window.ttq.page();
      }
    };

    if (!enableConsent) {
      initializePixels();
    }
  }, [facebookPixelId, linkedinPartnerId, tiktokPixelId, enableConsent]);

  return (
    <Helmet>
      {/* Facebook Pixel */}
      {facebookPixelId && (
        <>
          <script>
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            `}
          </script>
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{display: 'none'}}
              src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* LinkedIn Insight Tag */}
      {linkedinPartnerId && (
        <script>
          {`
            _linkedin_partner_id = "${linkedinPartnerId}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);})(window.lintrk);
          `}
        </script>
      )}

      {/* TikTok Pixel */}
      {tiktokPixelId && (
        <script>
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            }(window, document, 'ttq');
          `}
        </script>
      )}
    </Helmet>
  );
};

// Pixel tracking functions
export const trackFacebookEvent = (eventName: string, parameters: object = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackLinkedInEvent = (eventName: string, parameters: object = {}) => {
  if (typeof window !== 'undefined' && window.lintrk) {
    window.lintrk('track', { conversion_id: eventName, ...parameters });
  }
};

export const trackTikTokEvent = (eventName: string, parameters: object = {}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, parameters);
  }
};

// Real estate specific tracking
export const trackPropertyInterest = (propertyData: any) => {
  const eventData = {
    content_type: 'property',
    content_ids: [propertyData.id],
    value: propertyData.price,
    currency: 'INR',
    property_type: propertyData.type,
    location: propertyData.location
  };

  trackFacebookEvent('ViewContent', eventData);
  trackLinkedInEvent('view_content', eventData);
  trackTikTokEvent('ViewContent', eventData);
};

export const trackLeadGeneration = (source: string, propertyId?: string) => {
  const eventData = {
    content_type: 'lead',
    source: source,
    property_id: propertyId
  };

  trackFacebookEvent('Lead', eventData);
  trackLinkedInEvent('generate_lead', eventData);
  trackTikTokEvent('SubmitForm', eventData);
};

export default MarketingPixels;