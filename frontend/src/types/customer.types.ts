export interface CustomerResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface GetCustomerResponse {
  customers: CustomerResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateCustomerRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface GetCustomerRequest {
  search?: string;
  limit: number;
  page: number;
}
