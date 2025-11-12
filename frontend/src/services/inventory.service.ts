import instance from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";
import type {
    GetInventoryResponse,
    GetInventoryRequest
} from '../types/inventory.types';

const URL_API = '/inventory';

const getInventory = async (params: GetInventoryRequest): Promise<ApiResponse<GetInventoryResponse>> => {
    try {
        const res = await instance.get<ApiResponse<GetInventoryResponse>>(URL_API, { params });
        return res.data;
    } catch (error) {
        return error as ErrorApiResponse;
    }
};

const updateInventory = async (id: number, quantity: number) => {
    try {
        const res = await instance.put(`${URL_API}/${id}`, { quantity }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        return error as ErrorApiResponse;
    }
};

export {
    getInventory,
    updateInventory,
};

