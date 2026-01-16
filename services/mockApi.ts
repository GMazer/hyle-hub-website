import { Product, Category, SiteConfig, SocialLink, PriceOption } from '../types';

// Initial Seed Data
const INITIAL_CONFIG: SiteConfig = {
  siteName: "HyleHub Store",
  tagline: "Cung cấp tài khoản Premium giá rẻ",
  bannerUrl: "https://picsum.photos/1200/400?grayscale",
  logoUrl: "", // Empty string means use local Logo component
  notices: [
    "Hỗ trợ kỹ thuật: 8:00 - 22:00 hàng ngày",
    "Bảo hành trọn đời gói đăng ký",
    "Kích hoạt chính chủ qua Email"
  ],
  contactInfo: {
    email: "admin@hylehub.com",
    phone: "0999.999.999"
  }
};

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Công cụ AI', slug: 'ai-tools', order: 1, isVisible: true, description: 'ChatGPT, Midjourney...' },
  { id: '2', name: 'Giải trí & Phim', slug: 'entertainment', order: 2, isVisible: true, description: 'Netflix, Youtube, Spotify' },
  { id: '3', name: 'Thiết kế & Học tập', slug: 'design-edu', order: 3, isVisible: true, description: 'Canva, Duolingo, Coursera' }
];

const INITIAL_SOCIALS: SocialLink[] = [
  { id: '1', platform: 'Instagram', url: 'https://instagram.com/hylehub', iconName: 'Instagram', handle: '@hylehub', order: 1 },
  { id: '2', platform: 'Facebook', url: '#', iconName: 'Facebook', handle: 'HyleHub Store', order: 2 },
  { id: '3', platform: 'Zalo', url: '#', iconName: 'MessageCircle', handle: '0999.999.999', order: 3 },
  { id: '4', platform: 'Telegram', url: 'https://t.me/hylehub', iconName: 'Telegram', handle: '@hylehub', order: 4 }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '101',
    name: 'ChatGPT Plus / OpenAI',
    slug: 'chatgpt-plus',
    categoryId: '1',
    status: 'published',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
    galleryUrls: [],
    shortDescription: 'Tài khoản ChatGPT Plus chính chủ, ổn định cao.',
    fullDescription: '✅ Nâng cấp trên chính email của bạn\n✅ Sử dụng GPT-4, DALL-E 3, Browsing\n✅ Bảo hành full thời gian\n✅ Hỗ trợ lỗi 1 đổi 1 ngay lập tức',
    tags: ['Hot', 'AI'],
    notes: 'Không share tài khoản cho người khác',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceOptions: [
      { id: 'p1', name: '1 Tháng (Dùng riêng)', price: 89000, currency: 'k', unit: 'tháng', description: 'Acc Private' },
      { id: 'p2', name: 'ChatGPT Team (1 Tháng)', price: 150000, currency: 'k', unit: 'tháng', description: 'Bảo mật cao', isHighlight: true }
    ]
  },
  {
    id: '102',
    name: 'Canva Pro Edu',
    slug: 'canva-pro',
    categoryId: '3',
    status: 'published',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Canva_icon_2021.svg/600px-Canva_icon_2021.svg.png',
    galleryUrls: [],
    shortDescription: 'Nâng cấp Canva Pro chính chủ vĩnh viễn (gói Edu).',
    fullDescription: '✅ Truy cập kho tài nguyên Pro không giới hạn\n✅ Xóa phông nền, đổi cỡ ảnh tự động\n✅ 100GB lưu trữ đám mây\n✅ Bảo hành trọn đời nhóm Edu',
    tags: ['Thiết kế', 'Giá rẻ'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceOptions: [
      { id: 'p3', name: 'Nâng cấp vĩnh viễn', price: 40000, currency: 'k', unit: 'lần', isHighlight: true }
    ]
  },
  {
    id: '103',
    name: 'Youtube Premium',
    slug: 'youtube-premium',
    categoryId: '2',
    status: 'published',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/YouTube_Premium_logo.svg/1280px-YouTube_Premium_logo.svg.png',
    galleryUrls: [],
    shortDescription: 'Youtube không quảng cáo, nghe nhạc tắt màn hình.',
    fullDescription: '✅ Không quảng cáo trên mọi thiết bị\n✅ Youtube Music Premium\n✅ Tải xuống xem offline\n✅ Nâng cấp chính chủ email',
    tags: ['Giải trí', 'Best Seller'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceOptions: [
      { id: 'p4', name: '1 Tháng', price: 30000, currency: 'k', unit: 'tháng', isHighlight: false },
      { id: 'p5', name: '1 Năm', price: 299000, currency: 'k', unit: 'năm', isHighlight: true }
    ]
  },
  {
    id: '104',
    name: 'Perplexity Pro',
    slug: 'perplexity-pro',
    categoryId: '1',
    status: 'published',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.jpg',
    galleryUrls: [],
    shortDescription: 'Công cụ tìm kiếm AI mạnh mẽ, thay thế Google.',
    fullDescription: '✅ Sử dụng GPT-4o, Claude 3 Opus\n✅ Tìm kiếm thông tin realtime\n✅ Upload file phân tích dữ liệu\n✅ Tài khoản dùng riêng',
    tags: ['AI', 'Search'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceOptions: [
      { id: 'p6', name: '1 Năm (Dùng riêng)', price: 70000, currency: 'k', unit: 'năm', isHighlight: true }
    ]
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApi {
  private getStorage<T>(key: string, defaultData: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(stored);
  }

  private setStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- CONFIG ---
  async getConfig(): Promise<SiteConfig> {
    await delay(300);
    return this.getStorage('siteConfig', INITIAL_CONFIG);
  }

  async updateConfig(config: SiteConfig): Promise<SiteConfig> {
    await delay(500);
    this.setStorage('siteConfig', config);
    return config;
  }

  // --- SOCIALS ---
  async getSocials(): Promise<SocialLink[]> {
    await delay(200);
    return this.getStorage('socials', INITIAL_SOCIALS);
  }

  async updateSocials(socials: SocialLink[]): Promise<SocialLink[]> {
    await delay(400);
    this.setStorage('socials', socials);
    return socials;
  }

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    await delay(300);
    return this.getStorage('categories', INITIAL_CATEGORIES);
  }

  async saveCategory(category: Category): Promise<Category> {
    await delay(400);
    const categories = this.getStorage('categories', INITIAL_CATEGORIES);
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push({ ...category, id: Math.random().toString(36).substr(2, 9) });
    }
    this.setStorage('categories', categories);
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    await delay(300);
    const categories = this.getStorage('categories', INITIAL_CATEGORIES);
    this.setStorage('categories', categories.filter(c => c.id !== id));
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    await delay(500);
    return this.getStorage('products', INITIAL_PRODUCTS);
  }

  async saveProduct(product: Product): Promise<Product> {
    await delay(600);
    const products = this.getStorage('products', INITIAL_PRODUCTS);
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
    const products = this.getStorage('products', INITIAL_PRODUCTS);
    this.setStorage('products', products.filter(p => p.id !== id));
  }
}

export const mockApi = new MockApi();