import React from 'react';
import { 
  Facebook, Instagram, Video, MessageCircle, Twitter, Globe, Mail, Phone, MapPin, 
  ShoppingCart, Star, Info, Check, Shield, Package, Edit, Trash2, Plus, LogOut, Settings, LayoutGrid, List,
  Moon, Sun, Send
} from 'lucide-react';

export const IconMap: Record<string, React.ElementType> = {
  Facebook, Instagram, Video, MessageCircle, Twitter, Globe, Mail, Phone, MapPin,
  ShoppingCart, Star, Info, Check, Shield, Package, Edit, Trash2, Plus, LogOut, Settings, LayoutGrid, List,
  Moon, Sun,
  Telegram: Send // Mapping Telegram to Send icon (Paper plane)
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const IconComponent = IconMap[name] || Globe;
  return <IconComponent className={className} size={size} />;
};