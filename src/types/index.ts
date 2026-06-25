// Variant Types
export interface ProductVariant {
  id: string;
  label: string;
  color?: string;
  border?: string;
  image?: string;
}

// Product Types
export interface Product {
  id: string;
  category: "cameras" | "plan" | "sensors" | "accessories";
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  discountBadge?: string | null;
  image?: string | null;
  learnMoreUrl: string;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  label: string;
}

// Cart/Selection Types
export interface SelectedVariant {
  productId: string;
  variantId: string | null;
  quantity: number;
}

// Legacy types for old components (can be removed later)

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: "camera" | "plan" | "sensor" | "protection";
  image?: string;
}
