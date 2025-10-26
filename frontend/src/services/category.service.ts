import axios from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";
import type { Category, RawCategory, CategoryFormData } from "../types/category.types";

const BASE_URL = "/categories";

export const CategoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      const res = await axios.get(BASE_URL);

      const rawData: RawCategory[] = Array.isArray(res.data)
        ? res.data 
        : Array.isArray(res.data.data)
        ? res.data.data 
        : [];

      const mapped: Category[] = rawData.map((c) => ({
        id: c.categoryId,
        name: c.categoryName,
      }));

      return {
        success: true,
        message: "Lấy danh mục thành công",
        statusCode: 200,
        data: mapped,
      };
    } catch (error: any) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi không xác định",
        statusCode: err.statusCode ?? 500,
        data: [],
      };
    }
  },

  async create(payload: CategoryFormData): Promise<ApiResponse<Category>> {
    try {
      const res = await axios.post<RawCategory | ApiResponse<RawCategory>>(
        BASE_URL,
        { categoryName: payload.name },
        { headers: { "Content-Type": "application/json" } } 
      );

      const c: RawCategory =
        (res.data as any).data ?? (res.data as RawCategory);

      const mapped: Category = {
        id: c.categoryId,
        name: c.categoryName,
      };

      return {
        success: true,
        message: "Tạo danh mục thành công",
        statusCode: 200,
        data: mapped,
      };
    } catch (error: any) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi tạo danh mục",
        statusCode: err.statusCode ?? 500,
      };
    }
  },

  async update(id: number, payload: CategoryFormData): Promise<ApiResponse<Category>> {
    try {
      const res = await axios.put<RawCategory | ApiResponse<RawCategory>>(
        `${BASE_URL}/${id}`,
        { categoryName: payload.name },
        { headers: { "Content-Type": "application/json" } }
      );

      const c: RawCategory =
        (res.data as any).data ?? (res.data as RawCategory);

      const mapped: Category = {
        id: c.categoryId,
        name: c.categoryName,
      };

      return {
        success: true,
        message: "Cập nhật danh mục thành công",
        statusCode: 200,
        data: mapped,
      };
    } catch (error: any) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi cập nhật danh mục",
        statusCode: err.statusCode ?? 500,
      };
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        message: "Xoá danh mục thành công",
        statusCode: 200,
        data: null,
      };
    } catch (error: any) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi xoá danh mục",
        statusCode: err.statusCode ?? 500,
        data: null,
      };
    }
  },
};
