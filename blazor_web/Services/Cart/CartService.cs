using System.Text.Json;
using blazor_web.Models;
using blazor_web.Services.Storage;

namespace blazor_web.Services.Cart
{
    public class CartService : ICartService
    {
        private readonly ILocalStorageService _localStorage;
        private const string CART_KEY = "cartData";

        public CartService(ILocalStorageService localStorage)
        {
            _localStorage = localStorage;
        }

        public async Task<List<CartItem>> GetCartAsync()
        {
            var json = await _localStorage.GetItemAsync(CART_KEY);
            if (string.IsNullOrEmpty(json))
                return new List<CartItem>();

            try
            {
                return JsonSerializer.Deserialize<List<CartItem>>(json,
                           new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                       ?? new List<CartItem>();
            }
            catch
            {
                return new List<CartItem>();
            }
        }

        private async Task SaveCartAsync(List<CartItem> items)
        {
            var json = JsonSerializer.Serialize(items);
            await _localStorage.SetItemAsync(CART_KEY, json);
        }

        public async Task AddItemAsync(blazor_web.Models.Product product, int quantity = 1)
        {
            var cart = await GetCartAsync();
            var existing = cart.FirstOrDefault(x => x.Product.ProductId == product.ProductId);

            if (existing == null)
            {
                cart.Add(new CartItem { Product = product, Quantity = quantity });
            }
            else
            {
                existing.Quantity += quantity;
            }

            await SaveCartAsync(cart);
        }

        public async Task UpdateQuantityAsync(int productId, int quantity)
        {
            var cart = await GetCartAsync();
            var item = cart.FirstOrDefault(x => x.Product.ProductId == productId);
            if (item == null) return;

            if (quantity <= 0)
                cart.Remove(item);
            else
                item.Quantity = quantity;

            await SaveCartAsync(cart);
        }

        public async Task RemoveItemAsync(int productId)
        {
            var cart = await GetCartAsync();
            cart.RemoveAll(x => x.Product.ProductId == productId);
            await SaveCartAsync(cart);
        }

        public async Task ClearCartAsync()
        {
            await _localStorage.RemoveItemAsync(CART_KEY);
        }
    }
}
