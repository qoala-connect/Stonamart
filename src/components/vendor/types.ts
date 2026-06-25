export type ListingStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "INACTIVE";

export type UnitType = "sq ft" | "sq m" | "piece" | "running ft";

export interface VendorListing {
  id: string;
  name: string;
  materialType: string;
  category: string;
  color: string;
  finish: string;
  thickness: string;
  dimensions: string;
  warehouseCity: string;
  pricePerUnit: number;
  unit: UnitType;
  stockQty: number;
  isOutOfStock: boolean;
  status: ListingStatus;
  views: number;
  createdAt: number;
  adminFeedback?: string;
  bg: string;
  textLight: boolean;
}

// ─── Form state shapes ─────────────────────────────────────────────────────────
export interface FormStep1 {
  name: string;
  materialType: string;
  category: string;
  stockQty: string;
  pricePerUnit: string;
  unit: UnitType;
}

export interface FormStep2 {
  color: string;
  finish: string;
  thickness: string;
  dimensions: string;
  warehouseCity: string;
}

export interface FormStep3 {
  files: (File | null)[];
  heroIdx: number;
  uploadedUrls: (string | null)[]; // [0-5]: image URLs, [6]: video URL; null = not uploaded yet
}

export const EMPTY_STEP1: FormStep1 = {
  name: "",
  materialType: "",
  category: "",
  stockQty: "",
  pricePerUnit: "",
  unit: "sq ft",
};

export const EMPTY_STEP2: FormStep2 = {
  color: "",
  finish: "",
  thickness: "",
  dimensions: "",
  warehouseCity: "",
};

export function emptyStep3(): FormStep3 {
  return {
    files: Array(7).fill(null) as (File | null)[],
    heroIdx: 0,
    uploadedUrls: Array(7).fill(null) as (string | null)[],
  };
}
