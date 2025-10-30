export type Supplier = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSupplierRequest = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type UpdateSupplierRequest = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type SupplierResponse = Supplier;