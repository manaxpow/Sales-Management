using blazor_web.DTOs.Product;
using blazor_web.Models;
using System.Collections.Generic;



public interface IProductService
{
    Task<ApiResponse<GetProductResponse>> GetAllProduct(ProductFilter request);
    Task<ApiResponse<ProductResponse>> GetProductById(GetProductByIdRes id);
    Task<ApiResponse<ProductResponse>> CreateProduct(MultipartFormDataContent request);
    Task<ApiResponse<ProductResponse>> UpdateProduct(MultipartFormDataContent request);

    Task<ApiResponse<ProductResponse>> DeleteProduct(DeleteProductRequest request);
    Task<ApiResponse<List<ProductResponse>>> GetProductsBySupplierIdAsync(int supplierId);

}

