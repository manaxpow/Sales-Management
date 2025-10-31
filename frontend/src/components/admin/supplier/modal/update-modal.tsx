import React, { useState, useEffect } from "react";
import type { Supplier, UpdateSupplierRequest, SupplierResponse } from "../../../../types/supplier.types";
import { updateSupplier } from "../../../../services/supplier.service";

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplierData?: Supplier | SupplierResponse;
    onSubmit: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
    isOpen,
    onClose,
    supplierData,
    onSubmit,
}) => {
    const initialFormData: UpdateSupplierRequest = {
        id: 0,
        name: "",
        phone: "",
        email: "",
        address: "", 
    };

    const [formData, setFormData] = useState<UpdateSupplierRequest>(initialFormData);
    const [errors, setErrors] = useState({ name: "", phone: "", email: "" });
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (supplierData) {
            setFormData({
                id: supplierData.id,
                name: supplierData.name,
                phone: supplierData.phone,
                email: supplierData.email,
                address: supplierData.address || "",
            });
        }
        setErrors({ name: "", phone: "", email: "" });
        setApiError(null);
        setIsSubmitting(false);
    }, [supplierData, isOpen]);

    if (!isOpen) return null;

    const validateField = (fieldName: string, value: string): string => {
        switch (fieldName) {
            case "name":
                if (!value.trim()) return "Tên nhà cung cấp không được trống";
                break;
            case "phone":
                if (!/^0\d{9,10}$/.test(value)) return "Số điện thoại không hợp lệ";
                break;
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email sai định dạng";
                break;
        }
        return "";
    };

    // Xử lý khi người dùng nhập liệu
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        if (apiError) setApiError(null);
    };

    // Xử lý khi người dùng rời khỏi một input
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Logic xử lý submit form
    const handleSubmit = async () => {
        if (isSubmitting || !supplierData?.id) return;

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

        try {
            const result = await updateSupplier(supplierData.id, formData);
            if (result) {
                onSubmit(); // Gọi callback của cha để tải lại + đóng modal
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
            setApiError(errorMessage);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 transform transition-all">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Cập nhật nhà cung cấp
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tên nhà cung cấp */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Tên nhà cung cấp</label>
                        <input
                            type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Số điện thoại</label>
                        <input
                            type="text" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">Email</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Địa chỉ */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">Địa chỉ</label>
                        <input
                            type="text" name="address" value={formData.address} onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-blue-500"
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
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;