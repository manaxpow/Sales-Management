export interface Category {
  id: number;
  name: string;
}

export interface RawCategory {
  categoryId: number;
  categoryName: string;
}

export interface CategoryFormData {
  name: string;
}
