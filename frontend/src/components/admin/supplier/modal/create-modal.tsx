import React, { useState, useEffect } from "react";
import type { Supplier } from "../../../../types/supplier.types";

interface CreateSupplierFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newSupplier: Supplier) => void;
}

const CreateModal: React.FC<CreateSupplierFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const initialFormData: Omit<Supplier, "id"> = {
        name: "",
        contact_name: "",
        phone: "",
        email: "",
        address: "",
        status: "ACTIVE",
        created_at: new Date().toISOString().split("T")[0],
    };

    const [formData, setFormData] = useState<Omit<Supplier, "id">>(initialFormData);

    // ✅ Reset form mỗi khi modal được mở
    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const newSupplier: Supplier = {
            id: Date.now(),
            ...formData,
        };
        onSubmit(newSupplier);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Thêm nhà cung cấp mới
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Các input giữ nguyên */}
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
                            placeholder="Nhập tên nhà cung cấp"
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
                            placeholder="Nhập người liên hệ"
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
                            placeholder="Nhập số điện thoại"
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
                            placeholder="Nhập email"
                        />
                    </div>

                    {/* Địa chỉ */}
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
                            placeholder="Nhập địa chỉ"
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
                        Thêm mới
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;
