interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface UTMConfig {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

class UTMManager {
  private static instance: UTMManager;
  private currentUTM: UTMParameters = {};
  
  private constructor() {
    this.parseCurrentUTM();
  }

  public static getInstance(): UTMManager {
    if (!UTMManager.instance) {
      UTMManager.instance = new UTMManager();
    }
    return UTMManager.instance;
  }

  // Parse UTM parameters from current URL
  private parseCurrentUTM(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys: (keyof UTMParameters)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        this.currentUTM[key] = value;
      }
    });

    // Store UTM parameters in sessionStorage for session persistence
    if (Object.keys(this.currentUTM).length > 0) {
      sessionStorage.setItem('utm_parameters', JSON.stringify(this.currentUTM));
    } else {
      // Try to get from session storage if not in URL
      const stored = sessionStorage.getItem('utm_parameters');
      if (stored) {
        this.currentUTM = JSON.parse(stored);
      }
    }
  }

  // Get current UTM parameters
  public getCurrentUTM(): UTMParameters {
    return { ...this.currentUTM };
  }

  // Generate UTM URL
  public generateUTMUrl(baseUrl: string, config: UTMConfig): string {
    const url = new URL(baseUrl);
    
    // Add UTM parameters
    url.searchParams.set('utm_source', config.source);
    url.searchParams.set('utm_medium', config.medium);
    url.searchParams.set('utm_campaign', config.campaign);
    
    if (config.term) {
      url.searchParams.set('utm_term', config.term);
    }
    
    if (config.content) {
      url.searchParams.set('utm_content', config.content);
    }

    return url.toString();
  }

  // Generate social sharing URLs with UTM
  public generateSocialShareUrls(baseUrl: string, campaign: string = 'social_share'): {
    facebook: string;
    twitter: string;
    linkedin: string;
    whatsapp: string;
  } {
    const configs = {
      facebook: { source: 'facebook', medium: 'social', campaign },
      twitter: { source: 'twitter', medium: 'social', campaign },
      linkedin: { source: 'linkedin', medium: 'social', campaign },
      whatsapp: { source: 'whatsapp', medium: 'social', campaign }
    };

    return {
      facebook: this.generateUTMUrl(baseUrl, configs.facebook),
      twitter: this.generateUTMUrl(baseUrl, configs.twitter),
      linkedin: this.generateUTMUrl(baseUrl, configs.linkedin),
      whatsapp: this.generateUTMUrl(baseUrl, configs.whatsapp)
    };
  }

  // Generate email campaign URLs
  public generateEmailUrls(baseUrl: string, emailType: string = 'newsletter'): {
    cta: string;
    footer: string;
    header: string;
  } {
    return {
      cta: this.generateUTMUrl(baseUrl, {
        source: 'email',
        medium: 'email',
        campaign: emailType,
        content: 'cta_button'
      }),
      footer: this.generateUTMUrl(baseUrl, {
        source: 'email',
        medium: 'email',
        campaign: emailType,
        content: 'footer_link'
      }),
      header: this.generateUTMUrl(baseUrl, {
        source: 'email',
        medium: 'email',
        campaign: emailType,
        content: 'header_logo'
      })
    };
  }

  // Auto-append UTM to internal links (use with caution)
  public autoAppendUTM(element: HTMLAnchorElement): void {
    if (!element.href || this.isExternalLink(element.href)) return;

    const currentUTM = this.getCurrentUTM();
    if (Object.keys(currentUTM).length === 0) return;

    const url = new URL(element.href);
    
    // Only append if no UTM parameters already exist
    if (!url.searchParams.has('utm_source')) {
      Object.entries(currentUTM).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });
      
      element.href = url.toString();
    }
  }

  // Check if link is external
  private isExternalLink(href: string): boolean {
    try {
      const url = new URL(href);
      return url.hostname !== window.location.hostname;
    } catch {
      return false;
    }
  }

  // Get attribution data for forms/conversions
  public getAttributionData(): {
    utm_parameters: UTMParameters;
    referrer: string;
    landing_page: string;
    timestamp: string;
  } {
    return {
      utm_parameters: this.getCurrentUTM(),
      referrer: typeof window !== 'undefined' ? document.referrer : '',
      landing_page: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString()
    };
  }

  // Track UTM performance (for analytics)
  public trackUTMConversion(conversionType: string, value?: number): void {
    const attribution = this.getAttributionData();
    
    // Push to dataLayer for GTM
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'utm_conversion',
        conversion_type: conversionType,
        conversion_value: value,
        utm_source: attribution.utm_parameters.utm_source,
        utm_medium: attribution.utm_parameters.utm_medium,
        utm_campaign: attribution.utm_parameters.utm_campaign,
        utm_term: attribution.utm_parameters.utm_term,
        utm_content: attribution.utm_parameters.utm_content,
        referrer: attribution.referrer,
        landing_page: attribution.landing_page
      });
    }
  }

  // Clean URL from UTM parameters (for canonical URLs)
  public cleanUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      
      utmKeys.forEach(key => {
        urlObj.searchParams.delete(key);
      });
      
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  // Standard UTM templates for TrueView Reality
  public getStandardTemplates(): Record<string, UTMConfig> {
    return {
      google_ads: {
        source: 'google',
        medium: 'cpc',
        campaign: 'property_search',
        term: '{keyword}',
        content: '{ad_group}'
      },
      facebook_ads: {
        source: 'facebook',
        medium: 'cpc',
        campaign: 'property_leads',
        content: '{ad_set}'
      },
      email_newsletter: {
        source: 'newsletter',
        medium: 'email',
        campaign: 'monthly_update'
      },
      social_organic: {
        source: 'social',
        medium: 'organic',
        campaign: 'brand_awareness'
      },
      referral_partner: {
        source: 'partner',
        medium: 'referral',
        campaign: 'broker_network'
      }
    };
  }
}

// React hook for UTM management
export const useUTM = () => {
  const utmManager = UTMManager.getInstance();
  
  return {
    getCurrentUTM: () => utmManager.getCurrentUTM(),
    generateUTMUrl: (baseUrl: string, config: UTMConfig) => utmManager.generateUTMUrl(baseUrl, config),
    generateSocialShareUrls: (baseUrl: string, campaign?: string) => utmManager.generateSocialShareUrls(baseUrl, campaign),
    getAttributionData: () => utmManager.getAttributionData(),
    trackUTMConversion: (type: string, value?: number) => utmManager.trackUTMConversion(type, value),
    cleanUrl: (url: string) => utmManager.cleanUrl(url),
    getStandardTemplates: () => utmManager.getStandardTemplates()
  };
};

export default UTMManager;