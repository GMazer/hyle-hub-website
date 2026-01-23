
import React, { useEffect } from 'react';
import { SiteConfig } from '../../../../../packages/shared/types';

interface MetaHandlerProps {
  config: SiteConfig | null;
}

const MetaHandler: React.FC<MetaHandlerProps> = ({ config }) => {
  useEffect(() => {
    if (!config) return;

    // Helper to update or create meta tag
    const updateMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        
        // Parse selector to set attributes for new element
        if (selector.includes('property=')) {
           element.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        } else if (selector.includes('name=')) {
           element.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
        }
        
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 1. Update Title
    document.title = config.siteName;

    // 2. Update Standard Description
    const description = config.tagline || config.notices?.[0] || 'Cung cấp tài khoản Premium giá rẻ.';
    updateMeta('meta[name="description"]', 'content', description);

    // 3. Update Open Graph Tags (Facebook/Zalo)
    updateMeta('meta[property="og:title"]', 'content', config.siteName);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[property="og:site_name"]', 'content', config.siteName);
    updateMeta('meta[property="og:url"]', 'content', window.location.href);

    // 4. Update Image
    // Priority: Banner URL -> Logo URL -> Default (logo.png)
    // IMPORTANT: Use full URL for reliability if possible, or relative path which resolves to domain
    const image = config.bannerUrl || config.logoUrl || '/public/logo.png';
    updateMeta('meta[property="og:image"]', 'content', image);

  }, [config]);

  return null; // Logic only, no UI
};

export default MetaHandler;
