export interface Promotion {
  promotionId: number;
  promotionCode: string;
  description: string;
  discountType: number;
  discountValue: number;
  minOrderAmount: number;
  usagelimit: number;
  usedcount: number;
  status: number;
  startDate: string;
  endDate: string;
}

export interface PromotionFormData {
  PromotionCode: string;
  Description: string;
  DiscountType: number;
  DiscountValue: number;
  MinOrderAmount: number;
  Usagelimit: number;
  StartDate: string;
  EndDate: string;
}
export interface PromotionUpdateFormData
  extends Omit<PromotionFormData, "PromotionCode" | "DiscountType"> {
  PromotionId: number;
  Status: number;
}

export interface PromotionDelete {
  PromotionId: number;
  Status: number;
}
export interface PromotionFilters {
  PromotionCode: string;
  status: number | "all";
  page: number;
  limit: number;
}

export interface GetPromotionResponse {
  promotions: Promotion[];
  totalPromotion: number;
  totalPages: number;
}

export interface GetPromotionRequest {
  page: number;
  limit: number;
  filters?: PromotionFilters;
}
