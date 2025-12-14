using System.Text.Json;
using blazor_web.DTOs.History;
using blazor_web.Models;

namespace blazor_web.Services.History
{
    public class HistoryService : IHistoryService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<HistoryService> _logger;

        public HistoryService(
            HttpClient httpClient,
            ILogger<HistoryService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<ApiResponse<PagedHistoryResponse>> GetOrderHistoryAsync(GetHistoryRequest request)
        {
            try
            {
                Console.WriteLine($"=== HistoryService.GetOrderHistoryAsync called ===");
                Console.WriteLine($"HttpClient BaseAddress: {_httpClient.BaseAddress}");
                Console.WriteLine($"Request: UserId={request.UserId}, Page={request.Page}, PageSize={request.PageSize}, Status={request.Status}, DateFrom={request.DateFrom}, DateTo={request.DateTo}");

                // Build query parameters
                var queryParams = new List<string>();
                
                queryParams.Add($"userId={request.UserId}");
                
                if (request.Page > 0)
                    queryParams.Add($"page={request.Page}");
                
                if (request.PageSize > 0)
                    queryParams.Add($"pageSize={request.PageSize}");
                
                if (request.Status.HasValue)
                    queryParams.Add($"status={request.Status.Value}");
                
                if (request.DateFrom.HasValue)
                    queryParams.Add($"dateFrom={request.DateFrom.Value:yyyy-MM-dd}");
                
                if (request.DateTo.HasValue)
                    queryParams.Add($"dateTo={request.DateTo.Value:yyyy-MM-dd}");

                var queryString = $"?{string.Join("&", queryParams)}";
                Console.WriteLine($"Making GET request to: history{queryString}");

                var response = await _httpClient.GetAsync($"history{queryString}");
                Console.WriteLine($"Response status code: {response.StatusCode}");

                // Handle API response
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Get order history API failed with status {response.StatusCode}: {errorContent}");

                    try
                    {
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var apiErrorResponse = JsonSerializer.Deserialize<ApiResponse<PagedHistoryResponse>>(errorContent, options);

                        return new ApiResponse<PagedHistoryResponse>
                        {
                            Success = false,
                            Message = apiErrorResponse?.Message ?? $"Failed to get order history (HTTP {response.StatusCode})."
                        };
                    }
                    catch (JsonException ex)
                    {
                        Console.WriteLine($"JsonException: {ex.Message}");
                        return new ApiResponse<PagedHistoryResponse>
                        {
                            Success = false,
                            Message = $"Failed to get order history. Server returned an unexpected error (HTTP {response.StatusCode}). Details: {ex.Message}"
                        };
                    }
                }

                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<PagedHistoryResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (successfulApiResponse == null || !successfulApiResponse.Success || successfulApiResponse.Data == null)
                {
                    return new ApiResponse<PagedHistoryResponse>
                    {
                        Success = false,
                        Message = successfulApiResponse?.Message ?? "Get order history failed: API returned success status but missing data."
                    };
                }

                Console.WriteLine($"Get order history successful. Total count: {successfulApiResponse.Data.TotalCount}, Orders: {successfulApiResponse.Data.Data.Count()}");

                return successfulApiResponse;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"HttpRequestException: {ex.Message}");
                _logger.LogError($"Get order history API error: {ex.Message}");

                return new ApiResponse<PagedHistoryResponse>
                {
                    Success = false,
                    Message = $"Network error: {ex.Message}. Please check if API server is running at {_httpClient.BaseAddress}"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                _logger.LogError($"Unexpected error in GetOrderHistoryAsync: {ex.Message}");

                return new ApiResponse<PagedHistoryResponse>
                {
                    Success = false,
                    Message = $"An unexpected error occurred: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<GetHistoryDetailResponse>> GetOrderHistoryDetailAsync(GetHistoryDetailRequest request)
        {
            try
            {
                Console.WriteLine($"=== HistoryService.GetOrderHistoryDetailAsync called ===");
                Console.WriteLine($"HttpClient BaseAddress: {_httpClient.BaseAddress}");
                Console.WriteLine($"Request: UserId={request.UserId}, OrderId={request.OrderId}");

                // Build query parameters
                var queryParams = new List<string>();
                queryParams.Add($"userId={request.UserId}");
                queryParams.Add($"orderId={request.OrderId}");

                var queryString = $"?{string.Join("&", queryParams)}";
                Console.WriteLine($"Making GET request to: history/{request.OrderId}{queryString}");

                var response = await _httpClient.GetAsync($"history/{request.OrderId}{queryString}");
                Console.WriteLine($"Response status code: {response.StatusCode}");

                // Handle API response
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Get order history detail API failed with status {response.StatusCode}: {errorContent}");

                    try
                    {
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var apiErrorResponse = JsonSerializer.Deserialize<ApiResponse<GetHistoryDetailResponse>>(errorContent, options);

                        return new ApiResponse<GetHistoryDetailResponse>
                        {
                            Success = false,
                            Message = apiErrorResponse?.Message ?? $"Failed to get order history detail (HTTP {response.StatusCode})."
                        };
                    }
                    catch (JsonException ex)
                    {
                        Console.WriteLine($"JsonException: {ex.Message}");
                        return new ApiResponse<GetHistoryDetailResponse>
                        {
                            Success = false,
                            Message = $"Failed to get order history detail. Server returned an unexpected error (HTTP {response.StatusCode}). Details: {ex.Message}"
                        };
                    }
                }

                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<GetHistoryDetailResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (successfulApiResponse == null || !successfulApiResponse.Success || successfulApiResponse.Data == null)
                {
                    return new ApiResponse<GetHistoryDetailResponse>
                    {
                        Success = false,
                        Message = successfulApiResponse?.Message ?? "Get order history detail failed: API returned success status but missing data."
                    };
                }

                Console.WriteLine($"Get order history detail successful for Order ID: {successfulApiResponse.Data.Id}, Items: {successfulApiResponse.Data.Items.Count}");

                return successfulApiResponse;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"HttpRequestException: {ex.Message}");
                _logger.LogError($"Get order history detail API error: {ex.Message}");

                return new ApiResponse<GetHistoryDetailResponse>
                {
                    Success = false,
                    Message = $"Network error: {ex.Message}. Please check if API server is running at {_httpClient.BaseAddress}"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                _logger.LogError($"Unexpected error in GetOrderHistoryDetailAsync: {ex.Message}");

                return new ApiResponse<GetHistoryDetailResponse>
                {
                    Success = false,
                    Message = $"An unexpected error occurred: {ex.Message}"
                };
            }
        }
    }
}
