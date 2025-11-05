import instance from "../config/axios.config";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";
import type {
  CreateProductRequest,
  GetProductResponse,
  ProductFilter,
  ProductResponse,
  UpdateProductRequest,
} from "../types/product.type";

const URL_API = "/products";
const createProductService = async (
  data: CreateProductRequest
): Promise<ApiResponse<ProductResponse>> => {
  try {
    const res = await instance.post(URL_API, data);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const GetProductsService = async (
  query: ProductFilter
): Promise<ApiResponse<GetProductResponse>> => {
  try {
    const res = await instance.get(URL_API, {
      params: {
        ...query
      },
    });
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const UpdateProductService = async (
  data: UpdateProductRequest
): Promise<ApiResponse<ProductResponse>> => {
  try {
    const res = await instance.patch(URL_API, data);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};

const getProductsBySupplierIdService = async (
  supplierId: number
): Promise<ApiResponse<ProductResponse[]>> => { 
  try {
    const res = await instance.get<ApiResponse<ProductResponse[]>>(`${URL_API}/supplier/${supplierId}`);
    return res.data;
  } catch (error) {
    const err = error as ErrorApiResponse;
    return err;
  }
};
export { createProductService, GetProductsService, UpdateProductService, getProductsBySupplierIdService };
