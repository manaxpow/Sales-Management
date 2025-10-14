export interface Staff {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role: string;
  joinDate: string;
  avatar?: string;
}

export interface StaffFormData {
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role: string;
}

export interface StaffFilters {
  search: string;
  status: 'all' | 'active' | 'inactive';
}
