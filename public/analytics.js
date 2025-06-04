// Independent analytics and interaction tracking
(function() {
  'use strict';
  
  // Simple analytics tracking without external dependencies
  const TrueViewAnalytics = {
    // Track page views
    trackPageView: function(page) {
      console.log(`Page view: ${page} at ${new Date().toISOString()}`);
      
      // Store in localStorage for basic analytics
      const analytics = JSON.parse(localStorage.getItem('trueview_analytics') || '{"pageViews": []}');
      analytics.pageViews.push({
        page: page,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      // Keep only last 100 page views
      if (analytics.pageViews.length > 100) {
        analytics.pageViews = analytics.pageViews.slice(-100);
      }
      
      localStorage.setItem('trueview_analytics', JSON.stringify(analytics));
    },
    
    // Track user interactions
    trackEvent: function(category, action, label) {
      console.log(`Event: ${category} - ${action} - ${label}`);
      
      const analytics = JSON.parse(localStorage.getItem('trueview_analytics') || '{"events": []}');
      if (!analytics.events) analytics.events = [];
      
      analytics.events.push({
        category: category,
        action: action,
        label: label,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 200 events
      if (analytics.events.length > 200) {
        analytics.events = analytics.events.slice(-200);
      }
      
      localStorage.setItem('trueview_analytics', JSON.stringify(analytics));
    },
    
    // Initialize tracking
    init: function() {
      // Track initial page load
      this.trackPageView(window.location.pathname);
      
      // Track clicks on important elements
      document.addEventListener('click', function(e) {
        if (e.target.matches('button, a, [data-track]')) {
          const element = e.target;
          const action = element.dataset.track || element.tagName.toLowerCase();
          const label = element.textContent.trim() || element.href || 'unknown';
          
          TrueViewAnalytics.trackEvent('user_interaction', action, label);
        }
      });
      
      // Track form submissions
      document.addEventListener('submit', function(e) {
        const form = e.target;
        const formName = form.name || form.id || 'unknown_form';
        TrueViewAnalytics.trackEvent('form', 'submit', formName);
      });
    }
  };
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      TrueViewAnalytics.init();
    });
  } else {
    TrueViewAnalytics.init();
  }
  
  // Make available globally
  window.TrueViewAnalytics = TrueViewAnalytics;
})();
