using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Text.Json;
using blazor_web.Models;
using blazor_web.Dtos.Orders;
using blazor_web.Services.Storage; // ILocalStorageService

namespace blazor_web.Services.Orders {
    public class OrderService : IOrderService {
        private readonly HttpClient _http;
        private readonly ILocalStorageService _localStorage;

        // BaseAddress = http://localhost:8081/api/
        // => endpoint chỉ cần "orders" là đủ -> http://localhost:8081/api/orders
        private const string CreateWithItemsEndpoint = "orders";

        public OrderService(HttpClient http, ILocalStorageService localStorage) {
            _http = http;
            _localStorage = localStorage;
        }

        // Implement đúng interface
        public async Task<ApiResponse<CreateOrderResponse>> CreateWithItemsAsync(
            CreateOrderWithItemsRequest request) {

            // 1. Lấy token từ localStorage
            var loginInfo = await _localStorage.GetLoginInfoAsync();
            var token = loginInfo?.AccessToken;

            if (string.IsNullOrEmpty(token)) {
                return new ApiResponse<CreateOrderResponse> {
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
            string token) {

            var httpRequest = new HttpRequestMessage(HttpMethod.Post, CreateWithItemsEndpoint);
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            httpRequest.Content = JsonContent.Create(request);

            var response = await _http.SendAsync(httpRequest);

            // 🔍 LOG RAW BODY để debug lỗi JSON
            var raw = await response.Content.ReadAsStringAsync();
            Console.WriteLine(">>> [OrderService] RAW RESPONSE:");
            Console.WriteLine(raw);

            ApiResponse<CreateOrderResponse>? api;

            try {
                api = JsonSerializer.Deserialize<ApiResponse<CreateOrderResponse>>(
                    raw,
                    new JsonSerializerOptions {
                        PropertyNameCaseInsensitive = true
                    });
            } catch (Exception ex) {
                Console.WriteLine("[OrderService] JSON parse error: " + ex.Message);
                return new ApiResponse<CreateOrderResponse> {
                    Success = false,
                    Message = "Invalid JSON from server: " + ex.Message,
                    Data = default!
                };
            }

            if (api == null) {
                return new ApiResponse<CreateOrderResponse> {
                    Success = false,
                    Message = "Empty response from server",
                    Data = default!
                };
            }

            // Nếu HTTP code lỗi nhưng api.Success = true thì ép về false cho chắc
            if (!response.IsSuccessStatusCode && api.Success) {
                api.Success = false;
                if (string.IsNullOrWhiteSpace(api.Message)) {
                    api.Message = $"HTTP {(int)response.StatusCode} Error";
                }
            }

            return api;
        }
    }
}
