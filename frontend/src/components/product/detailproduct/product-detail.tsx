import React, { useState } from "react";
import { Minus, Plus, X } from "lucide-react";

interface Book {
    book_id: number;
    category: string;
    publisher: string;
    supplier: string;
    title: string;
    author: string;
    isbn: string;
    price: number;
    stock_quantity: number;
    published_year: number;
    description: string;
    image: string;
    weight: number;
    numofpages: number;
}

const mockBook: Book = {
    book_id: 1,
    category: "Văn học nước ngoài",
    publisher: "NXB Thế giới",
    supplier: "Nhã Nam",
    title: "Thần Thoại Và Truyền Thuyết - Bìa Cứng",
    author: "Philip Wilkingson",
    isbn: "8935252450600",
    price: 436500,
    stock_quantity: 540,
    published_year: 2025,
    description: `Thần thoại nảy sinh từ mối quan hệ...`,
    image: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935252450600.jpg",
    weight: 540,
    numofpages: 352,
};

interface ProductDetailPageProps {
    productId?: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
    const [quantity, setQuantity] = useState(1);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const book = mockBook;

    const increase = () => setQuantity((q) => q + 1);
    const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    return (
        <div className="container mx-auto py-10 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
                <div className="lg:col-span-6 flex flex-col gap-4 items-start">
                    <div className="rounded-xl max-w-sm shadow-md h-[400px] w-[85%] overflow-hidden">
                        <img
                            src={book.image}
                            alt=""
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={() => setLightboxOpen(true)}>
                        <img
                            src={book.image}
                            alt=""
                            className="rounded-md object-cover w-full h-full"
                        />
                    </div>
                </div>

                <div className="lg:col-span-6 flex flex-col justify-start gap-3">
                    <h1 className="text-xl font-semibold text-gray-700">{book.title}</h1>
                    <p className="text-gray-600 text-sm">ISBN: {book.isbn}</p>
                    <p className="text-gray-700 font-medium">{book.supplier}</p>

                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-2xl font-bold text-red-600">
                            {book.price.toLocaleString()}đ
                        </span>
                        <span className="text-gray-400 line-through text-lg">485,000đ</span>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <button
                            onClick={decrease}
                            className="p-2 border rounded-md hover:bg-gray-100"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border rounded-md">{quantity}</span>
                        <button
                            onClick={increase}
                            className="p-2 border rounded-md hover:bg-gray-100"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button className="flex-1 bg-orange-500 text-white py-3 rounded-md font-medium hover:bg-orange-600 transition">
                            Thêm vào giỏ
                        </button>
                        <button className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-md font-medium hover:bg-orange-50 transition">
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-[15px] font-sans text-sm">
                <div className="border-b border-gray-300 pb-2 mb-6">
                    <h2 className="text-xl font-bold text-gray-700">GIỚI THIỆU SÁCH</h2>
                </div>

                <div className="space-y-3 text-gray-700 leading-relaxed">
                    <h3 className="font-semibold">Mô tả sản phẩm</h3>
                    <p className="whitespace-pre-line">{book.description}</p>
                </div>

                <div className="mt-10">
                    <h3 className="font-semibold text-gray-700 mb-3">Thông tin chi tiết</h3>
                    <table className="w-full border-none text-gray-700">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-3 w-1/4">Mã hàng</td>
                                <td className="py-3">{book.isbn}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-3">Tác giả</td>
                                <td className="py-3">{book.author}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-3">Danh mục</td>
                                <td className="py-3">{book.category}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-3">Năm XB</td>
                                <td className="py-3">{book.published_year}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-3">Trọng lượng (g)</td>
                                <td className="py-3">{book.weight}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-3">Số trang</td>
                                <td className="py-3">{book.numofpages}</td>
                            </tr>
                            <tr>
                                <td className="py-3">Hình thức</td>
                                <td className="py-3">Bìa cứng</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {lightboxOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative max-w-3xl w-full mx-4">
                        <button
                            className="absolute top-2 right-2 text-white p-2 rounded-full hover:bg-gray-800 transition"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={book.image}
                            alt="Zoomed"
                            className="w-full h-auto max-h-[90vh] object-contain rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;
