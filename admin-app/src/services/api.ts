
import { Product, Category, SiteConfig, SocialLink, AnalyticsStats } from '../types';

// Points to the Node.js Backend on Render
const RAW_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';
// Remove ALL trailing slashes
export const API_URL = RAW_URL.replace(/\/+$/, '');

console.log(`[AdminApi] Connecting to: ${API_URL}`);

class AdminApi {
  // Helper for auth headers - Get dynamic password from Login step
  private getHeaders() {
    const password = localStorage.getItem('adminPassword') || 'admin123';
    return {
      'Content-Type': 'application/json',
      'x-admin-password': password
    };
  }

  // --- ANALYTICS ---
  async getAnalytics(): Promise<AnalyticsStats> {
    const res = await fetch(`${API_URL}/api/analytics/stats`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  }

  // --- CONFIG ---
  async getConfig(): Promise<SiteConfig | null> {
    const res = await fetch(`${API_URL}/api/config`);
    return res.json();
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

  // --- SOCIALS ---
  async getSocials(): Promise<SocialLink[]> {
    const res = await fetch(`${API_URL}/api/socials`);
    return res.json();
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

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/api/categories`);
    return res.json();
  }

  async saveCategory(category: Category): Promise<Category> {
    const res = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Failed to save category');
    return res.json();
  }

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category');
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/api/products`);
    return res.json();
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

  async bulkCreateProducts(products: Partial<Product>[]): Promise<{ success: boolean, count: number }> {
    const res = await fetch(`${API_URL}/api/products/bulk`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(products)
    });
    if (!res.ok) throw new Error('Failed to import products');
    return res.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
  }

  // Add Login method explicitly to class if needed or use standalone fetch in Login.tsx
  async login(password: string): Promise<boolean> {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.success;
  }
}

export const adminApi = new AdminApi();
