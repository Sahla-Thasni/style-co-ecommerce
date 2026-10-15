export interface ProductImage {
  id: number;
  color: string;
  view: "front" | "back";
  image: string;
}

export interface ProductVariant {
  id: number;
  color: string;
  size: string;
  stock: number;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductBrand {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  unit_price: string;
  discount_percentage: string;
  discount_price: string;
  average_rating: number;
  review_count: number;
  is_active: boolean;

  category: ProductCategory;
  brand?: ProductBrand;
  gender: "men" | "women";

  images: ProductImage[];
  variants: ProductVariant[];

  created_at: string;
  updated_at: string;

  style?: {
    id: number;
    name: string;
  };
}
