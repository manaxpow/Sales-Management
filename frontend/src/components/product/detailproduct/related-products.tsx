import React from "react";

interface RelatedProduct {
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

const relatedProductsData: RelatedProduct[] = [
    {
        book_id: 1,
        category: "Philosophy",
        publisher: "Ancient Wisdom Press",
        supplier: "Book Suppliers Inc.",
        title: "How To Be Free - Để Được Tự Do - Là Một Cuốn Sách Hay",
        author: "Epictetus",
        isbn: "978-1234567890",
        price: 90000,
        stock_quantity: 50,
        published_year: 2020,
        description: "A guide to freedom and stoicism.",
        image: "https://placehold.co/150x220?text=Epictetus",
        weight: 300,
        numofpages: 200,
    },
    {
        book_id: 2,
        category: "Finance",
        publisher: "Money Makers Publishing",
        supplier: "Global Books",
        title: "Rich Dad Poor Dad - Cha Giàu Cha Nghèo - Hành Trình Làm Giàu",
        author: "Robert Kiyosaki",
        isbn: "978-0987654321",
        price: 120000,
        stock_quantity: 30,
        published_year: 1997,
        description: "Lessons in financial literacy.",
        image: "https://placehold.co/150x220?text=Rich+Dad",
        weight: 250,
        numofpages: 250,
    },
    {
        book_id: 3,
        category: "Self-Help",
        publisher: "Life Lessons Books",
        supplier: "Book Distributors",
        title: "The Power of Habit - Sức Mạnh Của Thói Quen - Thay Đổi Cuộc Đời",
        author: "Charles Duhigg",
        isbn: "978-1122334455",
        price: 85000,
        stock_quantity: 40,
        published_year: 2012,
        description: "Understanding and changing habits.",
        image: "https://placehold.co/150x220?text=Power+of+Habit",
        weight: 350,
        numofpages: 300,
    },
    {
        book_id: 4,
        category: "Philosophy",
        publisher: "Stoic Publications",
        supplier: "Ancient Texts Supply",
        title: "Meditations - Những Suy Tư - Của Marcus Aurelius",
        author: "Marcus Aurelius",
        isbn: "978-5566778899",
        price: 95000,
        stock_quantity: 25,
        published_year: 180,
        description: "Personal writings of a Roman emperor.",
        image: "https://placehold.co/150x220?text=Meditations",
        weight: 280,
        numofpages: 180,
    },
];

const RelatedProducts: React.FC = () => {
    return (
        <div className="container mt-10 w-full flex flex-col gap-4">
            <h2 className="text-center font-bold mb-4 text-gray-700 text-xl">
                Sản phẩm liên quan
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
                {relatedProductsData.slice(0, 4).map((product) => (
                    <div key={product.book_id} className="relative w-[220px]">
                        <div className="absolute top-[10px] right-[10px] bg-red-600 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                            -10%
                        </div>
                        <div className="bg-transparent">
                            <img
                                src={product.image}
                                alt=""
                                className="h-[250px] object-contain w-full"
                            />
                            <div className="mt-2 text-left">
                                <p className="font-medium text-gray-900 truncate text-sm">
                                    {product.title}
                                </p>
                                <div className="flex items-center mt-1">
                                    <p className="text-red-600 font-semibold mr-2 text-sm">
                                        {product.price.toLocaleString()}đ
                                    </p>
                                    <p className="text-gray-500 line-through text-sm">
                                        {(product.price * 1.111).toFixed(0)}đ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;