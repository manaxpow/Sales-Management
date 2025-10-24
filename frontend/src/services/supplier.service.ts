import axios from 'axios';
import type { Supplier, CreateSupplierRequest, SupplierResponse } from '../types/supplier.types';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    // headers (Authorization) nếu cần
});

export const getSuppliers = async (): Promise<Supplier[]> => {
    try {
        const response = await api.get<Supplier[]>('/suppliers');
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
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
        console.error('Error fetching supplier by ID:', error);
        throw error;
    }
};

export const createSupplier = async (data: CreateSupplierRequest): Promise<SupplierResponse> => {
    try {
        const formData = new FormData();
        formData.append('Name', data.name);
        formData.append('Phone', data.phone);
        formData.append('Email', data.email);
        formData.append('Address', data.address);
        

        const response = await api.post<SupplierResponse>('/suppliers', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
};

export const updateSupplier = async (id: number, data: CreateSupplierRequest): Promise<SupplierResponse | null> => {
    try {
        const formData = new FormData();
        formData.append('Id', id.toString());
        formData.append('Name', data.name);
        formData.append('Phone', data.phone);
        formData.append('Email', data.email);
        formData.append('Address', data.address);

        const response = await api.put<SupplierResponse>(`/suppliers/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        console.error('Error updating supplier:', error);
        throw error;
    }
};

export const deleteSupplier = async (id: number): Promise<boolean> => {
    try {
        const response = await api.delete(`/suppliers/${id}`);
        return response.status === 204;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        console.error('Error deleting supplier:', error);
        throw error;
    }
};