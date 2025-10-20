export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  orderCode: string;
  createdDate: string; // ISO date string
  totalPaymentAmount: number;
  status: 'pending' | 'completed' | 'canceled';
}

export interface OrderFilters {
  search: string;
  status: 'all' | 'pending' | 'completed' | 'canceled';
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}
