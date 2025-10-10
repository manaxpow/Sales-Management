import React from "react";
import Sidebar from "../components/client/Sidebar";
import HeroBanner from "../components/client/HeroBanner";
import CarouselSection, { type Product } from "../components/client/CarouselSection";

const sampleProducts: Product[] = [
  { id: "1", title: "Tự Do Tối Thượng", image: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png", price: "80,200₫", priceOld: "100,000₫", badge: "-20%" },
  { id: "2", title: "Trái Tim Của Phật", image: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png", price: "85,500₫", priceOld: "95,000₫", badge: "-10%" },
  { id: "3", title: "Những Thói Quen", image: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png", price: "71,000₫", priceOld: "79,000₫", badge: "-10%" },
  { id: "4", title: "Làm Việc Với Người Khó Chịu", image: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png", price: "112,500₫", priceOld: "125,000₫", badge: "-10%" },
  { id: "5", title: "Bước Vào Thế Giới Tâm Linh", image: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png", price: "115,200₫", priceOld: "128,000₫", badge: "-10%" },
  { id: "6", title: "Sách Demo 6", image: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png", price: "90,000₫" },
  { id: "7", title: "Sách Demo 7", image: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png", price: "110,000₫" },
  { id: "8", title: "Sách Demo 8", image: "https://product.hstatic.net/200000845405/product/bia_1_suc_hut_cua_su_tap_trung_708ff3862ea140aea3fb9001023207fd_medium.png", price: "59,000₫" },
];

const HomePage: React.FC = () => {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto px-4">
        <div
          className="grid grid-cols-1 gap-6 py-6"
          style={{
            gridTemplateColumns: "1fr",
          }}
        >
          <div className="hidden lg:block" />
        </div>

        <div
          className="grid gap-6 py-6"
          style={{
            gridTemplateColumns: "1fr",
          }}
        >
          <div
            className="hidden lg:grid gap-10"
            style={{ gridTemplateColumns: "260px minmax(0, 1fr)" }}
          >
            <Sidebar />

            <main className="min-w-0">
              <HeroBanner />

              <div className="mt-6">
                <CarouselSection title="Sách Mới Nổi Bật" items={sampleProducts} />
                <CarouselSection title="Sách Tâm Lý - Kỹ Năng Sống" items={sampleProducts.slice(0, 6)} />
                <CarouselSection title="Sách Kinh Tế" items={sampleProducts.slice(2, 8)} />

                <section className="mt-8">
                  <h3 className="text-base font-semibold mb-4">Nhà phát hành</h3>
                  <div className="flex gap-6 items-center flex-wrap bg-white p-4 border rounded">
                    <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_seller_1.png?v=462" className="h-12" alt="pub1" />
                    <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_seller_2.png?v=462" className="h-12" alt="pub2" />
                    <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_seller_3.png?v=462" className="h-12" alt="pub3" />
                    <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_shipment_1.png?v=462" className="h-12" alt="pub4" />
                  </div>
                </section>
              </div>
            </main>
          </div>

          <div className="lg:hidden">
            <Sidebar />
            <main className="min-w-0 mt-4">
              <HeroBanner />
              <div className="mt-6">
                <CarouselSection title="Sách Mới Nổi Bật" items={sampleProducts} />
                <CarouselSection title="Sách Tâm Lý - Kỹ Năng Sống" items={sampleProducts.slice(0, 6)} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;