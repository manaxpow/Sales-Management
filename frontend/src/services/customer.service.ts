import axios from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";
import type {
  CreateCustomerRequest,
  CustomerResponse,
  GetCustomerRequest,
  GetCustomerResponse,
  UpdateCustomerRequest,
} from "../types/customer.types";

const BASE_URL = "/customers";

export const customerService = {
  async getAll(
    request: GetCustomerRequest
  ): Promise<ApiResponse<GetCustomerResponse>> {
    try {
      const res = await axios.get<ApiResponse<GetCustomerResponse>>(BASE_URL, {
        params: request,
      });
      return {
        success: true,
        message: "Lấy khách hàng thành công",
        statusCode: 200,
        data: res.data.data,
      };
    } catch (error) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi không xác định",
        statusCode: err.statusCode ?? 500,
      };
    }
  },

  async create(
    payload: CreateCustomerRequest
  ): Promise<ApiResponse<CustomerResponse>> {
    try {
      const res = await axios.post(BASE_URL, payload);

      return {
        success: true,
        message: "Tạo khách hàng thành công",
        statusCode: 200,
        data: res.data.data as CustomerResponse,
      };
    } catch (error) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi tạo khách hàng",
        statusCode: err.statusCode ?? 500,
      };
    }
  },

  async update(
    id: number,
    payload: UpdateCustomerRequest
  ): Promise<ApiResponse<CustomerResponse>> {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, payload);
      return {
        success: true,
        message: "Cập nhật khách hàng thành công",
        statusCode: 200,
        data: res.data as CustomerResponse,
      };
    } catch (error) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi khách hàng danh mục",
        statusCode: err.statusCode ?? 500,
      };
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        message: "Xoá khách hàng thành công",
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi khách hàng mục",
        statusCode: err.statusCode ?? 500,
        data: null,
      };
    }
  },

  async getById(id: number): Promise<ApiResponse<CustomerResponse>> {
    try {
      const res = await axios.get<ApiResponse<CustomerResponse>>(
        `${BASE_URL}/${id}`
      );
      return {
        success: true,
        message: "Lấy khách hàng thành công",
        statusCode: 200,
        data: res.data.data,
      };
    } catch (error) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Không tìm thấy khách hàng",
        statusCode: err.statusCode ?? 404,
      };
    }
  },
};
