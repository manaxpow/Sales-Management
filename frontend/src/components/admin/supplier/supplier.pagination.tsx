import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SupplierPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const SupplierPagination: React.FC<SupplierPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-6 pt-4 pb-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-1 border rounded-md text-sm transition-all duration-150 ${currentPage === i + 1
                        ? "bg-blue-200"
                        : "hover:bg-gray-100"
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
        </div>
    );
};

export default SupplierPagination;
