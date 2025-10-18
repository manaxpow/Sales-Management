export interface Promotion {
  promotionId: number;
  code: string;
  description: string;
  discountType: "precent" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  status: "active" | "inactive";
  startDate: string;
  endDate: string;
}

export interface PromotionFormData {
  fullName: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  role: string;
}

export interface PromotionFilters {
  search: string;
  status: "all" | "active" | "inactive";
}
