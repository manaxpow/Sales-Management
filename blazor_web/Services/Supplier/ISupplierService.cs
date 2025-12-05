using blazor_web.DTOs.Supplier;
using blazor_web.Models;
using System.Collections.Generic;

namespace blazor_web.Services.Supplier
{
    public interface ISupplierService
    {
        // Lấy danh sách Nhà cung cấp
        Task<ApiResponse<List<SupplierResponse>>> GetSuppliersAsync();
        
        // Lấy chi tiết Nhà cung cấp theo ID
        Task<ApiResponse<SupplierResponse>> GetSupplierByIdAsync(int id);
        
        // Tạo Nhà cung cấp mới
        Task<ApiResponse<SupplierResponse>> CreateSupplierAsync(CreateSupplierRequest request);
        
        // Cập nhật Nhà cung cấp (sử dụng UpdateSupplierRequest có ID)
        Task<ApiResponse<SupplierResponse>> UpdateSupplierAsync(int id, UpdateSupplierRequest request);
        
        // Xóa Nhà cung cấp
        Task<ApiResponse<bool>> DeleteSupplierAsync(int id);
    }
}