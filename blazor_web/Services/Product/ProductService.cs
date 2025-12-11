using blazor_web.Models;
using blazor_web.Services.Storage;
using System.Text.Json;
using System.Web;



public class ProductService : IProductService
{

    private readonly ILogger<PromotionService> _logger;
    private readonly HttpClient _httpClient;
    private readonly ILocalStorageService _localStorage;



    public ProductService(HttpClient http, ILocalStorageService localStorage, ILogger<PromotionService> logger)
    {
        _httpClient = http;
        _localStorage = localStorage;
        _logger = logger;
    }
    public async Task<ApiResponse<ProductResponse>> CreateProduct(MultipartFormDataContent request)
    {
        try
        {
            var response = await _httpClient.PostAsync("products", request);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.ValueKind == JsonValueKind.Array)
                {
                    // API trả về mảng lỗi
                    var errors = JsonSerializer.Deserialize<List<ValidationError>>(content, options)!;

                    return new ApiResponse<ProductResponse>
                    {
                        Success = false,
                        Message = errors.FirstOrDefault()?.message ?? "Validation failed",

                    };
                }
                else if (doc.RootElement.ValueKind == JsonValueKind.Object)
                {
                    // API trả về object
                    var obj = JsonSerializer.Deserialize<ValidationError>(content, options);

                    return new ApiResponse<ProductResponse>
                    {
                        Success = false,
                        Message = obj?.message ?? "Unknown error",

                    };
                }
                else
                {
                    // JSON không hợp lệ
                    return new ApiResponse<ProductResponse>
                    {
                        Success = false,
                        Message = "Invalid JSON returned from server"
                    };
                }
            }
            else
            {
                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<ProductResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return new ApiResponse<ProductResponse>
                {
                    Success = true,
                    Message = "Create promotion success",
                    Data = successfulApiResponse!.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            throw;
        }

    }

    public Task<ApiResponse<ProductResponse>> DeleteProduct(DeleteProductRequest request)
    {
        try
        {
            var form = new MultipartFormDataContent
            {

                { new StringContent(request.ProductId.ToString()), "ProductId" },
                { new StringContent("3"), "Status" }
            };
            var response = _httpClient.PatchAsync("products", form).Result;

            if (response.IsSuccessStatusCode)
            {
                return Task.FromResult(new ApiResponse<ProductResponse>
                {
                    Success = true,
                    Message = "Delete product success",
                });
            }
            else
            {
                return Task.FromResult(new ApiResponse<ProductResponse>
                {
                    Success = false,
                    Message = "Delete product failed",
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product");
            throw;
        }
    }

    public async Task<ApiResponse<GetProductResponse>> GetAllProduct(ProductFilter request)
    {
        try
        {
            string query = QueryBuilder.BuildQuery(request);
            string url = string.IsNullOrEmpty(query) ? "products" : $"products?{query}";
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<GetProductResponse>>(url);
            if (response != null)
            {
                // map data
                return response;
            }
            else
            {

                return new ApiResponse<GetProductResponse>
                {
                    Success = false,
                    Message = "No data",
                };
            }

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching products");
            throw;
        }


    }

    public async Task<ApiResponse<ProductResponse>> GetProductById(int id)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<ProductResponse>>($"products/{id}");
            if (response != null)
            {
                return response;
            }
            else
            {
                return new ApiResponse<ProductResponse>
                {
                    Success = false,
                    Message = "No data",
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching product by id");
            throw;
        }
    }


    public async Task<ApiResponse<List<ProductResponse>>> GetProductsBySupplierIdAsync(int supplierId)
    {
        try
        {
            var fullUrl = $"products/supplier/{supplierId}";
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<ProductResponse>>>(fullUrl);

            return response ?? new ApiResponse<List<ProductResponse>> { Success = false, Message = "Phản hồi API rỗng." };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching products by supplier {supplierId}: {ex.Message}");
            return new ApiResponse<List<ProductResponse>> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
        }
    }

    public async Task<ApiResponse<ProductResponse>> UpdateProduct(MultipartFormDataContent request)
    {
        try
        {
            var response = await _httpClient.PatchAsync("products", request);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.ValueKind == JsonValueKind.Array)
                {
                    // API trả về mảng lỗi
                    var errors = JsonSerializer.Deserialize<List<ValidationError>>(content, options)!;

                    return new ApiResponse<ProductResponse>
                    {
                        Success = false,
                        Message = errors.FirstOrDefault()?.message ?? "Validation failed",

                    };
                }
                else if (doc.RootElement.ValueKind == JsonValueKind.Object)
                {
                    // API trả về object
                    var obj = JsonSerializer.Deserialize<ValidationError>(content, options);

                    return new ApiResponse<ProductResponse>
                    {
                        Success = false,
                        Message = obj?.message ?? "Unknown error",

                    };
                }
                else
                {
                    // JSON không hợp lệ
                    return new ApiResponse<ProductResponse>
                    {
                        Success = false,
                        Message = "Invalid JSON returned from server"
                    };
                }
            }
            else
            {
                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<ProductResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return new ApiResponse<ProductResponse>
                {
                    Success = true,
                    Message = "Update promotion success",
                    Data = successfulApiResponse!.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            throw;
        }

    }

}
