import axios from "../config/axios.config";
import type { Category } from "../types/category.types";
import type { ApiResponse } from "../types/api.type";

const BASE_URL = "/categories";

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const res = await axios.get<ApiResponse<any[]>>(BASE_URL);

    const raw = Array.isArray(res.data) ? res.data : res.data?.data ?? [];

    return raw.map((c) => ({
      id: c.categoryId,
      name: c.categoryName,
    }));
  },

  async create(payload: Omit<Category, "id">): Promise<Category> {
    const res = await axios.post<ApiResponse<any>>(
      BASE_URL,
      { categoryName: payload.name }, 
      {
        headers: { "Content-Type": "application/json" }, 
      }
    );

    const c = res.data?.data ?? res.data;
    return { id: c.categoryId, name: c.categoryName };
  },

  async update(id: number, payload: Omit<Category, "id">): Promise<Category> {
    const res = await axios.put<ApiResponse<any>>(
      `${BASE_URL}/${id}`,
      { categoryName: payload.name }, 
      {
        headers: { "Content-Type": "application/json" }, 
      }
    );

    const c = res.data?.data ?? res.data;
    return { id: c.categoryId, name: c.categoryName };
  },

  async delete(id: number): Promise<void> {
    await axios.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  },
};
