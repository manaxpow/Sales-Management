using blazor_web.Models;

namespace blazor_web.Services.Cart {
    public interface ICartService {
        Task<List<CartItem>> GetCartAsync();
        Task AddItemAsync(Product product, int quantity = 1);
        Task UpdateQuantityAsync(int productId, int quantity);
        Task RemoveItemAsync(int productId);
        Task ClearCartAsync();
    }
}
