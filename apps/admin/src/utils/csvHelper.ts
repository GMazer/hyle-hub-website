import { Product, PriceOption } from '../../../packages/shared/types';

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
    const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g); 
    const columns = row ? row.map(val => val.replace(/^"|"$/g, '').trim()) : lines[i].split(',').map(v => v.trim());
    
    if (columns.length < 2) continue; // Skip empty rows

    const getCol = (key: string) => {
      const idx = headers.findIndex(h => h === key);
      return idx !== -1 ? columns[idx] : '';
    };

    const price = parseInt(getCol('price')) || 0;
    const unit = getCol('unit') || 'tháng';
    
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
      fullDescription: getCol('shortDescription'), 
      priceOptions: priceOptions,
      galleryUrls: []
    };

    if (product.name) {
      products.push(product);
    }
  }

  return products;
};