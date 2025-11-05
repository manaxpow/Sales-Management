public interface IProductService
{

    Task<ApiResponse<ProductResponse>> CreateProduct(CreateProductRequest req);
    Task<ApiResponse<GetProductResponse>> GetProduct(GetProductRequest req);
    Task<ApiResponse<ProductResponse>> GetProductById(int id);
    Task<ApiResponse<ProductResponse>> UpdateProduct(UpdateProductRequest req);
    Task<ApiResponse<List<ProductResponse>>> GetProductsBySupplierIdAsync(int supplierId);

}

