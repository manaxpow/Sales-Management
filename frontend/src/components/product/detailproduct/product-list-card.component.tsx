
import React from "react";

interface Product {
    id: number;
    name: string;
    price: string;
    oldPrice?: string;
    discount?: string;
    image: string;
}

interface ProductListSectionProps {
    title: string;      
    limit?: number;    
}

const mockProducts: Product[] = [
    { id: 1, name: "Hiểu Và Ứng Dụng Luân Xa", price: "50.400đ", oldPrice: "56.000đ", discount: "-10%", image: "/images/book1.jpg" },
    { id: 2, name: "Tập Văn Hóa Kỷ Niệm", price: "900.000đ", oldPrice: "1.000.000đ", discount: "-10%", image: "/images/book2.jpg" },
    { id: 3, name: "Mùa Gặt Mới - Số 2", price: "2.250.000đ", oldPrice: "2.500.000đ", discount: "-10%", image: "/images/book3.jpg" },
    { id: 4, name: "Đắc Nhân Tâm", price: "70.000đ", oldPrice: "90.000đ", discount: "-20%", image: "/images/book4.jpg" },
    { id: 5, name: "Tư Duy Nhanh Và Chậm", price: "120.000đ", oldPrice: "150.000đ", discount: "-20%", image: "/images/book5.jpg" },
];

const ProductListSection: React.FC<ProductListSectionProps> = ({ title, limit = 5 }) => {
    const displayCount = Math.min(Math.max(limit, 1), 5);
    const visibleProducts = mockProducts.slice(0, displayCount);

    return (
        <div className="w-full rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden text-gray-700">
            <div className="border-b-2 border-orange-500 px-4 py-3">
                <h2 className="font-bold text-[15px]">{title}</h2>
            </div>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    {visibleProducts.map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center gap-4 border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                        >
                            <div className="relative w-[60px] h-[80px] flex-shrink-0">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover rounded"
                                />
                                {p.discount && (
                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[0.7rem] px-1.5 rounded-tr rounded-br">
                                        {p.discount}
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="font-bold text-sm">{p.name}</p>
                                <p className="text-red-600 text-sm">{p.price}</p>
                                {p.oldPrice && (
                                    <span className="line-through text-gray-500 text-xs">
                                        {p.oldPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductListSection;
