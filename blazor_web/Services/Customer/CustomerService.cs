using System.Net.Http.Json;
using System.Text.Json;
using blazor_web.DTOs.Customer;
using blazor_web.Models;

namespace blazor_web.Services.Customer
{
    public class CustomerService : ICustomerService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<CustomerService> _logger;

        public CustomerService(HttpClient httpClient, ILogger<CustomerService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        // 1. GET /customers (MapGet "/")
        public async Task<ApiResponse<GetCustomerResponse>> GetCustomerAsync(GetCustomerRequest request)
        {
            try
            {
                var queryParams = new List<string>();

                if (request.Page.HasValue) queryParams.Add($"page={request.Page}");
                if (request.Limit.HasValue) queryParams.Add($"limit={request.Limit}");
                if (!string.IsNullOrEmpty(request.Search)) queryParams.Add($"search={Uri.EscapeDataString(request.Search)}");

                var queryString = queryParams.Any() ? $"?{string.Join("&", queryParams)}" : "";
                var url = $"customers{queryString}";
                Console.WriteLine($"Making GET request to: {url}");

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<GetCustomerResponse>(response, "Get customer list");
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<GetCustomerResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<GetCustomerResponse> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in GetCustomerAsync: {ex.Message}");
                return new ApiResponse<GetCustomerResponse> { Success = false, Message = ex.Message };
            }
        }

        // 2. POST /customers (MapPost "/")
        public async Task<ApiResponse<CustomerResponse>> CreateCustomerAsync(CreateCustomerRequest request)
        {
            try
            {
                Console.WriteLine($"Making POST request to: customers");

                using var content = new MultipartFormDataContent();
                content.Add(new StringContent(request.Name), nameof(request.Name));
                content.Add(new StringContent(request.Phone), nameof(request.Phone));
                content.Add(new StringContent(request.Email), nameof(request.Email));
                content.Add(new StringContent(request.Address), nameof(request.Address));

                var response = await _httpClient.PostAsync("customers", content);

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<CustomerResponse>(response, "Create customer");
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<CustomerResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<CustomerResponse> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in CreateCustomerAsync: {ex.Message}");
                return new ApiResponse<CustomerResponse> { Success = false, Message = ex.Message };
            }
        }

        // 3. PUT /customers/{id} (MapPut "/{id}")
        public async Task<ApiResponse<CustomerResponse>> UpdateCustomerAsync(int id, UpdateCustomerRequest request)
        {
            try
            {
                Console.WriteLine($"Making PUT request to: customers/{id}");


                using var content = new MultipartFormDataContent();
                content.Add(new StringContent(request.Name), nameof(request.Name));
                content.Add(new StringContent(request.Phone), nameof(request.Phone));
                content.Add(new StringContent(request.Email), nameof(request.Email));
                content.Add(new StringContent(request.Address), nameof(request.Address));

                var response = await _httpClient.PutAsync($"customers/{id}", content);

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<CustomerResponse>(response, "Update customer");
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<CustomerResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<CustomerResponse> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in UpdateCustomerAsync: {ex.Message}");
                return new ApiResponse<CustomerResponse> { Success = false, Message = ex.Message };
            }
        }

        // 4. DELETE /customers/{id} (MapDelete "/{id}")
        public async Task<ApiResponse<string>> DeleteCustomerAsync(int id)
        {
            try
            {
                Console.WriteLine($"Making DELETE request to: customers/{id}");

                var response = await _httpClient.DeleteAsync($"customers/{id}");

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<string>(response, "Delete customer");
                }
                var result = await response.Content.ReadFromJsonAsync<ApiResponse<string>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<string> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in DeleteCustomerAsync: {ex.Message}");
                return new ApiResponse<string> { Success = false, Message = ex.Message };
            }
        }

        private async Task<ApiResponse<T>> HandleErrorResponse<T>(HttpResponseMessage response, string actionName)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError($"{actionName} API failed with status {response.StatusCode}: {errorContent}");

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var apiError = JsonSerializer.Deserialize<ApiResponse<T>>(errorContent, options);

                return new ApiResponse<T>
                {
                    Success = false,
                    Message = apiError?.Message ?? $"{actionName} failed (HTTP {response.StatusCode})"
                };
            }
            catch
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Message = $"{actionName} failed. Server returned: {response.StatusCode}"
                };
            }
        }
    }
}