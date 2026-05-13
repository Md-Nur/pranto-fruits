'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// Declare fbq on window for TypeScript
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!FB_PIXEL_ID || FB_PIXEL_ID === 'YOUR_FACEBOOK_PIXEL_ID_HERE') return;

    // Track page views on route changes
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  if (!FB_PIXEL_ID || FB_PIXEL_ID === 'YOUR_FACEBOOK_PIXEL_ID_HERE') {
    return null;
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Helper functions to track standard Facebook Pixel events
// Import and call these from anywhere in the app

export function trackFBEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
}

// Pre-built event trackers for common e-commerce actions
export const fbEvents = {
  /** Track when a user views a product */
  viewContent: (params: { content_name: string; content_ids: string[]; content_type?: string; value?: number; currency?: string }) =>
    trackFBEvent('ViewContent', { content_type: 'product', currency: 'BDT', ...params }),

  /** Track when a user adds a product to cart */
  addToCart: (params: { content_name: string; content_ids: string[]; value: number; currency?: string }) =>
    trackFBEvent('AddToCart', { content_type: 'product', currency: 'BDT', ...params }),

  /** Track when a user initiates checkout */
  initiateCheckout: (params: { value: number; currency?: string; num_items?: number }) =>
    trackFBEvent('InitiateCheckout', { currency: 'BDT', ...params }),

  /** Track when a user completes a purchase */
  purchase: (params: { value: number; currency?: string; content_ids?: string[]; num_items?: number }) =>
    trackFBEvent('Purchase', { currency: 'BDT', ...params }),

  /** Track when a user adds to wishlist */
  addToWishlist: (params: { content_name: string; content_ids: string[]; value?: number; currency?: string }) =>
    trackFBEvent('AddToWishlist', { content_type: 'product', currency: 'BDT', ...params }),

  /** Track when a user searches */
  search: (searchString: string) =>
    trackFBEvent('Search', { search_string: searchString }),

  /** Track when a user contacts the business */
  contact: () =>
    trackFBEvent('Contact'),

  /** Track a lead/inquiry */
  lead: (params?: { content_name?: string; value?: number; currency?: string }) =>
    trackFBEvent('Lead', { currency: 'BDT', ...params }),
};
