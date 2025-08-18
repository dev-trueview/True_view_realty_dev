interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapOptions {
  baseUrl: string;
  includeImages?: boolean;
  excludePatterns?: string[];
  maxUrls?: number;
}

class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapUrl[] = [];
  private excludePatterns: string[];
  private maxUrls: number;

  constructor(options: SitemapOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.excludePatterns = options.excludePatterns || [];
    this.maxUrls = options.maxUrls || 50000;
  }

  // Add a URL to the sitemap
  addUrl(url: SitemapUrl): void {
    if (this.urls.length >= this.maxUrls) {
      console.warn(`Maximum URL limit (${this.maxUrls}) reached`);
      return;
    }

    // Normalize URL
    const normalizedUrl = this.normalizeUrl(url.loc);
    
    // Check if URL should be excluded
    if (this.shouldExcludeUrl(normalizedUrl)) {
      return;
    }

    // Check for duplicates
    const exists = this.urls.some(existingUrl => existingUrl.loc === normalizedUrl);
    if (!exists) {
      this.urls.push({
        ...url,
        loc: normalizedUrl
      });
    }
  }

  // Add multiple URLs
  addUrls(urls: SitemapUrl[]): void {
    urls.forEach(url => this.addUrl(url));
  }

  // Generate static pages sitemap
  generateStaticPages(): void {
    const staticPages = [
      {
        loc: '/',
        changefreq: 'daily' as const,
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/active-listings',
        changefreq: 'daily' as const,
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/about',
        changefreq: 'monthly' as const,
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/contact',
        changefreq: 'monthly' as const,
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    this.addUrls(staticPages);
  }

  // Generate property pages sitemap (would typically fetch from API)
  generatePropertyPages(properties: any[]): void {
    const propertyUrls = properties.map(property => ({
      loc: `/property/${property.id}`,
      changefreq: 'weekly' as const,
      priority: 0.8,
      lastmod: property.updated_at ? new Date(property.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));

    this.addUrls(propertyUrls);
  }

  // Normalize URL format
  private normalizeUrl(url: string): string {
    // Remove leading slash and add base URL
    const cleanUrl = url.replace(/^\//, '');
    return cleanUrl ? `${this.baseUrl}/${cleanUrl}` : this.baseUrl;
  }

  // Check if URL should be excluded
  private shouldExcludeUrl(url: string): boolean {
    return this.excludePatterns.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(url);
    });
  }

  // Generate XML sitemap
  generateXML(): string {
    const xmlUrls = this.urls.map(url => {
      let urlXml = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>\n`;
      
      if (url.lastmod) {
        urlXml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        urlXml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        urlXml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }
      
      urlXml += `  </url>`;
      return urlXml;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
  }

  // Generate sitemap index (for multiple sitemaps)
  generateSitemapIndex(sitemapUrls: string[]): string {
    const sitemapEntries = sitemapUrls.map((url, index) => {
      return `  <sitemap>
    <loc>${this.escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
  }

  // Generate robots.txt with sitemap reference
  generateRobotsTxt(): string {
    return `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Sitemap location
Sitemap: ${this.baseUrl}/sitemap.xml
Sitemap: ${this.baseUrl}/sitemap-images.xml
`;
  }

  // Generate image sitemap for properties
  generateImageSitemap(properties: any[]): string {
    const imageUrls = properties.flatMap(property => {
      if (!property.images || !Array.isArray(property.images)) return [];
      
      return property.images.map((imageUrl: string) => `  <url>
    <loc>${this.escapeXml(`${this.baseUrl}/property/${property.id}`)}</loc>
    <image:image>
      <image:loc>${this.escapeXml(imageUrl)}</image:loc>
      <image:title>${this.escapeXml(property.title || 'Property Image')}</image:title>
      <image:caption>${this.escapeXml(property.description || property.title || 'Property in Pune')}</image:caption>
    </image:image>
  </url>`);
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageUrls.join('\n')}
</urlset>`;
  }

  // Escape XML special characters
  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  // Get sitemap statistics
  getStats(): { totalUrls: number; byChangefreq: Record<string, number>; byPriority: Record<string, number> } {
    const stats = {
      totalUrls: this.urls.length,
      byChangefreq: {} as Record<string, number>,
      byPriority: {} as Record<string, number>
    };

    this.urls.forEach(url => {
      if (url.changefreq) {
        stats.byChangefreq[url.changefreq] = (stats.byChangefreq[url.changefreq] || 0) + 1;
      }
      
      if (url.priority !== undefined) {
        const priorityKey = url.priority.toString();
        stats.byPriority[priorityKey] = (stats.byPriority[priorityKey] || 0) + 1;
      }
    });

    return stats;
  }

  // Clear all URLs
  clear(): void {
    this.urls = [];
  }

  // Get all URLs
  getUrls(): SitemapUrl[] {
    return [...this.urls];
  }
}

// Utility function to generate complete sitemap for TrueView Reality
export const generateTrueViewSitemap = async (baseUrl: string = 'https://trueviewreality.com'): Promise<{
  sitemap: string;
  imageSitemap: string;
  robotsTxt: string;
  stats: any;
}> => {
  const generator = new SitemapGenerator({
    baseUrl,
    excludePatterns: [
      '/admin.*',
      '/api.*',
      '/_next.*',
      '/private.*',
      '.*\\?.*utm_.*' // Exclude URLs with UTM parameters
    ]
  });

  // Add static pages
  generator.generateStaticPages();

  // You would typically fetch properties from your API here
  // For now, we'll simulate some property data
  const mockProperties = [
    { 
      id: 'prop-1', 
      title: 'Luxury Villa in Baner', 
      description: '4BHK Villa with garden',
      images: ['/images/villa-1.jpg', '/images/villa-1-2.jpg'],
      updated_at: '2024-01-15'
    },
    { 
      id: 'prop-2', 
      title: '3BHK Apartment in Kharadi', 
      description: 'Modern apartment with amenities',
      images: ['/images/apt-1.jpg'],
      updated_at: '2024-01-20'
    }
  ];

  generator.generatePropertyPages(mockProperties);

  return {
    sitemap: generator.generateXML(),
    imageSitemap: generator.generateImageSitemap(mockProperties),
    robotsTxt: generator.generateRobotsTxt(),
    stats: generator.getStats()
  };
};

export default SitemapGenerator;