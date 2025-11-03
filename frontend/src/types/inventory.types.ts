// Product interface matching database structure
export interface Product {
  productId: number;
  categoryId: number;
  supplierId: number;
  productName: string;
  barcode: string;
  price: number;
  unit: string;
  createdAt: string;
}

// Inventory interface matching database structure
export interface InventoryItem {
  inventoryId: number;
  productId: number;
  quantity: number;
  updatedAt: string;
}

// Combined interface for display
export interface InventoryWithProduct extends InventoryItem {
  product: Product;
}

// Form data for editing
export interface InventoryFormData {
  quantity: number;
}

// Filters interface
export interface InventoryFilters {
  search: string;
  status: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Stock status type
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
