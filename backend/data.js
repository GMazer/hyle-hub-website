// Initial Seed Data mirrored from frontend
const INITIAL_CONFIG = {
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

const INITIAL_CATEGORIES = [
  { 
    id: '1', 
    name: 'Công cụ AI', 
    slug: 'ai-tools', 
    order: 1, 
    isVisible: true, 
    description: 'ChatGPT, Midjourney...',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6134/6134346.png' // Lightning icon placeholder
  },
  { 
    id: '2', 
    name: 'Giải trí & Phim', 
    slug: 'entertainment', 
    order: 2, 
    isVisible: true, 
    description: 'Netflix, Youtube, Spotify',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3163/3163478.png' // Play icon placeholder
  },
  { 
    id: '3', 
    name: 'Thiết kế & Học tập', 
    slug: 'design-edu', 
    order: 3, 
    isVisible: true, 
    description: 'Canva, Duolingo, Coursera',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png' // Palette icon placeholder
  }
];

const INITIAL_SOCIALS = [
  { id: '1', platform: 'Instagram', url: 'https://instagram.com/hylehub', iconName: 'Instagram', handle: '@hylehub', order: 1 },
  { id: '2', platform: 'Facebook', url: '#', iconName: 'Facebook', handle: 'HyleHub Store', order: 2 },
  { id: '3', platform: 'Zalo', url: '#', iconName: 'MessageCircle', handle: '0999.999.999', order: 3 },
  { id: '4', platform: 'Telegram', url: 'https://t.me/hylehub', iconName: 'Telegram', handle: '@hylehub', order: 4 }
];

const INITIAL_PRODUCTS = [
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
      { id: 'p1', name: '1 Tháng (Dùng riêng)', price: 89000, currency: 'K', unit: 'tháng', description: 'Acc Private' },
      { id: 'p2', name: 'ChatGPT Team (1 Tháng)', price: 150000, currency: 'K', unit: 'tháng', description: 'Bảo mật cao', isHighlight: true }
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
      { id: 'p3', name: 'Nâng cấp vĩnh viễn', price: 40000, currency: 'K', unit: 'lần', isHighlight: true }
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
      { id: 'p4', name: '1 Tháng', price: 30000, currency: 'K', unit: 'tháng', isHighlight: false },
      { id: 'p5', name: '1 Năm', price: 299000, currency: 'K', unit: 'năm', isHighlight: true }
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
      { id: 'p6', name: '1 Năm (Dùng riêng)', price: 70000, currency: 'K', unit: 'năm', isHighlight: true }
    ]
  },
  {
    id: '105',
    name: 'Adobe Creative Cloud (All Apps)',
    slug: 'adobe-creative-cloud',
    categoryId: '3',
    status: 'published',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg/1024px-Adobe_Creative_Cloud_rainbow_icon.svg.png',
    galleryUrls: [],
    shortDescription: 'Full bộ ứng dụng Adobe: Photoshop, Illustrator, Premiere...',
    fullDescription: '✅ Gói All Apps 20+ ứng dụng (Photoshop, AI, Pr, Ae...)\n✅ Kích hoạt chính chủ email cá nhân\n✅ 100GB - 1TB Cloud Storage\n✅ Sử dụng Full tính năng AI (Generative Fill)',
    tags: ['Thiết kế', 'Adobe', 'Editor'],
    notes: 'Bảo hành full thời gian sử dụng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceOptions: [
      { id: 'adobe1', name: '1 Tháng', price: 95000, currency: 'K', unit: 'tháng', isHighlight: false, description: 'Gói dùng thử' },
      { id: 'adobe2', name: '1 Năm (Giá Sốc)', price: 990000, currency: 'K', unit: 'năm', isHighlight: true, description: 'Tiết kiệm 80%' }
    ]
  }
];

module.exports = {
  INITIAL_CONFIG,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SOCIALS
};