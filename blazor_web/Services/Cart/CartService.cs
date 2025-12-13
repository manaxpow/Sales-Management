using blazor_web.DTOs.Cart.Request;
using blazor_web.DTOs.Cart.Response; // nếu bạn có CartResponse classes ở đây
using blazor_web.DTOs.CartItem.Request;
using blazor_web.DTOs.CartItem.Response;
using blazor_web.Models;
using blazor_web.Services.Storage;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace blazor_web.Services.Cart {
    public class CartService : ICartService {
        private readonly HttpClient _http;
        private readonly ILocalStorageService _localStorage;

        public CartService(HttpClient http, ILocalStorageService localStorage) {
            _http = http;
            _localStorage = localStorage;
        }

        // Helper: get or create active cart for current user
        private async Task<int?> GetOrCreateActiveCartIdAsync() {
            var loginInfo = await _localStorage.GetLoginInfoAsync();
            if (loginInfo?.User == null)
                return null;

            var userId = loginInfo.User.Id;

            try {
                var resp = await _http.GetFromJsonAsync<ApiResponse<List<CartResponse>>>($"carts/user/{userId}?status=active");
                if (resp != null && resp.Success && resp.Data != null && resp.Data.Any()) {
                    return resp.Data.First().CartId;
                }

                // create new cart
                var createReq = new CartCreateRequest {
                    UserId = userId,
                    CustomerId = loginInfo.Customer?.Id,
                    Status = "active",
                    ShippingAmount = 0m,
                    TaxAmount = 0m
                };

                var createResp = await _http.PostAsJsonAsync("carts", createReq);
                if (createResp.IsSuccessStatusCode) {
                    var wrapper = await createResp.Content.ReadFromJsonAsync<ApiResponse<CartResponse>>();
                    if (wrapper != null && wrapper.Success && wrapper.Data != null)
                        return wrapper.Data.CartId;
                }
            } catch (Exception ex) {
                Console.WriteLine($"[CartApiService] GetOrCreateActiveCartIdAsync error: {ex}");
            }

            return null;
        }

        public async Task<bool> AddItemAsync(blazor_web.Models.Product product, int quantity = 1) {
            try {
                var cartId = await GetOrCreateActiveCartIdAsync();
                if (cartId == null) {
                    Console.WriteLine("[CartApiService] No active cart (user not logged in?)");
                    return false;
                }

                // 1) Lấy danh sách cart-items hiện tại cho cart
                var itemsResp = await _http.GetFromJsonAsync<ApiResponse<List<CartItemResponse>>>($"cart-items?cartId={cartId}");
                if (itemsResp == null) {
                    Console.WriteLine("[CartApiService] Get cart-items returned null");
                    return false;
                }

                if (itemsResp.Success && itemsResp.Data != null) {
                    // tìm item cùng productId
                    var existing = itemsResp.Data.FirstOrDefault(x => x.ProductId == product.ProductId);

                    if (existing != null) {
                        // item đã tồn tại -> tăng quantity
                        var newQuantity = existing.Quantity + quantity;

                        var updateReq = new CartItemUpdateRequest {
                            ProductId = existing.ProductId,
                            PriceSnapshot = existing.PriceSnapshot,
                            Quantity = newQuantity,
                            Unit = existing.Unit
                        };

                        var putResp = await _http.PutAsJsonAsync($"cart-items/{existing.CartItemId}", updateReq);
                        if (putResp.IsSuccessStatusCode) {
                            var wrap = await putResp.Content.ReadFromJsonAsync<ApiResponse<CartItemResponse>>();
                            if (wrap != null && wrap.Success && wrap.Data != null) {
                                return true;
                            }
                        }

                        var body = await putResp.Content.ReadAsStringAsync();
                        Console.WriteLine($"[CartApiService] Update existing cart-item failed: {body}");
                        return false;
                    }
                }

                // 2) Nếu chưa tồn tại: tạo mới cart item
                var createReq = new CartItemCreateRequest {
                    CartId = cartId.Value,
                    ProductId = product.ProductId,
                    ProductName = product.ProductName,
                    PriceSnapshot = product.Price,
                    Quantity = quantity,
                    Unit = product.Unit
                };

                var postResp = await _http.PostAsJsonAsync("cart-items", createReq);
                if (postResp.IsSuccessStatusCode) {
                    var wrap = await postResp.Content.ReadFromJsonAsync<ApiResponse<CartItemResponse>>();
                    if (wrap != null && wrap.Success && wrap.Data != null) {
                        return true;
                    }
                } else {
                    var body = await postResp.Content.ReadAsStringAsync();
                    Console.WriteLine($"[CartApiService] AddItemAsync failed: {body}");
                }
            } catch (Exception ex) {
                Console.WriteLine($"[CartApiService] AddItemAsync error: {ex}");
            }

            return false;
        }

        public async Task<bool> RemoveItemAsync(int cartItemId) {
            try {
                var resp = await _http.DeleteAsync($"cart-items/{cartItemId}");
                return resp.IsSuccessStatusCode;
            } catch (Exception ex) {
                Console.WriteLine($"[CartApiService] RemoveItemAsync error: {ex}");
                return false;
            }
        }

        public async Task<bool> UpdateQuantityAsync(int productId, int quantity) {
            try {
                // find cartItem id by productId (call GET cart-items?productId=...) — backend may differ.
                // For simplicity assume endpoint PUT /cart-items/by-product/{cartId}/{productId} exists — 
                // otherwise modify to GET list and PUT specific id.
                var loginInfo = await _localStorage.GetLoginInfoAsync();
                if (loginInfo?.User == null) return false;

                var cartId = await GetOrCreateActiveCartIdAsync();
                if (cartId == null) return false;

                // naive approach: GET items for cart and find productId
                var itemsResp = await _http.GetFromJsonAsync<ApiResponse<List<CartItemResponse>>>($"cart-items?cartId={cartId}");
                if (itemsResp != null && itemsResp.Success && itemsResp.Data != null) {
                    var item = itemsResp.Data.FirstOrDefault(x => x.ProductId == productId);
                    if (item != null) {
                        var updateReq = new CartItemUpdateRequest {
                            ProductId = item.ProductId,
                            PriceSnapshot = item.PriceSnapshot,
                            Quantity = quantity,
                            Unit = item.Unit
                        };

                        var put = await _http.PutAsJsonAsync($"cart-items/{item.CartItemId}", updateReq);
                        return put.IsSuccessStatusCode;
                    }
                }
            } catch (Exception ex) {
                Console.WriteLine($"[CartApiService] UpdateQuantityAsync error: {ex}");
            }

            return false;
        }
        public async Task ClearCartAsync() {
            try {
                var cartId = await GetOrCreateActiveCartIdAsync();
                if (cartId == null) return;

                var resp = await _http.DeleteAsync($"carts/{cartId}");
                if (!resp.IsSuccessStatusCode) {
                    Console.WriteLine($"[CartApiService] ClearCart failed: {await resp.Content.ReadAsStringAsync()}");
                }
            } catch (Exception ex) {
                Console.WriteLine($"[CartApiService] ClearCartAsync error: {ex}");
            }
        }

        public async Task<List<CartItemResponse>> GetCartAsync() {
            try {
                var cartId = await GetOrCreateActiveCartIdAsync();
                if (cartId == null) return new List<CartItemResponse>();

                var itemsResp = await _http.GetFromJsonAsync<ApiResponse<List<CartItemResponse>>>($"cart-items?cartId={cartId}");
                if (itemsResp != null && itemsResp.Success && itemsResp.Data != null) {
                    return itemsResp.Data;
                }
            } catch (Exception ex) {
                Console.WriteLine($"[CartApiService] GetCartAsync error: {ex}");
            }

            return new List<CartItemResponse>();
        }
    }
}
