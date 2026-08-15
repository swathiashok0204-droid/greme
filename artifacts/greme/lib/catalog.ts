import { supabase } from '@/lib/supabase';

export type SortOption = 'newest' | 'low' | 'high' | 'rated';

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl?: string;
  description?: string;
  category?: string;
  createdAt?: string;
  rating?: number;
  reviewCount?: number;
  sizes?: string[];
  colors?: string[];
};

function asNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeProduct(row: Record<string, unknown>): Product {
  const price = asNumber(row.price) ?? 0;
  return {
    id: String(row.id),
    name: String(row.name ?? 'Untitled product'),
    price,
    oldPrice: asNumber(row.old_price ?? row.oldPrice),
    imageUrl: typeof row.image_url === 'string' ? row.image_url : undefined,
    description:
      typeof row.description === 'string' ? row.description : undefined,
    category: typeof row.category === 'string' ? row.category : undefined,
    createdAt: typeof row.created_at === 'string' ? row.created_at : undefined,
    rating: asNumber(row.rating ?? row.average_rating),
    reviewCount: asNumber(row.review_count),
    sizes: Array.isArray(row.sizes)
      ? row.sizes.filter((item): item is string => typeof item === 'string')
      : undefined,
    colors: Array.isArray(row.colors)
      ? row.colors.filter((item): item is string => typeof item === 'string')
      : undefined,
  };
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;
}

export function discountPercent(product: Product): number | undefined {
  if (!product.oldPrice || product.oldPrice <= product.price) return undefined;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export async function listProducts(options?: {
  search?: string;
  category?: string;
  sort?: SortOption;
}): Promise<Product[]> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add the project URL and publishable key to the app environment.',
    );
  }

  let query = supabase
    .from('products')
    .select(
      'id,name,price,image_url,description,category,created_at,old_price,emoji',
    )
    .limit(100);
  const search = options?.search?.trim();
  if (search) query = query.ilike('name', `%${search}%`);
  if (options?.category && options.category !== 'All') {
    query = query.eq('category', options.category);
  }

  const { data, error } = await query;
  if (error) throw error;

  const products = (data ?? []).map((row) =>
    normalizeProduct(row as Record<string, unknown>),
  );
  const sort = options?.sort ?? 'newest';
  return products.sort((a, b) => {
    if (sort === 'low') return a.price - b.price;
    if (sort === 'high') return b.price - a.price;
    if (sort === 'rated') return (b.rating ?? 0) - (a.rating ?? 0);
    return (
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
    );
  });
}

export async function getProduct(id: string): Promise<Product> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add the project URL and publishable key to the app environment.',
    );
  }
  const { data, error } = await supabase
    .from('products')
    .select(
      'id,name,price,image_url,description,category,created_at,old_price,emoji',
    )
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('This product could not be found.');
  return normalizeProduct(data as Record<string, unknown>);
}