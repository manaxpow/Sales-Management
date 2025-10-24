import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Supplier } from "../../../types/supplier.types";

const SupplierProductsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Giả lập dữ liệu supplier (sẽ thay bằng fetch sau)
    // const supplier: Supplier = {
    //     id: Number(id),
    //     name: "Nhà Sách Tiền Phong",
    //     contact_name: "Đặng Quốc Huy",
    //     phone: "0988123123",
    //     email: "support@tienphongbook.vn",
    //     address: "45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
    //     status: "ACTIVE",
    //     created_at: "2025-03-20",
    // };

    // // Dữ liệu sản phẩm giả định
    // const products = [
    //     { id: 1, name: "Đắc Nhân Tâm", category: "Kỹ năng sống", price: 89000 },
    //     { id: 2, name: "Nhà Giả Kim", category: "Văn học", price: 99000 },
    //     { id: 3, name: "7 Thói Quen Hiệu Quả", category: "Phát triển bản thân", price: 129000 },
    //     { id: 4, name: "Tôi Tài Giỏi, Bạn Cũng Thế!", category: "Kỹ năng sống", price: 115000 },
    //     { id: 5, name: "Harry Potter và Hòn Đá Phù Thủy", category: "Thiếu nhi", price: 159000 },
    // ];

    return (
        // <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl w-full p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Sách được cung cấp bởi 
                </h2>

                <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-4 py-2 text-left">Tên sách</th>
                            <th className="px-4 py-2 text-left">Thể loại</th>
                            <th className="px-4 py-2 text-right">Giá (VNĐ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {products.map((p) => (
                            <tr key={p.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{p.name}</td>
                                <td className="px-4 py-2">{p.category}</td>
                                <td className="px-4 py-2 text-right">{p.price.toLocaleString()}</td>
                            </tr>
                        ))} */}
                    </tbody>
                </table>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-150"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        // </div>
    );
};

export default SupplierProductsPage;
