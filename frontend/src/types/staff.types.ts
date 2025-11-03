export interface SimpleStaff {
  id: number;
  username: string;
  fullName: string;
  role: 'admin' | 'staff';
}

export interface CreateStaffFormData {
  username: string;
  fullName: string;
  password: string;
  role?: 'admin' | 'staff';
}

export interface UpdateStaffFormData {
  fullName: string;
  username?: string;
  role: "admin" | "staff";
}

export interface StaffFilters {
  search: string;
  role: 'all' | 'admin' | 'staff';
}

export interface RawStaff {
  id: number;
  userName: string;
  fullName: string;
  role: "admin" | "staff";
}
export interface Staff {
  id: number;
  username: string;
  fullName: string;
  role: "admin" | "staff";
}