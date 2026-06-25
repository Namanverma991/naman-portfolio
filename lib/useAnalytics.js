import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAnalytics() {
  const router = useRouter();

  const trackEvent = async (eventType, metadata = {}) => {
    try {
      // Don't track requests inside the admin dashboard
      if (router.pathname.startsWith('/admin')) {
        return;
      }
      
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          page: router.pathname,
          metadata
        })
      });
    } catch (err) {
      console.warn('Analytics event tracking omitted:', err.message);
    }
  };

  useEffect(() => {
    // Track page views on mount or route changes
    trackEvent('page_view');
  }, [router.pathname]);

  return { trackEvent };
}

export default useAnalytics;
