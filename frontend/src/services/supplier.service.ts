
import instance from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";
import type {
    CreateSupplierRequest,
    UpdateSupplierRequest,
    SupplierResponse
} from '../types/supplier.types';

const URL_API = '/suppliers';

const getSuppliers = async (): Promise<ApiResponse<SupplierResponse[]>> => {
    try {
        const res = await instance.get<ApiResponse<SupplierResponse[]>>(URL_API);
        return res.data;
    } catch (error) {
        return error as ErrorApiResponse;
    }
};

const getSupplierById = async (id: number): Promise<ApiResponse<SupplierResponse>> => {
    try {
        const res = await instance.get<ApiResponse<SupplierResponse>>(`${URL_API}/${id}`);
        return res.data;
    } catch (error) {
        return error as ErrorApiResponse;
    }
};

const createSupplier = async (data: CreateSupplierRequest): Promise<ApiResponse<SupplierResponse>> => {
    try {
        const res = await instance.post<ApiResponse<SupplierResponse>>(URL_API, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        return error as ErrorApiResponse;
    }
};

const updateSupplier = async (id: number, data: UpdateSupplierRequest): Promise<ApiResponse<SupplierResponse>> => {
    try {
        data.id = id;
        const res = await instance.patch<ApiResponse<SupplierResponse>>(URL_API, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        return error as ErrorApiResponse;
    }
};

const deleteSupplier = async (id: number): Promise<ApiResponse<boolean>> => {
    try {
        const res = await instance.delete(`${URL_API}/${id}`);
        if (res.status === 204) {
            return { data: true, success: true, message: '' } as ApiResponse<boolean>;
        }
        return res.data;
    } catch (error) {
        return error as ErrorApiResponse;
    }
};

export {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};

