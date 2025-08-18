// Font loading optimizations
export const optimizeFonts = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const preloadFont = (href: string, crossorigin = true) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = href;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };

  // Preload Inter font variations
  preloadFont('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2');
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.innerHTML = css;
  style.setAttribute('data-critical-css', 'true');
  document.head.appendChild(style);
};

// Resource hints
export const addResourceHints = () => {
  if (typeof window === 'undefined') return;

  const hints = [
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
    { rel: 'dns-prefetch', href: 'https://connect.facebook.net' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: true },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: true }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if ('crossOrigin' in hint) {
      link.crossOrigin = hint.crossOrigin ? 'anonymous' : '';
    }
    document.head.appendChild(link);
  });
};

// Image optimization utilities
export const generateImageSrcSet = (baseUrl: string, sizes: number[] = [400, 800, 1200, 1600]) => {
  return sizes
    .map(size => `${baseUrl}?w=${size}&q=75 ${size}w`)
    .join(', ');
};

export const generateImageSizes = (breakpoints: Record<string, string> = {
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '50vw',
  default: '33vw'
}) => {
  const entries = Object.entries(breakpoints);
  const conditions = entries
    .filter(([key]) => key !== 'default')
    .map(([condition, size]) => `${condition} ${size}`);
  
  const defaultSize = breakpoints.default || '100vw';
  return [...conditions, defaultSize].join(', ');
};

// Script loading optimizations
export const loadScriptAsync = (src: string, id?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id || src)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    if (id) script.id = id;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
};

// CSS loading with media attribute trick
export const loadCSSAsync = (href: string, media = 'all') => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print'; // Load with low priority
  link.onload = () => {
    link.media = media; // Switch to actual media query when loaded
  };
  document.head.appendChild(link);
};

// Performance monitoring
interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const measureWebVitals = (callback: (metrics: PerformanceMetrics) => void) => {
  if (typeof window === 'undefined') return;

  const metrics: PerformanceMetrics = {};

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    metrics.lcp = lastEntry.startTime;
    callback(metrics);
  });
  
  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // Browser doesn't support LCP
  }

  // First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      metrics.fid = entry.processingStart - entry.startTime;
      callback(metrics);
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // Browser doesn't support FID
  }

  // Cumulative Layout Shift
  let cumulativeLayoutShift = 0;
  const clsObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cumulativeLayoutShift += entry.value;
        metrics.cls = cumulativeLayoutShift;
        callback(metrics);
      }
    });
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Browser doesn't support CLS
  }

  // First Contentful Paint and TTFB from Navigation Timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
        callback(metrics);
      }

      // FCP
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        metrics.fcp = fcp.startTime;
        callback(metrics);
      }
    }, 0);
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

// Bundle size analysis helper
export const analyzeBundle = () => {
  if (typeof window === 'undefined') return;

  // Log largest scripts
  const scripts = Array.from(document.scripts);
  scripts.forEach(script => {
    if (script.src) {
      fetch(script.src, { method: 'HEAD' })
        .then(response => {
          const size = response.headers.get('content-length');
          if (size) {
            console.log(`Script ${script.src}: ${(parseInt(size) / 1024).toFixed(2)} KB`);
          }
        })
        .catch(() => {
          // Ignore CORS errors for external scripts
        });
    }
  });
};

// Defer non-critical JavaScript
export const deferNonCriticalJS = (callback: () => void, delay = 3000) => {
  if (typeof window === 'undefined') return;

  const defer = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback);
    } else {
      setTimeout(callback, delay);
    }
  };

  if (document.readyState === 'complete') {
    defer();
  } else {
    window.addEventListener('load', defer);
  }
};

// Initialize all performance optimizations
export const initializePerformanceOptimizations = () => {
  optimizeFonts();
  addResourceHints();
  
  // Measure and report web vitals
  measureWebVitals((metrics) => {
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        fcp: metrics.fcp,
        ttfb: metrics.ttfb
      });
    }
  });

  // Register service worker for caching
  deferNonCriticalJS(() => {
    registerServiceWorker();
  });
};