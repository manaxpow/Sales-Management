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
    <div className="w-36 sm:w-40 md:w-44"> 
      <div className="relative bg-white rounded shadow-sm overflow-hidden">
        {badge && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
            {badge}
          </div>
        )}
        <a href={`/product/${id}`} className="h-40 md:h-44 lg:h-48 flex items-center justify-center bg-gray-50">
          <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
        </a>
      </div>

      <div className="mt-2">
        <a href={`/product/${id}`} className="block text-sm font-medium text-gray-800 line-clamp-2">
          {title}
        </a>
        <div className="mt-1">
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
  );
};

export default ProductCard;
