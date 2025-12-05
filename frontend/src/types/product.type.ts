export interface ProductResponse {
  productId: number;
  productName: string;
  status: number;
  barcode: string;
  supplierName: string;
  categoryName: string;
  price: number;
  unit: string;
  categoryId: number;
  supplierId: number;
  quantity: number;
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
  SortBy?: string;
}

export interface CreateProductRequest {
  SupplierId: number;
  CategoryId: number;
  ProductName: string;
  Price: number;
  Unit: string;
  Status: number;
}
export interface UpdateProductRequest extends CreateProductRequest {
  ProductId: number;
  Status: number;
}

export interface DeleteProductRequest {
  ProductId: number;
  Status: number;
}
