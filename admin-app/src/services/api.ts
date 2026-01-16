import { Product, Category, SiteConfig, SocialLink } from '../types';

// Mock API logic mirrored here for standalone functionality
// In production, point this to your Render Backend URL
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AdminApi {
  private getStorage<T>(key: string, defaultData: T): T {
    const stored = localStorage.getItem(key);
    // If not found, we don't return defaults here to avoid overwriting live data with seed data accidentally
    // unless it's strictly necessary.
    if (!stored) return defaultData; 
    return JSON.parse(stored);
  }

  private setStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async getConfig(): Promise<SiteConfig | null> {
    await delay(300);
    const stored = localStorage.getItem('siteConfig');
    return stored ? JSON.parse(stored) : null;
  }

  async updateConfig(config: SiteConfig): Promise<SiteConfig> {
    await delay(500);
    this.setStorage('siteConfig', config);
    return config;
  }

  async getSocials(): Promise<SocialLink[]> {
    await delay(200);
    return this.getStorage('socials', []);
  }

  async updateSocials(socials: SocialLink[]): Promise<SocialLink[]> {
    await delay(400);
    this.setStorage('socials', socials);
    return socials;
  }

  async getCategories(): Promise<Category[]> {
    await delay(300);
    return this.getStorage('categories', []);
  }

  async getProducts(): Promise<Product[]> {
    await delay(500);
    return this.getStorage('products', []);
  }

  async saveProduct(product: Product): Promise<Product> {
    await delay(600);
    const products = this.getStorage<Product[]>('products', []);
    const index = products.findIndex(p => p.id === product.id);
    const now = new Date().toISOString();
    
    if (index >= 0) {
      products[index] = { ...product, updatedAt: now };
      this.setStorage('products', products);
      return products[index];
    } else {
      const newProduct = { 
        ...product, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now,
        updatedAt: now
      };
      products.push(newProduct);
      this.setStorage('products', products);
      return newProduct;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    await delay(400);
    const products = this.getStorage<Product[]>('products', []);
    this.setStorage('products', products.filter(p => p.id !== id));
  }
}

export const adminApi = new AdminApi();