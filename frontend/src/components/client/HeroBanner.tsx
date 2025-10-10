import React from "react";

const banners = [
  "https://theme.hstatic.net/200000845405/1001223012/14/home_slider_image_3.jpg?v=462",
  "https://theme.hstatic.net/200000845405/1001223012/14/home_slider_image_1.jpg?v=462",
  "https://theme.hstatic.net/200000845405/1001223012/14/home_slider_image_2.jpg?v=462",
];

const HeroBanner: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="rounded overflow-hidden bg-gray-100">
        <img src={banners[0]} alt="hero" className="w-full h-56 md:h-80 object-cover" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <img src={banners[1]} alt="sub1" className="w-full h-24 object-cover rounded" />
        <img src={banners[2]} alt="sub2" className="w-full h-24 object-cover rounded" />
        {/* <div className="w-full h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded flex items-center justify-center text-sm text-gray-700">
          Banner nhỏ/Quảng cáo
        </div> */}
      </div>
    </div>
  );
};

export default HeroBanner;
