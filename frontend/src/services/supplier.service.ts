import axios from 'axios';
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest, SupplierResponse } from '../types/supplier.types';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

const handleApiError = (error: unknown): Error => {
    if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || error.response.data?.title || 'Có lỗi xảy ra từ máy chủ.';
        return new Error(message);
    }
    return new Error('error');
};


export const getSuppliers = async (): Promise<Supplier[]> => {
    try {
        const response = await api.get<Supplier[]>('/suppliers');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};


export const getSupplierById = async (id: number): Promise<SupplierResponse | null> => {
    try {
        const response = await api.get<SupplierResponse>(`/suppliers/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw handleApiError(error);
    }
};

export const createSupplier = async (data: CreateSupplierRequest): Promise<SupplierResponse> => {
    try {

        const response = await api.post<SupplierResponse>('/suppliers', data);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};


export const updateSupplier = async (id: number, data: UpdateSupplierRequest): Promise<SupplierResponse | null> => {
    try {
        const response = await api.put<SupplierResponse>(`/suppliers/${id}`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null; 
        }
        throw handleApiError(error);
    }
};


export const deleteSupplier = async (id: number): Promise<boolean> => {
    try {
        const response = await api.delete(`/suppliers/${id}`);
        return response.status === 204 || response.status === 200;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw handleApiError(error);
    }
};
