import { Product, Category, SiteConfig, SocialLink } from '../types';

const RAW_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';
export const API_URL = RAW_URL.replace(/\/+$/, '');

class AdminApi {
  private getHeaders() {
    const password = localStorage.getItem('adminPassword') || '';
    return {
      'Content-Type': 'application/json',
      'x-admin-password': password
    };
  }

  async login(password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.success;
    } catch (e) {
      console.error("Login failed:", e);
      throw e;
    }
  }

  async getConfig(): Promise<SiteConfig | null> {
    try {
      const res = await fetch(`${API_URL}/api/config`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch config');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateConfig(config: SiteConfig): Promise<SiteConfig> {
    const res = await fetch(`${API_URL}/api/config`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to update config');
    return res.json();
  }

  async getSocials(): Promise<SocialLink[]> {
    try {
      const res = await fetch(`${API_URL}/api/socials`, { headers: this.getHeaders() });
      return res.ok ? await res.json() : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async updateSocials(socials: SocialLink[]): Promise<SocialLink[]> {
    const res = await fetch(`${API_URL}/api/socials`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(socials)
    });
    if (!res.ok) throw new Error('Failed to update socials');
    return res.json();
  }

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_URL}/api/categories`, { headers: this.getHeaders() });
      return res.ok ? await res.json() : [];
    } catch (e) {
      return [];
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_URL}/api/products`, { headers: this.getHeaders() });
      return res.ok ? await res.json() : [];
    } catch (e) {
      return [];
    }
  }

  async saveProduct(product: Product): Promise<Product> {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to save product');
    return res.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
  }
}

export const adminApi = new AdminApi();