using blazor_web.Dtos.Orders;
using blazor_web.Models;

namespace blazor_web.Services.Orders {
    public interface IOrderService {
        Task<ApiResponse<CreateOrderResponse>> CreateWithItemsAsync(CreateOrderWithItemsRequest request);
    }
}
