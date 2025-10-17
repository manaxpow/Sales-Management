export interface Supplier {
    id: number;
    name: string;
    contact_name: string;
    phone: string;
    email: string;
    address: string;
    status: 'ACTIVE' | 'INACTIVE'; 
    created_at: string;
}