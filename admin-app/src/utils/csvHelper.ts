
import { Product, PriceOption } from '../types';

export const generateSampleCSV = () => {
  const headers = ['name', 'slug', 'categoryId', 'price', 'unit', 'status', 'tags', 'thumbnailUrl', 'shortDescription'];
  const row1 = ['Netflix Premium', 'netflix-premium', '2', '60000', 'tháng', 'published', 'Netflix|Phim', 'https://example.com/netflix.png', 'Xem phim 4K chất lượng cao'];
  const row2 = ['Spotify Music', 'spotify-upgrade', '2', '20000', 'tháng', 'published', 'Music', '', 'Nâng cấp chính chủ'];
  
  return [headers.join(','), row1.join(','), row2.join(',')].join('\n');
};

export const parseProductCSV = (csvText: string): Partial<Product>[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return []; // Only header or empty

  const headers = lines[0].split(',').map(h => h.trim());
  const products: Partial<Product>[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Basic split handling quotes (simple regex version)
    // Matches: "value" or value
    const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g); 
    // Fallback split if regex fails for simple csvs
    const columns = row ? row.map(val => val.replace(/^"|"$/g, '').trim()) : lines[i].split(',').map(v => v.trim());
    
    if (columns.length < 2) continue; // Skip empty rows

    const getCol = (key: string) => {
      const idx = headers.findIndex(h => h === key);
      return idx !== -1 ? columns[idx] : '';
    };

    const price = parseInt(getCol('price')) || 0;
    const unit = getCol('unit') || 'tháng';
    
    // Construct default price option
    const priceOptions: PriceOption[] = price > 0 ? [{
      id: Math.random().toString(36).substr(2, 9),
      name: `Gói ${unit}`,
      price: price,
      currency: 'K',
      unit: unit,
      isHighlight: false
    }] : [];

    const product: Partial<Product> = {
      name: getCol('name'),
      slug: getCol('slug'),
      categoryId: getCol('categoryId'),
      status: (getCol('status') as any) || 'draft',
      tags: getCol('tags') ? getCol('tags').split('|') : [],
      thumbnailUrl: getCol('thumbnailUrl'),
      shortDescription: getCol('shortDescription'),
      fullDescription: getCol('shortDescription'), // Default to short desc
      priceOptions: priceOptions,
      galleryUrls: []
    };

    if (product.name) {
      products.push(product);
    }
  }

  return products;
};

export const exportProductsToCSV = (products: Product[]) => {
  // 1. Define Headers (Vietnamese)
  const headers = ['Tên sản phẩm', 'Mô tả ngắn', 'Bảng giá chi tiết', 'Lưu ý', 'Trạng thái', 'Danh mục ID'];

  // 2. Helper to format CSV cell (escape quotes, wrap in quotes)
  const escapeCsvCell = (text: string | number | undefined | null) => {
    if (text === undefined || text === null) return '';
    const stringValue = String(text);
    // If contains quote, comma or newline, wrap in quotes and escape internal quotes
    if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // 3. Map products to rows
  const rows = products.map(p => {
    // Format Pricing: "Tên gói - Giá - Thời hạn (Mô tả)" joined by newlines
    const pricingText = p.priceOptions?.map(opt => {
      const desc = opt.description ? ` (${opt.description})` : '';
      return `- ${opt.name}: ${new Intl.NumberFormat('vi-VN').format(opt.price)}K / ${opt.unit}${desc}`;
    }).join('\n');

    return [
      escapeCsvCell(p.name),
      escapeCsvCell(p.shortDescription),
      escapeCsvCell(pricingText),
      escapeCsvCell(p.notes),
      escapeCsvCell(p.status === 'published' ? 'Đang hiện' : 'Ẩn/Nháp'),
      escapeCsvCell(p.categoryId)
    ].join(',');
  });

  // 4. Combine with BOM for UTF-8 Excel support
  // \uFEFF is the Byte Order Mark, essential for Excel to read Vietnamese correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

  // 5. Trigger Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `Danh_sach_san_pham_HyleHub_${dateStr}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
