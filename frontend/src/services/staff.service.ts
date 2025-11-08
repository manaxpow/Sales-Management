import axios from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";
import type {
  Staff,
  RawStaff,
  CreateStaffFormData,
  UpdateStaffFormData,
} from "../types/staff.types";

const BASE_URL = "/users";

export const StaffService = {
  async getAll(): Promise<ApiResponse<Staff[]>> {
    try {
      const res = await axios.get(BASE_URL);

      const rawData: RawStaff[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const mapped: Staff[] = rawData.map((s) => ({
        id: s.id,
        username: s.userName,
        fullName: s.fullName,
        role: s.role,
      }));

      return {
        success: true,
        message: "Lấy danh sách nhân viên thành công",
        statusCode: 200,
        data: mapped,
      };
    } catch (error: any) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi khi tải danh sách nhân viên",
        statusCode: err.statusCode ?? 500,
        data: [],
      };
    }
  },

  async create(payload: CreateStaffFormData): Promise<ApiResponse<Staff>> {
    try {
      const res = await axios.post<RawStaff | ApiResponse<RawStaff>>(
        BASE_URL,
        {
          userName: payload.username,
          fullName: payload.fullName,
          password: payload.password,
          role: payload.role,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const s: RawStaff = (res.data as any).data ?? (res.data as RawStaff);

      const mapped: Staff = {
        id: s.id,
        username: s.userName,
        fullName: s.fullName,
        role: s.role,
      };

      return {
        success: true,
        message: "Tạo nhân viên thành công",
        statusCode: 200,
        data: mapped,
      };
    } catch (error: any) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi khi tạo nhân viên",
        statusCode: err.statusCode ?? 500,
      };
    }
  },

  async update(
    id: number,
    payload: UpdateStaffFormData
  ): Promise<ApiResponse<Staff>> {
    try {
      const res = await axios.put<RawStaff | ApiResponse<RawStaff>>(
        `${BASE_URL}/${id}`,
        {
          fullName: payload.fullName,
          userName: payload.username,
          role: payload.role,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const s: RawStaff = (res.data as any).data ?? (res.data as RawStaff);

      const mapped: Staff = {
        id: s.id,
        username: s.userName,
        fullName: s.fullName,
        role: s.role,
      };

      return {
        success: true,
        message: "Cập nhật nhân viên thành công",
        statusCode: 200,
        data: mapped,
      };
    } catch (error: any) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi khi cập nhật nhân viên",
        statusCode: err.statusCode ?? 500,
      };
    }
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        message: "Xoá nhân viên thành công",
        statusCode: 200,
        data: null,
      };
    } catch (error: any) {
      const err = error as ErrorApiResponse;
      return {
        success: false,
        message: err.message ?? "Lỗi khi xoá nhân viên",
        statusCode: err.statusCode ?? 500,
        data: null,
      };
    }
  },
};
