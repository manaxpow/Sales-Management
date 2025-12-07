using System.Text.Json;
using blazor_web.DTOs.Inventory;
using blazor_web.Models;

namespace blazor_web.Services.Inventory
{
    public class InventoryService : IInventoryService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<InventoryService> _logger;

        public InventoryService(
            HttpClient httpClient,
            ILogger<InventoryService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<ApiResponse<GetInventoryResponse>> GetInventoryAsync(GetInventoryRequest request)
        {
            try
            {
                Console.WriteLine($"=== InventoryService.GetInventoryAsync called ===");
                Console.WriteLine($"HttpClient BaseAddress: {_httpClient.BaseAddress}");
                Console.WriteLine($"Request: Page={request.Page}, PageSize={request.PageSize}, Search={request.Search}, Status={request.Status}");

                // Build query parameters
                var queryParams = new List<string>();
                
                if (request.Page > 0)
                    queryParams.Add($"page={request.Page}");
                
                if (request.PageSize > 0)
                    queryParams.Add($"pageSize={request.PageSize}");
                
                if (!string.IsNullOrEmpty(request.Search))
                    queryParams.Add($"search={Uri.EscapeDataString(request.Search)}");
                
                if (!string.IsNullOrEmpty(request.Status))
                    queryParams.Add($"status={Uri.EscapeDataString(request.Status)}");

                var queryString = queryParams.Any() ? $"?{string.Join("&", queryParams)}" : "";
                Console.WriteLine($"Making GET request to: inventory{queryString}");

                var response = await _httpClient.GetAsync($"inventory{queryString}");
                Console.WriteLine($"Response status code: {response.StatusCode}");

                // Handle API response
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Get inventory API failed with status {response.StatusCode}: {errorContent}");

                    try
                    {
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var apiErrorResponse = JsonSerializer.Deserialize<ApiResponse<GetInventoryResponse>>(errorContent, options);

                        return new ApiResponse<GetInventoryResponse>
                        {
                            Success = false,
                            Message = apiErrorResponse?.Message ?? $"Failed to get inventory (HTTP {response.StatusCode})."
                        };
                    }
                    catch (JsonException ex)
                    {
                        Console.WriteLine($"JsonException: {ex.Message}");
                        return new ApiResponse<GetInventoryResponse>
                        {
                            Success = false,
                            Message = $"Failed to get inventory. Server returned an unexpected error (HTTP {response.StatusCode}). Details: {ex.Message}"
                        };
                    }
                }

                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<GetInventoryResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (successfulApiResponse == null || !successfulApiResponse.Success || successfulApiResponse.Data == null)
                {
                    return new ApiResponse<GetInventoryResponse>
                    {
                        Success = false,
                        Message = successfulApiResponse?.Message ?? "Get inventory failed: API returned success status but missing data."
                    };
                }

                Console.WriteLine($"Get inventory successful. Total count: {successfulApiResponse.Data.TotalCount}, Products: {successfulApiResponse.Data.Products.Count}");

                return successfulApiResponse;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"HttpRequestException: {ex.Message}");
                _logger.LogError($"Get inventory API error: {ex.Message}");

                return new ApiResponse<GetInventoryResponse>
                {
                    Success = false,
                    Message = $"Network error: {ex.Message}. Please check if API server is running at {_httpClient.BaseAddress}"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                _logger.LogError($"Unexpected error in GetInventoryAsync: {ex.Message}");

                return new ApiResponse<GetInventoryResponse>
                {
                    Success = false,
                    Message = $"An unexpected error occurred: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<UpdateQuantityResponse>> UpdateQuantityAsync(int id, UpdateQuantityRequest request)
        {
            try
            {
                Console.WriteLine($"=== InventoryService.UpdateQuantityAsync called ===");
                Console.WriteLine($"HttpClient BaseAddress: {_httpClient.BaseAddress}");
                Console.WriteLine($"Updating inventory ID: {id}, New Quantity: {request.Quantity}");

                var jsonContent = JsonContent.Create(request);
                Console.WriteLine($"Making PUT request to: inventory/{id}");

                var response = await _httpClient.PutAsync($"inventory/{id}", jsonContent);
                Console.WriteLine($"Response status code: {response.StatusCode}");

                // Handle API response
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Update inventory API failed with status {response.StatusCode}: {errorContent}");

                    try
                    {
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var apiErrorResponse = JsonSerializer.Deserialize<ApiResponse<ProductInventory>>(errorContent, options);

                        return new ApiResponse<UpdateQuantityResponse>
                        {
                            Success = false,
                            Message = apiErrorResponse?.Message ?? $"Failed to update inventory (HTTP {response.StatusCode})."
                        };
                    }
                    catch (JsonException ex)
                    {
                        Console.WriteLine($"JsonException: {ex.Message}");
                        return new ApiResponse<UpdateQuantityResponse>
                        {
                            Success = false,
                            Message = $"Failed to update inventory. Server returned an unexpected error (HTTP {response.StatusCode}). Details: {ex.Message}"
                        };
                    }
                }

                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<UpdateQuantityResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (successfulApiResponse == null || !successfulApiResponse.Success || successfulApiResponse.Data == null)
                {
                    return new ApiResponse<UpdateQuantityResponse>
                    {
                        Success = false,
                        Message = successfulApiResponse?.Message ?? "Update inventory failed: API returned success status but missing data."
                    };
                }

                Console.WriteLine($"Update inventory successful for ID: {successfulApiResponse.Data.Id}");

                return successfulApiResponse;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"HttpRequestException: {ex.Message}");
                _logger.LogError($"Update inventory API error: {ex.Message}");

                return new ApiResponse<UpdateQuantityResponse>
                {
                    Success = false,
                    Message = $"Network error: {ex.Message}. Please check if API server is running at {_httpClient.BaseAddress}"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                _logger.LogError($"Unexpected error in UpdateQuantityAsync: {ex.Message}");

                return new ApiResponse<UpdateQuantityResponse>
                {
                    Success = false,
                    Message = $"An unexpected error occurred: {ex.Message}"
                };
            }
        }
    }
}
