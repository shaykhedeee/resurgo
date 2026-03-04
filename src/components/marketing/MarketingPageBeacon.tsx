'use client';

import { useEffect, useRef } from 'react';
import { captureUtmParams, trackMarketingEvent } from '@/lib/marketing/analytics';

type MarketingPageBeaconProps = {
  event: string;
  properties?: Record<string, unknown>;
};

export default function MarketingPageBeacon({ event, properties }: MarketingPageBeaconProps) {
  const initialPayloadRef = useRef({ event, properties });

  useEffect(() => {
    captureUtmParams();
    trackMarketingEvent(initialPayloadRef.current.event, initialPayloadRef.current.properties);
  }, []);

  return null;
}
