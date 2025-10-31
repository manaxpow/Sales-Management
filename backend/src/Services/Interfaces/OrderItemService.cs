public interface IOrderItemService {
    Task<ApiResponse<IEnumerable<OrderItem>>> GetAll(int? orderId);
    Task<ApiResponse<OrderItem>> GetById(int id);
    Task<ApiResponse<OrderItem>> Create(OrderItem newItem);
    Task<ApiResponse<OrderItem>> Update(int id, OrderItem updatedItem);
    Task<ApiResponse<string>> Delete(int id);
}
