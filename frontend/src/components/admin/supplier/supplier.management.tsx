import React, { useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import type { Supplier } from "../../../types/supplier.types";
import ViewModal from "./modal/view-modal";
import UpdateModal from "./modal/update-modal";
import DeleteModal from "./modal/delete-modal";
import CreateModal from "./modal/create-modal";
import SupplierPagination from "./supplier.pagination";



const SupplierManagement: React.FC = () => {
    // Mock dữ liệu
    const [suppliers, setSuppliers] = useState<Supplier[]>([
        {
            id: 1,
            name: "First News",
            contact_name: "Phúc An",
            phone: "0901234567",
            email: "contact@firstnews.com",
            address: "25 Nguyễn Thị Minh Khai, Q1, TP.HCM",
            status: "ACTIVE",
            created_at: "2025-02-01",
        },
        {
            id: 2,
            name: "NXB Trẻ",
            contact_name: "Lê Thu Hà",
            phone: "0907654321",
            email: "info@nxbtre.vn",
            address: "161B Lý Chính Thắng, Q3, TP.HCM",
            status: "INACTIVE",
            created_at: "2024-12-15",
        },
        {
            id: 3,
            name: "Alpha Books",
            contact_name: "Nguyễn Văn Minh",
            phone: "0911222333",
            email: "support@alphabooks.vn",
            address: "176 Thái Hà, Đống Đa, Hà Nội",
            status: "ACTIVE",
            created_at: "2025-01-10",
        },
        {
            id: 4,
            name: "Đông A Books",
            contact_name: "Trần Hoàng Long",
            phone: "0988777666",
            email: "contact@donga.vn",
            address: "12 Nguyễn Thị Diệu, Q3, TP.HCM",
            status: "ACTIVE",
            created_at: "2025-03-02",
        },
        {
            id: 5,
            name: "Nhà Xuất Bản Kim Đồng",
            contact_name: "Bùi Thanh Bình",
            phone: "0909090909",
            email: "kimdong@nxb.vn",
            address: "55 Quang Trung, Hà Nội",
            status: "ACTIVE",
            created_at: "2024-11-20",
        },
        {
            id: 6,
            name: "Thái Hà Books",
            contact_name: "Hoàng Đức",
            phone: "0977333555",
            email: "info@thaihabooks.vn",
            address: "119 Nguyễn Ngọc Nại, Thanh Xuân, Hà Nội",
            status: "INACTIVE",
            created_at: "2024-12-01",
        },
        {
            id: 7,
            name: "Saigon Books",
            contact_name: "Lâm Thảo",
            phone: "0933456789",
            email: "hello@saigonbooks.vn",
            address: "15 Nguyễn Văn Thủ, Q1, TP.HCM",
            status: "ACTIVE",
            created_at: "2025-04-05",
        },
        {
            id: 8,
            name: "Nhà Sách Fahasa",
            contact_name: "Nguyễn Hải Yến",
            phone: "0922558899",
            email: "contact@fahasa.com",
            address: "60 Nguyễn Huệ, Q1, TP.HCM",
            status: "ACTIVE",
            created_at: "2025-01-25",
        },
        {
            id: 9,
            name: "Phương Nam Book",
            contact_name: "Trần Văn Cường",
            phone: "0918777444",
            email: "info@phuongnambook.vn",
            address: "212 Nguyễn Trãi, Q5, TP.HCM",
            status: "INACTIVE",
            created_at: "2024-10-10",
        },
        {
            id: 10,
            name: "Nhà Sách Tiền Phong",
            contact_name: "Đặng Quốc Huy",
            phone: "0988123123",
            email: "support@tienphongbook.vn",
            address: "45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
            status: "ACTIVE",
            created_at: "2025-03-20",
        },
        {
            id: 11,
            name: "MCBooks",
            contact_name: "Phạm Quỳnh",
            phone: "0944556677",
            email: "contact@mcbooks.vn",
            address: "60B Trần Quốc Hoàn, Cầu Giấy, Hà Nội",
            status: "ACTIVE",
            created_at: "2025-02-14",
        },
        {
            id: 12,
            name: "Minh Long Book",
            contact_name: "Nguyễn Khánh Linh",
            phone: "0967888999",
            email: "info@minhlongbook.vn",
            address: "89 Pasteur, Q1, TP.HCM",
            status: "INACTIVE",
            created_at: "2024-09-30",
        },
        {
            id: 13,
            name: "SkyBooks",
            contact_name: "Ngô Đức Anh",
            phone: "0905454545",
            email: "skybooks@gmail.com",
            address: "20 Lê Lợi, Q1, TP.HCM",
            status: "ACTIVE",
            created_at: "2025-05-01",
        },
        {
            id: 14,
            name: "Nhà Sách Nhã Nam",
            contact_name: "Lê Phương",
            phone: "0911222444",
            email: "contact@nhanam.vn",
            address: "59 Đặng Văn Ngữ, Đống Đa, Hà Nội",
            status: "ACTIVE",
            created_at: "2025-02-22",
        },
        {
            id: 15,
            name: "BookLand",
            contact_name: "Trương Văn Bình",
            phone: "0977554411",
            email: "info@bookland.vn",
            address: "88 Lê Văn Sỹ, Q3, TP.HCM",
            status: "INACTIVE",
            created_at: "2024-11-11",
        },
    ]);

    // Bộ lọc + tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredSuppliers = suppliers.filter((s) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            s.name.toLowerCase().includes(search) ||
            s.contact_name.toLowerCase().includes(search) ||
            s.phone.toLowerCase().includes(search) ||
            s.email.toLowerCase().includes(search) ||
            s.address.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && s.status === "ACTIVE") ||
            (statusFilter === "inactive" && s.status === "INACTIVE");

        return matchesSearch && matchesStatus;
    });

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

    // Trạng thái modal
    const [viewOpen, setViewOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    // Mở từng modal
    const handleSubmitCreate = (newSupplier: Supplier) => {
        setSuppliers((prev) => [...prev, newSupplier]);
        setCreateOpen(false);
    };

    const handleView = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
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

    const handleConfirmDelete = () => {
        if (selectedSupplier) {
            setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier.id));
        }
        setDeleteOpen(false);
    };

    const handleSubmitUpdate = (updatedSupplier: Supplier) => {
        if (!updatedSupplier.id) return;
        setSuppliers((prev) =>
            prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
        );
        setUpdateOpen(false);
    };
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Quản lý nhà cung cấp
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                    {/* tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhà cung cấp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Bộ lọc*/}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                    </select>

                    {/* Xóa lọc/tìm kiếm */}
                    {(searchTerm || statusFilter !== "all") && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
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

            {/* Bảng danh sách */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                            <th className="py-3 px-4 font-semibold">#</th>
                            <th className="py-3 px-4 font-semibold">Tên nhà cung cấp</th>
                            <th className="py-3 px-4 font-semibold">Người liên hệ</th>
                            <th className="py-3 px-4 font-semibold">Số điện thoại</th>
                            <th className="py-3 px-4 font-semibold">Email</th>
                            <th className="py-3 px-4 font-semibold">Trạng thái</th>
                            <th className="py-3 px-4 font-semibold text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-500">
                                    Không có dữ liệu nhà cung cấp.
                                </td>
                            </tr>
                        ) : (
                            currentSuppliers.map((supplier, index) => (
                                <tr
                                    key={supplier.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="py-3 px-4">{index + 1}</td>
                                    <td className="py-3 px-4 font-medium text-gray-800">
                                        {supplier.name}
                                    </td>
                                    <td className="py-3 px-4">{supplier.contact_name}</td>
                                    <td className="py-3 px-4">{supplier.phone}</td>
                                    <td className="py-3 px-4">{supplier.email}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${supplier.status === "ACTIVE"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {supplier.status === "ACTIVE"
                                                ? "Hoạt động"
                                                : "Ngừng hoạt động"}
                                        </span>
                                    </td>
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