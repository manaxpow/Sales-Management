public interface ICartService {
    Task<ApiResponse<IEnumerable<CartResponse>>> GetAllByUser(int userId, string? status = null);
    Task<ApiResponse<CartResponse>> GetById(int id);
    Task<ApiResponse<CartResponse>> Create(CartRequest req);
    Task<ApiResponse<CartResponse>> Update(int id, CartRequest req);
    Task<ApiResponse<string>> Delete(int id);
    Task<ApiResponse<CartResponse>> Checkout(int id);
}
