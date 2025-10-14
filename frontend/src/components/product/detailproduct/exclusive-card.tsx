import { FileText, Headset, Truck, Phone } from "lucide-react";

const ExclusiveCard = () => {
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden text-sm">
            <div className="bg-gray-100 px-4 py-3 font-semibold text-gray-800 border-b border-gray-200">
                Chỉ có ở Vinabook
            </div>
            <ul>
                <li className="flex items-center px-4 py-3">
                    <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-gray-900">Sản phẩm 100% chính hãng</span>
                </li>
                <li className="flex items-center px-4 py-3">
                    <Headset className="w-5 h-5  mr-3 flex-shrink-0" />
                    <span className="text-gray-900">Tư vấn mua sách trong giờ hành chính</span>
                </li>
                <li className="flex items-center px-4 py-3">
                    <Truck className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-gray-900">Miễn phí vận chuyển cho Đơn hàng từ 250.000đ</span>
                </li>
                <li className="flex items-center px-4 py-3">
                    <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-gray-900">Hotline: 1900 6401</span>
                </li>
            </ul>
        </div>
    );
};

export default ExclusiveCard;