export interface ProductResponse {
  productId: number;
  productName: string;
  status: number;
  barcode: string;
  supplierName: string;
  categoryName: string;
  price: number;
  unit: string;
}

export interface GetProductResponse {
  totalProduct: number;
  totalPage: number;
  currentPage: number;
  products: ProductResponse[];
}

export interface ProductFilter {
  SupplierId?: number;
  CategoryId?: number;
  ProductName?: string;
  Price?: number;
  Page?: number;
  Limit?: number;
  Status?: number;
}

export interface CreateProductRequest {
  SupplierId: number;
  CategoryId: number;
  ProductName: string;
  Price: number;
  Unit: string;
}
export interface UpdateProductRequest extends CreateProductRequest {
  ProductId: number;
  Status: number;
}
