using blazor_web.Dtos.Orders;
using blazor_web.DTOs.Orders;
using blazor_web.Models;

namespace blazor_web.Services.Orders
{
    public interface IOrderService
    {
        Task<ApiResponse<CreateOrderResponse>> CreateWithItemsAsync(CreateOrderWithItemsRequest request);
        Task<ApiResponse<IEnumerable<OrderResponse>>> GetAllAsync(
        int? customerId = null,
        int? userId = null,
        int? status = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null);
        Task<ApiResponse<IEnumerable<OrderItemResponse>>> GetOrderItemsAsync(int id);
        Task<ApiResponse<OrderResponse>> UpdateOrderAsync(int id, OrderRequest request);
        Task<ApiResponse<String>> DeleteOrderAsync(int id);
    }
}
