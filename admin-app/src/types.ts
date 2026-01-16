export enum UserRole {
  ADMIN = 'ADMIN',
  VISITOR = 'VISITOR'
}

export interface PriceOption {
  id: string;
  name: string;
  price: number;
  currency: string;
  unit: string;
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
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isVisible: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  handle?: string;
  order: number;
}

export interface SiteConfig {
  siteName: string;
  logoUrl?: string;
  bannerUrl?: string;
  tagline?: string;
  notices: string[];
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
}