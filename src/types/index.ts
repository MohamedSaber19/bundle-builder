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

export interface CartItem {
  productId: string;
  variantId: string; // "default" if no variants exist
  quantity: number;
}
