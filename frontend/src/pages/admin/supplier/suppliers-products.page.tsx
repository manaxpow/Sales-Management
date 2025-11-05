import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Info,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Hash,
    Search
} from "lucide-react";
import { TablePagination } from "@mui/material";
import type { Supplier, SupplierResponse } from "../../../../src/types/supplier.types";
import type { ProductResponse } from "../../../../src/types/product.type";
import { getSupplierById } from "../../../../src/services/supplier.service";
import { getProductsBySupplierIdService } from "../../../../src/services/product.service";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const renderProductStatus = (status: number) => {
    switch (status) {
        case 1:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full"></span>
                    Đang kinh doanh
                </span>
            );
        case 0:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    <span className="w-2 h-2 mr-1.5 bg-red-500 rounded-full"></span>
                    Ngừng kinh doanh
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    <span className="w-2 h-2 mr-1.5 bg-gray-500 rounded-full"></span>
                    Không xác định
                </span>
            );
    }
};

const InfoRow: React.FC<{ icon: React.ElementType, label: string, value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
    <div className="flex justify-between items-start py-3">
        <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Icon size={16} className="text-gray-400" />
            <span>{label}</span>
        </dt>
        <dd className="text-sm text-gray-900 text-right font-medium">{value || "(Không có)"}</dd>
    </div>
);


const SupplierProductsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState<Supplier | SupplierResponse | null>(null);
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSupplier = useCallback(async (supplierId: number) => {
        try {
            const response = await getSupplierById(supplierId);
            if (response.success && response.data) {
                setSupplier(response.data);
            } else {
                setError(response.message || "Không thể tải thông tin nhà cung cấp.");
                setSupplier(null);
            }
        } catch (err) {
            console.error('Error fetching supplier:', err);
            setError("Lỗi kết nối máy chủ (supplier).");
            setSupplier(null);
        }
    }, []);

    const fetchProducts = useCallback(async (supplierId: number) => {
        try {
            const response = await getProductsBySupplierIdService(supplierId);
            if (response.success) {
                setProducts(response.data || []);
            } else {
                console.error("Lỗi tải sản phẩm:", response.message);
                setProducts([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError("Lỗi kết nối máy chủ (products).");
        }
    }, []);


    useEffect(() => {
        if (id) {
            const supplierId = parseInt(id, 10);
            if (!isNaN(supplierId)) {
                const loadData = async () => {
                    setIsLoading(true);
                    setError(null);
                    const supplierPromise = fetchSupplier(supplierId);
                    const productsPromise = fetchProducts(supplierId);
                    await Promise.all([supplierPromise, productsPromise]);
                    setIsLoading(false);
                };
                loadData();
            } else {
                setError("ID nhà cung cấp không hợp lệ.");
                setIsLoading(false);
            }
        }
    }, [id, fetchSupplier, fetchProducts]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [productSearchTerm, setProductSearchTerm] = useState("");

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredProducts = products.filter((product) => {
        const searchTerm = productSearchTerm.toLowerCase();
        return (
            product.productName.toLowerCase().includes(searchTerm) ||
            product.barcode.toLowerCase().includes(searchTerm) ||
            (product.categoryName && product.categoryName.toLowerCase().includes(searchTerm))
        );
    });

    const currentProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
                    <p className="mt-3 text-lg font-medium text-gray-700">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error || !supplier) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-red-600 mb-4">Đã xảy ra lỗi</h3>
                    <p className="text-gray-600 mb-6">{error || "Không tìm thấy nhà cung cấp."}</p>
                    <Link to="/admin/suppliers"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                        <ArrowLeft size={18} />
                        Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="Quay lại"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {supplier.name}
                                </h1>
                                <p className="text-sm text-gray-500">Chi tiết nhà cung cấp</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-fit sticky top-24">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Info size={18} className="text-blue-600" />
                                    Thông tin liên hệ
                                </h2>
                            </div>
                            <dl className="divide-y divide-gray-200 px-6">
                                <InfoRow icon={Phone} label="Số điện thoại" value={supplier.phone} />
                                <InfoRow icon={Mail} label="Email" value={supplier.email} />
                                <InfoRow icon={MapPin} label="Địa chỉ" value={supplier.address} />
                                <InfoRow icon={Calendar} label="Ngày tạo" value={new Date(supplier.createdAt || '').toLocaleDateString('vi-VN')} />
                                <InfoRow icon={Calendar} label="Ngày cập nhật" value={new Date(supplier.updatedAt || '').toLocaleDateString('vi-VN')} />
                            </dl>
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                            <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Danh sách sản phẩm ({filteredProducts.length})
                                </h2>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm sản phẩm..."
                                        value={productSearchTerm}
                                        onChange={(e) => setProductSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search size={18} />
                                    </div>
                                </div>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <div className="text-center p-12 text-gray-500">
                                    <Hash size={40} className="mx-auto text-gray-400" />
                                    <p className="mt-2 font-medium">
                                        {productSearchTerm ? "Không tìm thấy sản phẩm" : "Không có sản phẩm"}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="py-3 px-6 font-semibold">Tên sản phẩm</th>
                                                <th className="py-3 px-6 font-semibold">Mã sản phẩm</th>
                                                <th className="py-3 px-6 font-semibold">Danh mục</th>
                                                <th className="py-3 px-6 font-semibold text-right">Giá bán</th>
                                                <th className="py-3 px-6 font-semibold text-center">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentProducts.map((product) => (
                                                <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <span className="text-gray-800">{product.productName}</span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                                            {product.barcode}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-600">{product.categoryName || "N/A"}</td>
                                                    <td className="py-4 px-6 text-gray-800 text-right">
                                                        {formatCurrency(product.price)}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        {renderProductStatus(product.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <TablePagination
                                        component="div"
                                        count={filteredProducts.length}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                        labelRowsPerPage="Số hàng mỗi trang:"
                                        labelDisplayedRows={({ from, to, count }) =>
                                            `${from} - ${to} trên tổng ${count}`
                                        }
                                        sx={{
                                            borderTop: '1px solid #e5e7eb',
                                            "& .MuiTablePagination-toolbar": { paddingLeft: 2, paddingRight: 2 },
                                            "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": { fontSize: "0.875rem", color: '#6b7280' },
                                            "& .MuiTablePagination-select": { paddingTop: 1, paddingBottom: 1 },
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierProductsPage;

