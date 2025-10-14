import React from "react";

const categories = [
  "Sách Văn Học Trong Nước",
  "Sách Học Ngoại Ngữ",
  "Sách Thiếu Nhi",
  "Sách Kinh Tế",
  "Sách Tâm Lý - Kỹ Năng",
  "Sách Nghệ Thuật",
];

const hotProducts = [
  { id: "p1", title: "Để Con Chăm Sóc ...", price: "133,200₫", img: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png" },
  { id: "p2", title: "Bộ Sách ...", price: "245,000₫", img: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png" },
  { id: "p3", title: "Từ Sách ...", price: "135,000₫", img: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png" },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 hidden lg:block">
      <div className="bg-white border rounded mb-6 p-4">
        <h4 className="font-semibold mb-3">Danh mục</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          {categories.map((c) => (
            <li key={c}>
              <a className="block hover:text-blue-600" href={`/category/${encodeURIComponent(c)}`}>
                {c}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border rounded p-4">
        <h4 className="font-semibold mb-3">Sách Mới Bán Chạy</h4>
        <div className="space-y-3">
          {hotProducts.map((p) => (
            <div key={p.id} className="flex items-start gap-3">
              <a href={`/product/${p.id}`} className="w-14 h-20 bg-gray-50 flex items-center justify-center rounded overflow-hidden">
                <img src={p.img} alt={p.title} className="max-w-full max-h-full object-contain" />
              </a>
              <div className="flex-1 text-sm">
                <a href={`/product/${p.id}`} className="block font-medium text-gray-800 line-clamp-2">
                  {p.title}
                </a>
                <div className="text-sm text-red-600 mt-1">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
