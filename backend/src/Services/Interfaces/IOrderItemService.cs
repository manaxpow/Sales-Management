public interface IOrderItemService {
    Task<ApiResponse<IEnumerable<OrderItemResponse>>> GetAll(int? orderId);
    Task<ApiResponse<OrderItemResponse>> GetById(int id);
    Task<ApiResponse<OrderItemResponse>> Create(OrderItemRequest request);
    Task<ApiResponse<OrderItemResponse>> Update(int id, OrderItemRequest request);
    Task<ApiResponse<string>> Delete(int id);
}
