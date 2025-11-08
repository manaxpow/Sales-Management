import instance from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";

const URL_API = "/orderitems";

export interface OrderItemResponse {
  orderItemId: number;
  orderId: number;
  productid: number;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface GetOrderItemsFilter {
  orderId?: number;
}

export const GetOrderItemsService = async (
  filter: GetOrderItemsFilter
): Promise<ApiResponse<OrderItemResponse[]>> => {
  try {
    const res = await instance.get(URL_API, {
      params: filter,
    });
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

export const GetOrderItemByIdService = async (
  id: number
): Promise<ApiResponse<OrderItemResponse>> => {
  try {
    const res = await instance.get(`${URL_API}/${id}`);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};
