using blazor_web.DTOs.Product;
using blazor_web.Models;
using System.Collections.Generic;

namespace blazor_web.Services.Product
{
    public interface IProductService
    {
        // 1. Tạo sản phẩm (createProductService)
        Task<ApiResponse<ProductResponse>> CreateProductAsync(CreateProductRequest request);

        // 2. Lấy danh sách sản phẩm có phân trang/lọc (GetProductsService)
        Task<ApiResponse<GetProductResponse>> GetProductsAsync(ProductFilter filter);

        // 3. Cập nhật sản phẩm (UpdateProductService)
        Task<ApiResponse<ProductResponse>> UpdateProductAsync(UpdateProductRequest request);

        // 4. Xóa sản phẩm (DeleteProductService - soft delete qua Status)
        Task<ApiResponse<ProductResponse>> DeleteProductAsync(DeleteProductRequest request);

        // 5. Lấy sản phẩm theo ID nhà cung cấp (getProductsBySupplierIdService)
        Task<ApiResponse<List<ProductResponse>>> GetProductsBySupplierIdAsync(int supplierId);

        // 6. Lấy sản phẩm theo Product ID (GetProductByIdService)
        Task<ApiResponse<ProductResponse>> GetProductByIdAsync(int id);
    }
}