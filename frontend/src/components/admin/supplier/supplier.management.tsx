import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TablePagination } from "@mui/material";
import type { Supplier, SupplierResponse } from "../../../types/supplier.types";
import { getSuppliers, deleteSupplier } from "../../../services/supplier.service";
import { getProductsBySupplierIdService } from "../../../services/product.service";
import UpdateModal from "./modal/update-modal";
import DeleteModal from "./modal/delete-modal";
import CreateModal from "./modal/create-modal";
import AlertModal from "./modal/alert-modal";

const SupplierManagement: React.FC = () => {
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const fetchSuppliers = async () => {
        const response = await getSuppliers();
        if (response.success) {
            setSuppliers(response.data || []);
        } else {
            console.error('API Error Response:', response.message || 'No message provided');
            setSuppliers([]);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredSuppliers = suppliers.filter((s) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            s.name.toLowerCase().includes(search) ||
            s.phone.toLowerCase().includes(search) ||
            s.email.toLowerCase().includes(search) ||
            (s.address && s.address.toLowerCase().includes(search));
        return matchesSearch;
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageChange = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startIndex = page * rowsPerPage;
    const currentSuppliers = filteredSuppliers.slice(startIndex, startIndex + rowsPerPage);

    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | SupplierResponse | null>(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [alertModalMessage, setAlertModalMessage] = useState("");
    const [checkingSupplierId, setCheckingSupplierId] = useState<number | null>(null);


    const handleSubmitCreate = async () => {
        await fetchSuppliers();
        setCreateOpen(false);
    };

    const handleView = (supplier: Supplier) => {
        navigate(`/admin/products/supplier/${supplier.id}`);
    };

    // open update modal
    const handleUpdate = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setUpdateOpen(true);
    };

    const handleDelete = async (supplier: Supplier) => {
        if (checkingSupplierId) return;
        setCheckingSupplierId(supplier.id);
        setSelectedSupplier(supplier);
        const response = await getProductsBySupplierIdService(supplier.id);

        setCheckingSupplierId(null);

        if (response.success) {
            if (response.data && response.data.length > 0) {
                setAlertModalMessage(`Không thể xóa "${supplier.name}" vì đang có ${response.data.length} sản phẩm liên quan.`);
                setAlertModalOpen(true);
            }
            else {
                setDeleteOpen(true);
            }
        } else {
            setAlertModalMessage(response.message || "Lỗi khi kiểm tra sản phẩm.");
            setAlertModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedSupplier && selectedSupplier.id) {
            const response = await deleteSupplier(selectedSupplier.id);
            if (response.success) {
                await fetchSuppliers();
            } else {
                console.error('Delete failed:', response.message);
            }
        } else {
            console.error('No supplier selected or ID is missing for deletion.');
        }
        setDeleteOpen(false);
    };

    const handleSubmitUpdate = async () => {
        await fetchSuppliers();
        setUpdateOpen(false);
        setSelectedSupplier(null);
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
                            currentSuppliers.map((supplier) => {
                                const isChecking = checkingSupplierId === supplier.id;

                                return (
                                    <tr
                                        key={supplier.id}
                                        className={`border-t hover:bg-gray-50 transition ${isChecking ? 'opacity-50' : ''}`}
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
                                                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-300"
                                                    title="Xem chi tiết"
                                                    disabled={isChecking}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate(supplier)}
                                                    className="text-yellow-600 hover:text-yellow-700 disabled:text-gray-300"
                                                    title="Chỉnh sửa"
                                                    disabled={isChecking}
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(supplier)}
                                                    className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                                                    title="Xóa"
                                                    disabled={isChecking}
                                                >
                                                    {isChecking ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>

                <TablePagination
                    component="div"
                    count={filteredSuppliers.length}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from} - ${to} trên tổng ${count !== -1 ? count : `hơn ${to}`}`
                    }
                    sx={{
                        "& .MuiTablePagination-toolbar": {
                            paddingLeft: 2,
                            paddingRight: 2,
                        },
                        "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                        {
                            fontSize: "0.875rem",
                        },
                        "& .MuiTablePagination-select": {
                            paddingTop: 1,
                            paddingBottom: 1,
                        },
                    }}
                />
            </div>

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

            <AlertModal
                isOpen={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                title="Không thể xóa"
                message={alertModalMessage}
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
