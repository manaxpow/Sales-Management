public interface IOrderService {
    Task<ApiResponse<IEnumerable<OrderResponse>>> GetAll(int? customerId, int? userId, int? status, DateTime? dateFrom, DateTime? dateTo);
    Task<ApiResponse<OrderResponse>> GetById(int id);
    Task<ApiResponse<OrderResponse>> Create(OrderRequest request);
    Task<ApiResponse<OrderResponse>> Update(int id, OrderRequest request);
    Task<ApiResponse<string>> Delete(int id);
}
