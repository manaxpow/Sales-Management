import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import type { Supplier, CreateSupplierRequest } from "../../../types/supplier.types";
import { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from "../../../services/supplier.service";
import ViewModal from "./modal/view-modal";
import UpdateModal from "./modal/update-modal";
import DeleteModal from "./modal/delete-modal";
import CreateModal from "./modal/create-modal";
import SupplierPagination from "./supplier.pagination";

const SupplierManagement: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getSuppliers();
                setSuppliers(data);
            } catch (error) {
                console.error('Error loading suppliers:', error);
            }
        };
        fetchSuppliers();
    }, []);

    // Bộ lọc + tìm kiếm (loại bỏ status filter)
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSuppliers = suppliers.filter((s) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            s.name.toLowerCase().includes(search) ||
            s.phone.toLowerCase().includes(search) ||
            s.email.toLowerCase().includes(search) ||
            s.address.toLowerCase().includes(search);
        return matchesSearch;
    });

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

    // modal
    const [viewOpen, setViewOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    // refetch data
    const refetchSuppliers = async () => {
        try {
            const data = await getSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error('Error refetching suppliers:', error);
        }
    };

    // open modal
    const handleSubmitCreate = async (newSupplier: CreateSupplierRequest) => {
        try {
            await createSupplier(newSupplier);
            await refetchSuppliers();
        } catch (error) {
            console.error('Error creating supplier:', error);
        }
        setCreateOpen(false);
    };

    const handleView = async (supplier: Supplier) => {
        try {
            const detailedSupplier = await getSupplierById(supplier.id);
            setSelectedSupplier(detailedSupplier || supplier);
        } catch (error) {
            console.error('Error fetching supplier details:', error);
            setSelectedSupplier(supplier);
        }
        setViewOpen(true);
    };

    const handleUpdate = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setUpdateOpen(true);
    };

    const handleDelete = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedSupplier && selectedSupplier.id) {
            try {
                await deleteSupplier(selectedSupplier.id);
                await refetchSuppliers();
            } catch (error) {
                console.error('Error deleting supplier:', error);
            }
        } else {
            console.error('No supplier selected or ID is missing for deletion.');
        }
        setDeleteOpen(false);
    };

    const handleSubmitUpdate = async (updatedSupplier: Supplier) => {
        if (!updatedSupplier.id) return;
        try {
            await updateSupplier(updatedSupplier.id, {
                name: updatedSupplier.name,
                phone: updatedSupplier.phone,
                email: updatedSupplier.email,
                address: updatedSupplier.address,
            });
            await refetchSuppliers();
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
        setUpdateOpen(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Quản lý nhà cung cấp
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhà cung cấp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Xóa tìm kiếm */}
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                            }}
                            className="px-3 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                >
                    <Plus size={18} />
                    <span>Thêm mới</span>
                </button>
            </div>

            {/* Bảng danh sách (loại bỏ cột Trạng thái, thêm Địa chỉ) */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                            <th className="py-3 px-4 font-semibold">ID</th>
                            <th className="py-3 px-4 font-semibold">Tên nhà cung cấp</th>
                            <th className="py-3 px-4 font-semibold">Số điện thoại</th>
                            <th className="py-3 px-4 font-semibold">Email</th>
                            <th className="py-3 px-4 font-semibold">Địa chỉ</th>
                            <th className="py-3 px-4 font-semibold text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSuppliers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                    Không có dữ liệu nhà cung cấp.
                                </td>
                            </tr>
                        ) : (
                            currentSuppliers.map((supplier) => (
                                <tr
                                    key={supplier.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="py-3 px-4">{supplier.id}</td>
                                    <td className="py-3 px-4 font-medium text-gray-800">{supplier.name}</td>
                                    <td className="py-3 px-4">{supplier.phone}</td>
                                    <td className="py-3 px-4">{supplier.email}</td>
                                    <td className="py-3 px-4">{supplier.address}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleView(supplier)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(supplier)}
                                                className="text-yellow-600 hover:text-yellow-700"
                                                title="Chỉnh sửa"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(supplier)}
                                                className="text-red-600 hover:text-red-700"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <SupplierPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        if (page >= 1 && page <= totalPages) setCurrentPage(page);
                    }}
                />
            </div>

            {/* Các modal */}
            <ViewModal
                isOpen={viewOpen}
                onClose={() => setViewOpen(false)}
                supplierData={selectedSupplier || undefined}
            />

            <UpdateModal
                isOpen={updateOpen}
                onClose={() => {
                    setUpdateOpen(false);
                    setSelectedSupplier(null);
                }}
                supplierData={selectedSupplier || undefined}
                onSubmit={handleSubmitUpdate}
            />

            <DeleteModal
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                supplierName={selectedSupplier?.name}
                id={selectedSupplier?.id}
            />
            <CreateModal
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleSubmitCreate}
            />
        </div>
    );
};

export default SupplierManagement;