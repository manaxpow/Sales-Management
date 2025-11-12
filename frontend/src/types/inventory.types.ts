// Product interface matching API response structure
export interface Product {
  id: number;
  productId: number;
  productName: string;
  barcode: string;
  price: number;
  quantity: number;
}

// Form data for editing
export interface InventoryFormData {
  quantity: number;
}

// Form errors type
export interface InventoryFormErrors {
  quantity?: string;
}

// Filters interface
export interface InventoryFilters {
  search: string;
  status: 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

// Stock status type
export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface GetInventoryRequest {
  page: number;
  pageSize: number;
  search: string;
  status: 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface GetInventoryResponse {
  products: {
    id: number;
    productId: number;
    productName: string;
    barcode: string;
    price: number;
    quantity: number;
  }[];
  totalCount: number;
}
