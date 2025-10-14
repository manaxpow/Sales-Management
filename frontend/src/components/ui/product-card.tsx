import React from "react";

type Props = {
  id: string;
  title: string;
  image: string;
  price?: string;
  priceOld?: string;
  badge?: string;
};

const ProductCard: React.FC<Props> = ({ id, title, image, price, priceOld, badge }) => {
  return (
    // Sử dụng flex-shrink-0 để đảm bảo card không bị co lại trong container flex
    <div className="w-36 sm:w-40 md:w-44 flex-shrink-0">
      <div className="relative bg-white rounded shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Phần hình ảnh */}
        <div>
          {badge && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded z-10">
              {badge}
            </div>
          )}
          <a href={`/product/${id}`} className="h-40 md:h-44 lg:h-48 flex items-center justify-center bg-gray-50">
            <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
          </a>
        </div>

        {/* Phần nội dung text (tiêu đề + giá) */}
        {/* 'flex-grow flex flex-col' để container này lấp đầy không gian còn lại và tự sắp xếp nội dung bên trong */}
        <div className="p-2 flex-grow flex flex-col">
          {/* Tiêu đề: Đặt chiều cao cố định (h-10 tương đương 2 dòng text-sm) và dùng line-clamp */}
          <a href={`/product/${id}`} className="block text-sm font-medium text-gray-800 line-clamp-2 h-10">
            {title}
          </a>
          
          {/* Phần giá: 'mt-auto' sẽ đẩy phần này xuống dưới cùng của container flex cha */}
          <div className="mt-auto pt-2">
            {price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-red-600">{price}</span>
                {priceOld && <span className="text-xs line-through text-gray-400">{priceOld}</span>}
              </div>
            ) : (
              <div className="text-sm text-gray-600">Liên hệ</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;