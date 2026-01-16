import { Product, Category, SiteConfig, SocialLink } from '../types';
import { INITIAL_CONFIG, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SOCIALS } from './mockApi';

// Detect environment: If running locally, assume backend is at localhost:3000
// When deploying, CHANGE THIS URL to your Render Backend URL via Environment Variable VITE_API_URL
const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';

class ClientApi {
  async getConfig(): Promise<SiteConfig | null> {
    try {
      // Set a timeout to avoid hanging too long if server is waking up
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const res = await fetch(`${API_URL}/api/config`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('Status not ok');
      return await res.json();
    } catch (e) {
      console.warn(`[ClientApi] Backend (${API_URL}) unavailable. Using Fallback Data.`);
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