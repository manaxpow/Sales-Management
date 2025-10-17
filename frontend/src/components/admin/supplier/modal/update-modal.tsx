import React, { useState, useEffect } from "react";

import type { Supplier } from "../../../../types/supplier.types";

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplierData?: Supplier;
    onSubmit: (updatedSupplier: Supplier) => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
    isOpen,
    onClose,
    supplierData,
    onSubmit,
}) => {
    // Khởi tạo state với Supplier đã được import
    const [formData, setFormData] = useState<Supplier>(
        supplierData || {
            id: 0,
            name: "",
            contact_name: "",
            phone: "",
            email: "",
            address: "",
            status: "ACTIVE",
            created_at: "",
        }
    );

    useEffect(() => {
        if (supplierData) {
            setFormData(supplierData);
        } else {
            setFormData({
                id: 0,
                name: "",
                contact_name: "",
                phone: "",
                email: "",
                address: "",
                status: "ACTIVE",
                created_at: "",
            });
        }
    }, [supplierData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value } as Supplier);
    };

    const handleSubmit = () => {
        const submittedData: Supplier = {
            ...formData,
            created_at: supplierData?.created_at || formData.created_at,
        };
        onSubmit(submittedData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Cập nhật nhà cung cấp
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tên nhà cung cấp */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">
                            Tên nhà cung cấp
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                        />
                    </div>

                    {/* Người liên hệ */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">
                            Người liên hệ
                        </label>
                        <input
                            type="text"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                        />
                    </div>

                    {/* Địa chỉ (2 cột) */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm text-gray-600 block mb-1">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">
                            Trạng thái
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                        >
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Ngừng hoạt động</option>
                        </select>
                    </div>

                    {/* Hidden input để giữ created_at trong formData, không cho edit */}
                    <input
                        type="hidden"
                        name="created_at"
                        value={formData.created_at}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
