
export enum UserRole {
  ADMIN = 'ADMIN',
  VISITOR = 'VISITOR'
}

export interface PriceOption {
  id: string;
  name: string; // e.g., "1 Month", "Lifetime"
  price: number;
  currency: string;
  unit: string; // e.g., "month", "user"
  description?: string;
  isHighlight?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  tags: string[];
  priceOptions: PriceOption[];
  status: 'published' | 'draft' | 'hidden';
  notes?: string; // Additional conditions like "No refunds"
  isHot?: boolean; // New field for Hot products
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string; // URL to SVG or Image icon
  order: number;
  isVisible: boolean;
}

export interface SocialLink {
  id: string;
  platform: string; // e.g., "Facebook", "TikTok"
  url: string;
  iconName: string; // Used to map to Lucide icons
  handle?: string; // e.g., "@mybrand"
  order: number;
}

export interface SiteConfig {
  siteName: string;
  logoUrl?: string;
  bannerUrl?: string;
  tagline?: string;
  notices: string[]; // List of bullet points for the notice block
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
}
