using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Text.Json;
using blazor_web.Models;
using blazor_web.Dtos.Orders;
using blazor_web.Services.Storage;
using blazor_web.DTOs.Orders; // ILocalStorageService

namespace blazor_web.Services.Orders
{
    public class OrderService : IOrderService
    {
        private readonly HttpClient _http;
        private readonly ILocalStorageService _localStorage;

        // BaseAddress = http://localhost:8081/api/
        // => endpoint chỉ cần "orders" là đủ -> http://localhost:8081/api/orders
        private const string CreateWithItemsEndpoint = "orders";

        public OrderService(HttpClient http, ILocalStorageService localStorage)
        {
            _http = http;
            _localStorage = localStorage;
        }

        // Implement đúng interface
        public async Task<ApiResponse<CreateOrderResponse>> CreateWithItemsAsync(
            CreateOrderWithItemsRequest request)
        {

            // 1. Lấy token từ localStorage
            var loginInfo = await _localStorage.GetLoginInfoAsync();
            var token = loginInfo?.AccessToken;

            if (string.IsNullOrEmpty(token))
            {
                return new ApiResponse<CreateOrderResponse>
                {
                    Success = false,
                    Message = "Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thanh toán.",
                    Data = default!
                };
            }

            // 2. Gọi hàm nội bộ có token
            return await CreateOrderWithItemsInternalAsync(request, token);
        }

