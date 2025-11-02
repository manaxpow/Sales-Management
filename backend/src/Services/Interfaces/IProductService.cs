public interface IProductService {
    Task<ApiResponse<object>> GetAll(
        string? keyword,
        int? categoryId,
        int? supplierId,
        decimal? minPrice,
        decimal? maxPrice,
        int page = 1,
        int pageSize = 10);

    Task<ApiResponse<Products>> GetById(int id);
    Task<ApiResponse<Products>> Create(Products product);
    Task<ApiResponse<Products>> Update(int id, Products product);
    Task<ApiResponse<string>> Delete(int id);

    Task<ApiResponse<object>> GetBySupplier(
        int supplierId,
        int page = 1,
        int pageSize = 10);
}
