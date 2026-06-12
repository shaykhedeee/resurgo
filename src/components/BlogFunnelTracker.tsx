'use client';

import { useEffect } from 'react';
import { captureUtmParams, trackMarketingEvent } from '@/lib/marketing/analytics';

type BlogFunnelTrackerProps = {
  event: 'blog_visit' | 'signup_page_view' | 'onboarding_page_view';
  slug?: string;
};

export function BlogFunnelTracker({ event, slug }: BlogFunnelTrackerProps) {
  useEffect(() => {
    const attribution = captureUtmParams();
    trackMarketingEvent(event, {
      slug,
      firstTouch: attribution.first,
      lastTouch: attribution.last,
    });
  }, [event, slug]);

  return null;
}