        // Hàm nội bộ gọi API
        private async Task<ApiResponse<CreateOrderResponse>> CreateOrderWithItemsInternalAsync(
            CreateOrderWithItemsRequest request,
            string token)
        {

            var httpRequest = new HttpRequestMessage(HttpMethod.Post, CreateWithItemsEndpoint + "/with-items");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            httpRequest.Content = JsonContent.Create(request);

            var response = await _http.SendAsync(httpRequest);

            // 🔍 LOG RAW BODY để debug lỗi JSON
            var raw = await response.Content.ReadAsStringAsync();
            Console.WriteLine(">>> [OrderService] RAW RESPONSE:");
            Console.WriteLine(raw);

            ApiResponse<CreateOrderResponse>? api;

            try
            {
                api = JsonSerializer.Deserialize<ApiResponse<CreateOrderResponse>>(
                    raw,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine("[OrderService] JSON parse error: " + ex.Message);
                return new ApiResponse<CreateOrderResponse>
                {
                    Success = false,
                    Message = "Invalid JSON from server: " + ex.Message,
                    Data = default!
                };
            }

            if (api == null)
            {
                return new ApiResponse<CreateOrderResponse>
                {
                    Success = false,
                    Message = "Empty response from server",
                    Data = default!
                };
            }

            // Nếu HTTP code lỗi nhưng api.Success = true thì ép về false cho chắc
            if (!response.IsSuccessStatusCode && api.Success)
            {
                api.Success = false;
                if (string.IsNullOrWhiteSpace(api.Message))
                {
                    api.Message = $"HTTP {(int)response.StatusCode} Error";
                }
            }

            return api;
        }

        public async Task<ApiResponse<IEnumerable<OrderResponse>>> GetAllAsync(
        int? customerId = null,
        int? userId = null,
        int? status = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null)
        {
            // 1. Lấy token
            var loginInfo = await _localStorage.GetLoginInfoAsync();
            var token = loginInfo?.AccessToken;

            if (string.IsNullOrEmpty(token))
            {
                return new ApiResponse<IEnumerable<OrderResponse>>
                {
                    Success = false,
                    Message = "Chưa đăng nhập",
                    Data = Enumerable.Empty<OrderResponse>()
                };
            }

            // 2. Tạo query string
            var queryParams = new Dictionary<string, string>();

            if (customerId.HasValue) queryParams["customerId"] = customerId.Value.ToString();
            if (userId.HasValue) queryParams["userId"] = userId.Value.ToString();
            if (status.HasValue) queryParams["status"] = status.Value.ToString();
            if (dateFrom.HasValue) queryParams["dateFrom"] = dateFrom.Value.ToString("yyyy-MM-dd");
            if (dateTo.HasValue) queryParams["dateTo"] = dateTo.Value.ToString("yyyy-MM-dd");

            var queryString = string.Join("&", queryParams.Select(kv => $"{kv.Key}={Uri.EscapeDataString(kv.Value)}"));
            var endpoint = string.IsNullOrEmpty(queryString) ? "orders" : $"orders?{queryString}";

            // 3. Gọi API
            var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            try
            {
                var response = await _http.SendAsync(request);

                var raw = await response.Content.ReadAsStringAsync();
             

                if (!response.IsSuccessStatusCode)
                {
                    return new ApiResponse<IEnumerable<OrderResponse>>
                    {
                        Success = false,
                        Message = $"Lỗi server: {(int)response.StatusCode} {response.ReasonPhrase}",
                        Data = Enumerable.Empty<OrderResponse>()
                    };
                }

                var apiResponse = JsonSerializer.Deserialize<ApiResponse<IEnumerable<OrderResponse>>>(
                    raw,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (apiResponse == null)
                {
                    return new ApiResponse<IEnumerable<OrderResponse>>
                    {
                        Success = false,
                        Message = "Dữ liệu trả về không hợp lệ",
                        Data = Enumerable.Empty<OrderResponse>()
                    };
                }

                return apiResponse;
            }
            catch (Exception ex)
            {
                Console.WriteLine("[OrderService] GetAll error: " + ex.Message);
                return new ApiResponse<IEnumerable<OrderResponse>>
                {
                    Success = false,
                    Message = "Lỗi kết nối: " + ex.Message,
                    Data = Enumerable.Empty<OrderResponse>()
                };
            }
        }

        public async Task<ApiResponse<IEnumerable<OrderItemResponse>>> GetOrderItemsAsync(int id)
        {
            try
            {
                var fullUrl = $"orderitems?orderId={id}";

                var response = await _http.GetFromJsonAsync<ApiResponse<IEnumerable<OrderItemResponse>>>(fullUrl);

                return response ?? new ApiResponse<IEnumerable<OrderItemResponse>>
                {
                    Success = false,
                    Message = "Phản hồi API rỗng."
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching order items for order {id}: {ex.Message}");
                return new ApiResponse<IEnumerable<OrderItemResponse>>
                {
                    Success = false,
                    Message = $"Lỗi kết nối: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<OrderResponse>> UpdateOrderAsync(int id, OrderRequest request)
        {
            try
            {
                var fullUrl = $"orders/{id}";

                // Gửi PUT request, body là JSON của request
                var httpResponse = await _http.PutAsJsonAsync(fullUrl, request);

                // Đọc kết quả
                var result = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<OrderResponse>>(
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                return result ?? new ApiResponse<OrderResponse>
                {
                    Success = false,
                    Message = "Phản hồi API rỗng hoặc không đúng định dạng."
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[OrderService] Update order {id} error: {ex.Message}");
                return new ApiResponse<OrderResponse>
                {
                    Success = false,
                    Message = "Lỗi kết nối hoặc server"
                };
            }
        }

        public async Task<ApiResponse<string>> DeleteOrderAsync(int id)
        {
            try
            {
                var fullUrl = $"orders/{id}";

                // Gửi PUT request, body là JSON của request
                var httpResponse = await _http.DeleteFromJsonAsync<ApiResponse<string>>(fullUrl);

                return httpResponse ?? new ApiResponse<string>
                {
                    Success = false,
                    Message = "Phản hồi API rỗng hoặc không đúng định dạng."
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[OrderService] Update order {id} error: {ex.Message}");
                return new ApiResponse<string>
                {
                    Success = false,
                    Message = "Lỗi kết nối hoặc server"
                };
            }
        }
    }


}
