import React from "react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    supplierName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    supplierName,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Xóa nhà cung cấp</h2>
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa{" "}
                    <span className="font-semibold text-red-600">{supplierName}</span> khỏi hệ thống không?
                    Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
