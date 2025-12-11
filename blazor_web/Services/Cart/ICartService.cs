using blazor_web.Models;
using System.Threading.Tasks;
using blazor_web.DTOs.CartItem.Response;

namespace blazor_web.Services.Cart {
    public interface ICartService {
        Task<bool> AddItemAsync(blazor_web.Models.Product product, int quantity = 1);
        Task<bool> RemoveItemAsync(int cartItemId);
        Task<bool> UpdateQuantityAsync(int productId, int quantity);
        Task ClearCartAsync();
        Task<List<CartItemResponse>> GetCartAsync();
    }
}
