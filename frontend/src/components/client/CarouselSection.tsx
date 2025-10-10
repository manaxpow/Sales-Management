import React, { useRef } from "react";
import ProductCard from "./ProductCard";

export type Product = {
  id: string;
  title: string;
  image: string;
  price?: string;
  priceOld?: string;
  badge?: string;
};

const CarouselSection: React.FC<{ title: string; items: Product[] }> = ({ title, items }) => {
  const railRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const offset = dir === "left" ? -el.clientWidth * 0.6 : el.clientWidth * 0.6;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} aria-label="prev" className="p-2 bg-white border rounded">
            ‹
          </button>
          <button onClick={() => scroll("right")} aria-label="next" className="p-2 bg-white border rounded">
            ›
          </button>
        </div>
      </div>

      <div ref={railRef} className="min-w-0 flex gap-4 overflow-x-auto py-2">
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
