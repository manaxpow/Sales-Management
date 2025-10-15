import React from "react";


const FooterColumn: React.FC<{
  title: string;
  links: { label: string; href: string }[];
}> = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold mb-3">{title}</h3>
    <ul className="space-y-2 text-sm text-gray-600">
      {links.map((l) => (
        <li key={l.href}>
          <a className="hover:underline" href={l.href}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  const companyLinks = [
    { label: "Giới thiệu công ty", href: "/pages/about-us" },
    { label: "Tuyển dụng", href: "/pages/careers" },
    { label: "Chương trình đại lý", href: "/pages/hop-tac-phat-hanh" },
    { label: "Chính sách bảo mật", href: "/pages/chinh-sach-bao-mat" },
    { label: "Chính sách đổi trả", href: "/pages/chinh-sach-doi-tra" },
  ];

  const helpLinks = [
    { label: "Quy định sử dụng", href: "/pages/quy-dinh-su-dung" },
    { label: "Hướng dẫn mua hàng", href: "/pages/huong-dan-mua-hang" },
    { label: "Phương thức thanh toán", href: "/pages/phuong-thuc-thanh-toan" },
    { label: "Phương thức vận chuyển", href: "/pages/phuong-thuc-van-chuyen" },
    { label: "Ứng dụng đọc ebook", href: "https://reader.vinabook.com/?ref=bottom-footer" },
  ];

  const newsLinks = [
    { label: "Tin tức", href: "/news" },
    { label: "Chân dung", href: "/news/chan-dung" },
    { label: "Điểm sách", href: "/news/diem-sach" },
    { label: "Phê bình", href: "/news/phe-binh" },
  ];

  const popularSearch = [
    "truyện dan brown",
    "sách warren buffett",
    "sách digital marketing",
    "truyện mới của nguyễn nhật ánh",
    "sách cho con",
    "sách hay về gia đình",
  ];

  return (
    <footer className="text-gray-800 bg-white">
      <div className="py-10 border-t">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <FooterColumn title="VỀ CÔNG TY" links={companyLinks} />
              <FooterColumn title="TRỢ GIÚP" links={helpLinks} />
              <FooterColumn title="TIN TỨC SÁCH" links={newsLinks} />
            </div>

            {/* Right: payments, shippers, popular searches */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">CHẤP NHẬN THANH TOÁN</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_payment_1.png?v=462" alt="payment1" className="h-8" />
                  <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_payment_2.png?v=462" alt="payment2" className="h-8" />
                  <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_payment_3.png?v=462" alt="payment3" className="h-8" />
                  <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_payment_4.png?v=462" alt="payment4" className="h-8" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">ĐỐI TÁC VẬN CHUYỂN</h3>
                <div className="flex gap-2 flex-wrap items-center">
                  <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_shipment_1.png?v=462" alt="ship1" className="h-8" />
                  <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_shipment_2.png?v=462" alt="ship2" className="h-8" />
                  <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logo_shipment_3.png?v=462" alt="ship3" className="h-8" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">THƯỜNG ĐƯỢC TÌM KIẾM</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearch.map((s) => (
                    <a key={s} href={`/search?q=${encodeURIComponent(s)}`} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div className="mt-10 border-t pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <a href="http://online.gov.vn/Home/WebDetails/610" className="block">
                  <img src="//theme.hstatic.net/200000845405/1001223012/14/footer_logobct.png?v=462" alt="logo" className="h-12" />
                </a>
              </div>

              <div className="text-sm text-gray-700 max-w-2xl">
                <h4 className="font-semibold">CÔNG TY CỔ PHẦN THƯƠNG MẠI DỊCH VỤ MÊ KÔNG COM</h4>
                <p>Địa chỉ: <span className="font-medium">332 Lũy Bán Bích, Phường Tân Phú, TP. Hồ Chí Minh</span></p>
                <p>MST: <span className="font-medium">0303615027</span></p>
                <p>
                  Tel: <span className="font-medium">028.73008182</span> - Fax: <span className="font-medium">028.39733234</span> -
                  Email: <a className="text-blue-600 hover:underline ml-1" href="mailto:hotro@vinabook.com">hotro@vinabook.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
