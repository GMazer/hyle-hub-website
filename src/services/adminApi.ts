import { Product, Category, SiteConfig, SocialLink } from '../types';

// Points to the Node.js Backend on Render
const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';
const ADMIN_PASSWORD = 'admin123'; 

class AdminApi {
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-admin-password': ADMIN_PASSWORD
    };
  }

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

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/api/categories`);
    return res.json();
  }

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

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
  }
}

export const adminApi = new AdminApi();