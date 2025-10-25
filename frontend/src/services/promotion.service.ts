import instance from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";

import type {
  GetPromotionRequest,
  GetPromotionResponse,
  Promotion,
  PromotionDelete,
  PromotionFilters,
  PromotionFormData,
  PromotionUpdateFormData,
} from "../types/promotion.type";
const URL_API = "/promotion";
const createPromotionService = async (
  data: PromotionFormData
): Promise<ApiResponse<Promotion>> => {
  try {
    const res = await instance.post(URL_API, data);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const GetPromotionsService = async (
  query: GetPromotionRequest
): Promise<ApiResponse<GetPromotionResponse>> => {
  try {
    const { status } = query as PromotionFilters;
    const res = await instance.get(URL_API, {
      params: {
        ...query,
        status: status == "all" ? undefined : status,
      },
    });
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const UpdatePromotionService = async (
  data: PromotionUpdateFormData | PromotionDelete
): Promise<ApiResponse<Promotion>> => {
  try {
    const res = await instance.patch(URL_API, data);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

export { createPromotionService, GetPromotionsService, UpdatePromotionService };
