using blazor_web.DTOs.Product;
using blazor_web.Models;
using System.Net.Http.Json;
using System.Web; 

namespace blazor_web.Services.Product
{
    // Lớp triển khai IProductService, chịu trách nhiệm gọi API liên quan đến Sản phẩm
    public class ProductService : IProductService
    {
        private readonly HttpClient _httpClient;
        private const string URL_API = "products"; 

        public ProductService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // --- 1. Tạo sản phẩm ---
        public async Task<ApiResponse<ProductResponse>> CreateProductAsync(CreateProductRequest request)
        {
            try
            {
                // POST: /products, Body: CreateProductRequest (JSON)
                var httpResponse = await _httpClient.PostAsJsonAsync(URL_API, request);
                
                if (httpResponse.IsSuccessStatusCode)
                {
                    // Backend trả về 201 Created
                    var successContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<ProductResponse>>();
                    return successContent ?? new ApiResponse<ProductResponse> { Success = false, Message = "Tạo thành công nhưng dữ liệu trả về rỗng." };
                }
                
                // Xử lý lỗi (400 Bad Request, 500 Internal Server Error,...)
                var errorContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<ProductResponse>>();
                return errorContent ?? new ApiResponse<ProductResponse> { Success = false, Message = $"Tạo sản phẩm thất bại. (HTTP {httpResponse.StatusCode})" };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating product: {ex.Message}");
                return new ApiResponse<ProductResponse> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- 2. Lấy danh sách sản phẩm có lọc/phân trang ---
        public async Task<ApiResponse<GetProductResponse>> GetProductsAsync(ProductFilter filter)
        {
            try
            {
                // Xây dựng Query String từ ProductFilter
                var queryBuilder = HttpUtility.ParseQueryString(string.Empty);
                
                // Map các trường lọc vào Query String
                if (filter.SupplierId.HasValue) queryBuilder["SupplierId"] = filter.SupplierId.ToString();
                if (filter.CategoryId.HasValue) queryBuilder["CategoryId"] = filter.CategoryId.ToString();
                if (!string.IsNullOrEmpty(filter.ProductName)) queryBuilder["ProductName"] = filter.ProductName;
                if (filter.Price.HasValue) queryBuilder["Price"] = filter.Price.ToString();
                if (filter.Page.HasValue) queryBuilder["Page"] = filter.Page.ToString();
                if (filter.Limit.HasValue) queryBuilder["Limit"] = filter.Limit.ToString();
                if (filter.Status.HasValue) queryBuilder["Status"] = filter.Status.ToString();

                // Logic SortBy/SortOrder từ React Service
                queryBuilder["SortBy"] = filter.SortBy ?? "CreatedAt";
                queryBuilder["SortOrder"] = filter.SortOrder ?? "asc";

                var queryString = queryBuilder.ToString();
                var fullUrl = string.IsNullOrEmpty(queryString) ? URL_API : $"{URL_API}?{queryString}";

                // GET: /products?SupplierId=...
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<GetProductResponse>>(fullUrl);
                
                return response ?? new ApiResponse<GetProductResponse> { Success = false, Message = "Phản hồi API rỗng hoặc không hợp lệ." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching products: {ex.Message}");
                return new ApiResponse<GetProductResponse> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- 3. Cập nhật sản phẩm ---
        public async Task<ApiResponse<ProductResponse>> UpdateProductAsync(UpdateProductRequest request)
        {
            try
            {
                // PATCH: /products, Body: UpdateProductRequest (JSON)
                var httpResponse = await _httpClient.PatchAsJsonAsync(URL_API, request);

                if (httpResponse.IsSuccessStatusCode)
                {
                    var successContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<ProductResponse>>();
                    return successContent ?? new ApiResponse<ProductResponse> { Success = false, Message = "Cập nhật thành công nhưng dữ liệu trả về rỗng." };
                }

                var errorContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<ProductResponse>>();
                return errorContent ?? new ApiResponse<ProductResponse> { Success = false, Message = $"Cập nhật sản phẩm thất bại. (HTTP {httpResponse.StatusCode})" };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating product {request.ProductId}: {ex.Message}");
                return new ApiResponse<ProductResponse> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- 4. Xóa sản phẩm (Soft Delete) ---
        public async Task<ApiResponse<ProductResponse>> DeleteProductAsync(DeleteProductRequest request)
        {
            try
            {
                // Xóa được thực hiện bằng cách PATCH Status = 3
                // PATCH: /products, Body: DeleteProductRequest (JSON)
                var httpResponse = await _httpClient.PatchAsJsonAsync(URL_API, request);

                if (httpResponse.IsSuccessStatusCode)
                {
                    var successContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<ProductResponse>>();
                    return successContent ?? new ApiResponse<ProductResponse> { Success = false, Message = "Xóa (soft delete) thành công." };
                }

                var errorContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<ProductResponse>>();
                return errorContent ?? new ApiResponse<ProductResponse> { Success = false, Message = $"Xóa sản phẩm thất bại. (HTTP {httpResponse.StatusCode})" };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting product {request.ProductId}: {ex.Message}");
                return new ApiResponse<ProductResponse> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- 5. Lấy sản phẩm theo ID nhà cung cấp ---
        public async Task<ApiResponse<List<ProductResponse>>> GetProductsBySupplierIdAsync(int supplierId)
        {
            try
            {
                // API: GET /products/supplier/{supplierId}
                var fullUrl = $"{URL_API}/supplier/{supplierId}";
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<ProductResponse>>>(fullUrl);
                
                return response ?? new ApiResponse<List<ProductResponse>> { Success = false, Message = "Phản hồi API rỗng." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching products by supplier {supplierId}: {ex.Message}");
                return new ApiResponse<List<ProductResponse>> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- 6. Lấy sản phẩm theo Product ID ---
        public async Task<ApiResponse<ProductResponse>> GetProductByIdAsync(int id)
        {
            try
            {
                // API: GET /products/{id}
                var fullUrl = $"{URL_API}/{id}";
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<ProductResponse>>(fullUrl);
                
                return response ?? new ApiResponse<ProductResponse> { Success = false, Message = "Phản hồi API rỗng." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching product by ID {id}: {ex.Message}");
                return new ApiResponse<ProductResponse> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }
    }
}