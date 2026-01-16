import { Product, Category, SiteConfig, SocialLink } from '../types';
import { INITIAL_CONFIG, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SOCIALS } from './mockApi';

// Get API URL from env or default
const RAW_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';
const API_URL = RAW_URL.replace(/\/$/, '');

class ClientApi {
  async getConfig(): Promise<SiteConfig | null> {
    try {
      // Timeout 5s. If backend is sleeping/not deployed, switch to mock immediately.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 

      const res = await fetch(`${API_URL}/api/config`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('Status not ok');
      return await res.json();
    } catch (e) {
      console.warn(`[ClientApi] Backend not reachable. Using Demo Data.`);
      return INITIAL_CONFIG;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (!res.ok) throw new Error('Err');
      return await res.json();
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error('Err');
      return await res.json();
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  }

  async getSocials(): Promise<SocialLink[]> {
    try {
      const res = await fetch(`${API_URL}/api/socials`);
      if (!res.ok) throw new Error('Err');
      return await res.json();
    } catch (e) {
      return INITIAL_SOCIALS;
    }
  }
}

export const clientApi = new ClientApi();