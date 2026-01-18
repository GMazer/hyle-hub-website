
import { Product, Category, SiteConfig, SocialLink } from '../../../packages/shared/types';

// Safely access environment variables
const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';

class ClientApi {
  async getConfig(): Promise<SiteConfig | null> {
    const res = await fetch(`${API_URL}/api/config`);
    if (!res.ok) return null;
    return res.json();
  }

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/api/categories`);
    if (!res.ok) return [];
    return res.json();
  }

  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) return [];
    return res.json();
  }

  async getSocials(): Promise<SocialLink[]> {
    const res = await fetch(`${API_URL}/api/socials`);
    if (!res.ok) return [];
    return res.json();
  }

  // Tracking methods
  async trackVisit(): Promise<void> {
    try {
      fetch(`${API_URL}/api/analytics/track`, { method: 'POST' });
    } catch (e) {}
  }

  async trackProductView(productId: string): Promise<void> {
    try {
      fetch(`${API_URL}/api/analytics/view-product/${productId}`, { method: 'POST' });
    } catch (e) {}
  }
}

export const clientApi = new ClientApi();
