import React from "react";
import ContactItem from "../ui/ContactItem";
import { IconPhone, IconEnvelope, IconMap, IconCart } from "../ui/icons";

const Topbar: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-700 text-sm border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-2">
          <div className="hidden lg:flex flex-1 items-center">
            <ContactItem href="tel:028.73008182" label="028.73008182" Icon={IconPhone} />
            <ContactItem href="mailto:hotro@vinabook.com" label="hotro@vinabook.com" Icon={IconEnvelope} />
            <ContactItem href="/" label="332 Lũy Bán Bích, Phường Tân Phú, TP. HCM" Icon={IconMap} />
          </div>

          <div className="flex items-center ml-4">
            <div className="mr-6">
              <a className="uppercase font-semibold text-xs mr-4" href="/account/login">Đăng nhập</a>
              <a className="uppercase font-semibold text-xs" href="/account/register">Đăng ký</a>
            </div>

            <div className="relative">
              <button aria-label="Giỏ hàng" className="flex items-center focus:outline-none">
                <span className="relative inline-flex items-center">
                  <IconCart className="w-5 h-5 text-gray-700"/>
                  <span className="absolute -right-2 -top-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">0</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
