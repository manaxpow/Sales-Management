import React, { useState, useEffect } from "react";
import ContactItem from "../../components/ui/contact-item";
import { IconPhone, IconEnvelope, IconMap, IconCart } from "../../components/ui/icons";
import SearchBox from "../../components/ui/search-box";

const Header: React.FC = () => {
  const [showTopbar, setShowTopbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY && currentScroll > 50) {
        setShowTopbar(false);
      } else {
        setShowTopbar(true);
      }

      setIsScrolled(currentScroll > 50);
      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
      <div
        className={`transition-transform duration-300 ${showTopbar ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="bg-[#1fe05f] text-white text-sm">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between py-2">
              <div className="hidden lg:flex flex-1 items-center">
                <ContactItem href="tel:028.73008182" label="028.73008182" Icon={IconPhone} />
                <ContactItem href="mailto:hotro@vinabook.com" label="hotro@vinabook.com" Icon={IconEnvelope} />
                <ContactItem href="/" label="332 Lũy Bán Bích, Phường Tân Phú, TP. HCM" Icon={IconMap} />
              </div>
              <div className="flex items-center ml-4">
                <div className="flex items-center gap-2 mr-6">
                  <a className="uppercase font-semibold text-xs" href="/account/login">Đăng nhập</a>
                  <span className="text-gray-300">/</span>
                  <a className="uppercase font-semibold text-xs" href="/account/register">Đăng ký</a>
                </div>
                <div className="relative">
                  <button aria-label="Giỏ hàng" className="flex items-center focus:outline-none">
                    <span className="relative inline-flex items-center">
                      <IconCart className="w-5 h-5 text-white" />
                      <span className="absolute -right-2 -top-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">0</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`container mx-auto px-4 max-w-7xl transition-all duration-300 ${isScrolled ? "py-[2px]" : "py-4"
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://theme.hstatic.net/200000845405/1001223012/14/logo.png?v=469"
              alt="Vinabook"
              className={`object-contain transition-all duration-300 ${isScrolled ? "h-4" : "h-8"
                }`}
            />
          </div>

          <div className="flex-1 px-4 hidden md:flex justify-center">
            <SearchBox />
          </div>

          <div className="flex items-center gap-1">
            <img
              src="//theme.hstatic.net/200000845405/1001223012/14/phone-call.png?v=462"
              className={`transition-all duration-300 ${isScrolled ? "w-5 h-5" : "w-10 h-10"}`}
              alt="support"
            />
            <div className="leading-tight">
              <p className="text-[9px] text-gray-500">Tư vấn</p>
              <span className={`font-semibold transition-all ${isScrolled ? "text-[10px]" : "text-sm"}`}>
                028.73008182
              </span>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
