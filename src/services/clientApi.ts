import { Product, Category, SiteConfig, SocialLink } from '../types';
import { INITIAL_CONFIG, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SOCIALS } from './mockApi';

// Remove trailing slash if present to avoid double slashes in fetch
const RAW_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';
const API_URL = RAW_URL.replace(/\/$/, '');

class ClientApi {
  async getConfig(): Promise<SiteConfig | null> {
    try {
      // Increased timeout to 20s because Render free tier needs time to wake up
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); 

      const res = await fetch(`${API_URL}/api/config`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('Status not ok');
      return await res.json();
    } catch (e) {
      console.warn(`[ClientApi] Backend unavailable or timeout. Using Fallback Data.`);
      return INITIAL_CONFIG;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (!res.ok) throw new Error('Status not ok');
      return await res.json();
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error('Status not ok');
      return await res.json();
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  }

  async getSocials(): Promise<SocialLink[]> {
    try {
      const res = await fetch(`${API_URL}/api/socials`);
      if (!res.ok) throw new Error('Status not ok');
      return await res.json();
    } catch (e) {
      return INITIAL_SOCIALS;
    }
  }
}

export const clientApi = new ClientApi();