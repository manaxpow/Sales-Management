import React from "react";
import type { Supplier } from "../../../../types/supplier.types";
import { useNavigate, useLocation } from "react-router-dom";

interface ViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplierData?: Supplier;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, supplierData }) => {
    if (!isOpen || !supplierData) return null;
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-[650px] p-6 transform transition-all duration-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                        Chi tiết nhà cung cấp
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-4 text-gray-700 text-base pl-6">
                        <div>
                            <span className="font-semibold text-gray-900 block mb-1">Tên nhà cung cấp:</span>
                            {supplierData.name}
                        </div>

                        <div>
                            <span className="font-semibold text-gray-900 block mb-1">Số điện thoại:</span>
                            {supplierData.phone}
                        </div>

                        <div>
                            <span className="font-semibold text-gray-900 block mb-1">Email:</span>
                            {supplierData.email}
                        </div>

                        <div className="sm:col-span-2">
                            <span className="font-semibold text-gray-900 block mb-1">Địa chỉ:</span>
                            {supplierData.address}
                        </div>

                    </div>

                    <div className="flex justify-center mt-8 pt-4 gap-10 border-t">
                        <button
                            className="px-6 py-2 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition duration-150 shadow-md shadow-rose-300"
                            onClick={() => {
                                onClose();
                                navigate(`${location.pathname}/${supplierData.id}/products`);
                            }}
                        >
                            Xem sản phẩm cung cấp
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-150 shadow-md shadow-blue-300"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewModal;