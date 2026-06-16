export type MaterialType =
  | "marble"
  | "granite"
  | "quartz"
  | "sandstone"
  | "onyx"
  | "limestone"
  | "other";

export type ProductColor =
  | "White"
  | "Black"
  | "Beige"
  | "Brown"
  | "Gold"
  | "Gray"
  | "Green"
  | "Blue"
  | "Pink"
  | "Cream";

export type StoneFinish =
  | "Polished"
  | "Honed"
  | "Brushed"
  | "Sandblasted"
  | "Leathered"
  | "Tumbled"
  | "Textured";

export type Thickness = "1cm" | "1.5cm" | "2cm" | "3cm";

export type ProductStatus = "in-stock" | "limited" | "pre-order";

export type ProductUseCategory =
  | "Flooring"
  | "Wall Cladding"
  | "Countertops"
  | "Outdoor"
  | "Decorative";

export type ViewMode = "grid" | "list";

export type SortOption =
  | "recommended"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popular";

export interface CatalogProduct {
  id: string;
  name: string;
  materialType: MaterialType;
  category: ProductUseCategory;
  color: ProductColor;
  finish: StoneFinish;
  thickness: Thickness;
  location: string; // city
  status: ProductStatus;
  priceRange: string; // display label
  priceMin: number;
  priceMax: number;
  popularity: number; // 1–100
  createdAt: number; // unix timestamp
  origin: string;
  bg: string; // CSS gradient for thumbnail
  textLight: boolean;
  imageUrl?: string; // hero photo URL (vendor-submitted products)
}

export interface FilterState {
  materialType: string[];
  color: string[];
  finish: string[];
  thickness: string[];
  availability: string[];
  city: string[];
  category: string[];
}

export const EMPTY_FILTERS: FilterState = {
  materialType: [],
  color: [],
  finish: [],
  thickness: [],
  availability: [],
  city: [],
  category: [],
};
