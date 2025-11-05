import React, { useState, useEffect } from "react";
import type { CreateSupplierRequest } from "../../../../types/supplier.types";
import { createSupplier } from "../../../../services/supplier.service";

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const initialFormData: CreateSupplierRequest = {
        name: "",
        phone: "",
        email: "",
        address: "",
    };

    const [formData, setFormData] = useState<CreateSupplierRequest>(initialFormData);
    const [errors, setErrors] = useState<{ name: string; phone: string; email: string }>({
        name: "",
        phone: "",
        email: "",
    });
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
            setErrors({ name: "", phone: "", email: "" });
            setApiError(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // ... (Hàm validateField không đổi) ...
    const validateField = (fieldName: string, value: string): string => {
        switch (fieldName) {
            case "name":
                if (!value.trim()) return "Tên nhà cung cấp không được trống";
                break;
            case "phone":
                if (!/^0\d{9,10}$/.test(value)) return "Số điện thoại không hợp lệ (10-11 số)";
                break;
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email sai định dạng";
                break;
        }
        return "";
    };

    // ... (Hàm handleChange, handleBlur không đổi) ...
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        if (apiError) setApiError(null);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };


    // [ĐÃ SỬA] Logic xử lý submit form
    const handleSubmit = async () => {
        if (isSubmitting) return;

        const validationErrors = {
            name: validateField("name", formData.name),
            phone: validateField("phone", formData.phone),
            email: validateField("email", formData.email),
        };
        setErrors(validationErrors);

        if (Object.values(validationErrors).some(e => e)) {
            return;
        }

        setIsSubmitting(true);
        setApiError(null);

        // [SỬA] Bỏ try...catch, kiểm tra 'response.success'
        const response = await createSupplier(formData);
        
        if (response.success) {
            onSubmit();
        } else {
            // Xử lý lỗi trả về từ ApiResponse
            const errorMessage = response.message || "Lỗi không xác định.";
            
            // Parse detailed duplicate errors
            const updatedErrors = { ...errors };
            if (errorMessage.includes("Tên nhà cung cấp đã tồn tại")) {
                updatedErrors.name = "Tên nhà cung cấp đã tồn tại.";
            }
            if (errorMessage.includes("Số điện thoại đã tồn tại")) {
                updatedErrors.phone = "Số điện thoại đã tồn tại.";
            }
            if (errorMessage.includes("Email đã tồn tại")) {
                updatedErrors.email = "Email đã tồn tại.";
            } 
            
            // Chỉ set lỗi chung nếu không phải 3 lỗi trùng lặp trên
            if (updatedErrors.name === "" && updatedErrors.phone === "" && updatedErrors.email === "") {
                 setApiError(errorMessage);
            }

            setErrors(updatedErrors);
            setIsSubmitting(false);
        }
    };

    return (
        // ... (Toàn bộ JSX không đổi) ...
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 transform transition-all">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Thêm nhà cung cấp mới
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tên nhà cung cấp */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Tên nhà cung cấp</label>
                        <input
                            type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Nhập tên nhà cung cấp"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Số điện thoại</label>
                        <input
                            type="text" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">Email</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Nhập email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Địa chỉ */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">Địa chỉ</label>
                        <input
                            type="text" name="address" value={formData.address || ''} onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-blue-500"
                            placeholder="Nhập địa chỉ"
                        />
                    </div>
                </div>

                {/* Khu vực hiển thị lỗi từ API */}
                {apiError && (
                    <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                        {apiError}
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang thêm...' : 'Thêm mới'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;
