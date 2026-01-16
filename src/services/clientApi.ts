import { Product, Category, SiteConfig, SocialLink } from '../types';

// --- HARDCODED FALLBACK DATA (Dùng khi Backend chưa chạy hoặc lỗi) ---
const FALLBACK_CONFIG: SiteConfig = {
  siteName: "HyleHub Store",
  tagline: "Cung cấp tài khoản Premium giá rẻ",
  bannerUrl: "https://picsum.photos/1200/400?grayscale",
  logoUrl: "", 
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

const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Công cụ AI', slug: 'ai-tools', order: 1, isVisible: true, description: 'ChatGPT, Midjourney...' },
  { id: '2', name: 'Giải trí & Phim', slug: 'entertainment', order: 2, isVisible: true, description: 'Netflix, Youtube, Spotify' },
  { id: '3', name: 'Thiết kế & Học tập', slug: 'design-edu', order: 3, isVisible: true, description: 'Canva, Duolingo, Coursera' }
];

const FALLBACK_SOCIALS: SocialLink[] = [
  { id: '1', platform: 'Instagram', url: 'https://instagram.com/hylehub', iconName: 'Instagram', handle: '@hylehub', order: 1 },
  { id: '2', platform: 'Facebook', url: '#', iconName: 'Facebook', handle: 'HyleHub Store', order: 2 },
  { id: '3', platform: 'Zalo', url: '#', iconName: 'MessageCircle', handle: '0999.999.999', order: 3 }
];

const FALLBACK_PRODUCTS: Product[] = [
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
    id: '103',
    name: 'Youtube Premium',
    slug: 'youtube-premium',
    categoryId: '2',
    status: 'published',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/YouTube_Premium_logo.svg/1280px-YouTube_Premium_logo.svg.png',
    galleryUrls: [],
    shortDescription: 'Youtube không quảng cáo, nghe nhạc tắt màn hình.',
    fullDescription: '✅ Không quảng cáo trên mọi thiết bị\n✅ Youtube Music Premium\n✅ Tải xuống xem offline',
    tags: ['Giải trí', 'Best Seller'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceOptions: [
      { id: 'p4', name: '1 Tháng', price: 30000, currency: 'k', unit: 'tháng', isHighlight: false },
      { id: 'p5', name: '1 Năm', price: 299000, currency: 'k', unit: 'năm', isHighlight: true }
    ]
  }
];

// Get API URL from env or default
const RAW_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';
const API_URL = RAW_URL.replace(/\/$/, '');

class ClientApi {
  async getConfig(): Promise<SiteConfig | null> {
    try {
      // QUAN TRỌNG: Render Free Tier mất khoảng 60s để khởi động (Cold Start).
      // Timeout cũ 3s quá ngắn, tăng lên 60s để Frontend không nhảy sang Mock Data quá sớm.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); 

      const res = await fetch(`${API_URL}/api/config`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('Status not ok');
      const data = await res.json();
      console.log('✅ [ClientApi] Connected to Real Backend');
      return data || FALLBACK_CONFIG;
    } catch (e) {
      console.warn(`⚠️ [ClientApi] Backend unreachable (${e}). Using Demo Data.`);
      return FALLBACK_CONFIG;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (!res.ok) throw new Error('Err');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_CATEGORIES;
    } catch (e) {
      return FALLBACK_CATEGORIES;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error('Err');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_PRODUCTS;
    } catch (e) {
      return FALLBACK_PRODUCTS;
    }
  }

  async getSocials(): Promise<SocialLink[]> {
    try {
      const res = await fetch(`${API_URL}/api/socials`);
      if (!res.ok) throw new Error('Err');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_SOCIALS;
    } catch (e) {
      return FALLBACK_SOCIALS;
    }
  }
}

export const clientApi = new ClientApi();