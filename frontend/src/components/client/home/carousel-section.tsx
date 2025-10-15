import React, { useRef } from "react";
import ProductCard from "../../ui/product-card";

export type Product = {
  id: string;
  title: string;
  image: string;
  price?: string;
  priceOld?: string;
  badge?: string;
};

// Icon SVG cho nút bấm
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CarouselSection: React.FC<{ title: string; items: Product[] }> = ({ title, items }) => {
  const railRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    // Cuộn khoảng 80% chiều rộng của container
    const offset = dir === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} aria-label="previous" className="p-2 bg-white border rounded-full shadow-sm hover:bg-gray-100 transition-colors">
            <ChevronLeftIcon />
          </button>
          <button onClick={() => scroll("right")} aria-label="next" className="p-2 bg-white border rounded-full shadow-sm hover:bg-gray-100 transition-colors">
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Thêm 'flex-nowrap' để ngăn item xuống dòng và kích hoạt cuộn ngang */}
      {/* Thêm class 'hide-scrollbar' để ẩn thanh cuộn (cần thêm CSS) */}
      <div ref={railRef} className="min-w-0 flex gap-4 overflow-x-auto py-2 flex-nowrap hide-scrollbar">
        {items.map((it) => (
          <ProductCard
            key={it.id}
            id={it.id}
            title={it.title}
            image={it.image}
            price={it.price}
            priceOld={it.priceOld}
            badge={it.badge}
          />
        ))}
      </div>
    </section>
  );
};

export default CarouselSection;