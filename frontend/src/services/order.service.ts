import instance from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";
import type { OrderItemResponse } from "./order-item.service";
import { GetOrderItemsService } from "./order-item.service";
import { GetProductByIdService } from "./product.service";

// === INTERFACES ===
export interface OrderResponse {
  id: number;
  customerid: number;
  userid: number;
  status: number;
  totalAmount: number;
  discountAmount: number;
  orderDate: string;
  promotionCode?: string | null;
}

export interface OrderRequest {
  Customerid: number;
  Userid: number;
  Status: number;
  TotalAmount: number;
  DiscountAmount: number;
  OrderDate?: string;
}

export interface GetOrdersFilter {
  customerId?: number;
  userId?: number;
  status?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateOrderItemDto {
  productid: number;
  quantity: number;
  price: number;
}

export interface CreateOrderWithItemsRequest {
  customerid: number;
  userid: number;
  status?: number;
  promotionCode?: string | null;
  items: CreateOrderItemDto[];
  paymentMethod: number;
}

export interface CreateOrderResponse extends OrderResponse {
  items: (OrderItemResponse & { productName?: string })[];
}

export interface OrderDetailResponse {
  order: OrderResponse;
  items: (OrderItemResponse & { productName: string })[];
}

const URL_API = "/orders";
const productNameCache = new Map<number, string>();

const GetOrdersService = async (
  filter: GetOrdersFilter
): Promise<ApiResponse<OrderResponse[]>> => {
  try {
    const res = await instance.get(URL_API, {
      params: {
        ...filter,
        dateFrom: filter.dateFrom || undefined,
        dateTo: filter.dateTo || undefined,
      },
    });
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const GetOrderByIdService = async (
  id: number
): Promise<ApiResponse<OrderResponse>> => {
  try {
    const res = await instance.get(`${URL_API}/${id}`);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const CreateOrderService = async (
  data: OrderRequest
): Promise<ApiResponse<OrderResponse>> => {
  try {
    const res = await instance.post(URL_API, data);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const UpdateOrderService = async (
  id: number,
  data: Partial<OrderRequest>
): Promise<ApiResponse<OrderResponse>> => {
  try {
    const res = await instance.put(`${URL_API}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const DeleteOrderService = async (id: number): Promise<ApiResponse<string>> => {
  try {
    const res = await instance.delete(`${URL_API}/${id}`);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const CreateOrderWithItemsService = async (
  data: CreateOrderWithItemsRequest
): Promise<ApiResponse<CreateOrderResponse>> => {
  try {
    const res = await instance.post(`${URL_API}/with-items`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return {
      success: false,
      message: err.message || "Tạo đơn hàng thất bại",
      statusCode: err.statusCode || 500,
    };
  }
};

const GetOrderDetailService = async (
  orderId: number
): Promise<ApiResponse<OrderDetailResponse>> => {
  try {
    const orderRes = await GetOrderByIdService(orderId);
    if (!orderRes.success || !orderRes.data) {
      return {
        success: false,
        message: orderRes.message || "Không tìm thấy đơn hàng",
        statusCode: orderRes.statusCode || 404,
      };
    }

    const itemsRes = await GetOrderItemsService({ orderId });
    const rawItems = itemsRes.success ? itemsRes.data || [] : [];

    const items = await Promise.all(
      rawItems.map(async (item) => {
        let productName = productNameCache.get(item.productid);

        if (!productName) {
          const prodRes = await GetProductByIdService(item.productid);
          productName =
            prodRes.success && prodRes.data
              ? prodRes.data.productName || `SP#${item.productid}`
              : `SP#${item.productid}`;
          productNameCache.set(item.productid, productName);
        }

        return {
          ...item,
          productName,
        };
      })
    );

    return {
      success: true,
      message: "Lấy chi tiết đơn hàng thành công",
      statusCode: 200,
      data: {
        order: orderRes.data,
        items,
      },
    };
  } catch (error) {
    const err = error as ErrorApiResponse;
    return {
      success: false,
      message: err.message ?? "Lỗi server",
      statusCode: err.statusCode ?? 500,
    };
  }
};

export {
  GetOrdersService,
  GetOrderByIdService,
  CreateOrderService,
  CreateOrderWithItemsService,
  UpdateOrderService,
  DeleteOrderService,
  GetOrderDetailService,
};
