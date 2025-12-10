public interface ICartItemService {
    Task<ApiResponse<IEnumerable<CartItemResponse>>> GetAll(int? cartId);
    Task<ApiResponse<CartItemResponse>> GetById(int id);
    Task<ApiResponse<CartItemResponse>> Create(CartItemRequest req);
    Task<ApiResponse<CartItemResponse>> Update(int id, CartItemRequest req);
    Task<ApiResponse<string>> Delete(int id);
}
