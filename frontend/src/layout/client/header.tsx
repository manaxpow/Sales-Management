import React from "react";
import SearchBox from "../../components/client/SearchBox";

const Header: React.FC = () => {
  return (
    <header id="header" className="sticky top-0 bg-white z-40 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-4">
          {/* logo */}
          <div className="flex items-center">
              <img src="//theme.hstatic.net/200000845405/1001223012/14/logo.png?v=462" alt="Vinabook" className="h-10 object-contain"/>
          </div>

          {/* search center */}
          <div className="flex-1 px-6 hidden md:flex justify-center">
            <SearchBox />
          </div>

          {/* support + icons */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <img src="//theme.hstatic.net/200000845405/1001223012/14/phone-call.png?v=462" className="w-10 h-10" alt="support"/>
              <div className="text-sm">
                <p className="text-xs text-gray-500">Tư vấn bán hàng</p>
                <span className="font-semibold">028.73008182</span>
              </div>
            </div>

            {/* mobile icons */}
            <div className="flex items-center gap-4 lg:hidden">
              <button aria-label="Open search" className="p-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <button aria-label="Open menu" className="p-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
