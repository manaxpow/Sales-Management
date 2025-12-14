using blazor_web.Models;
using blazor_web.DTOs.History;

namespace blazor_web.Services.History
{
    public interface IHistoryService
    {
        Task<ApiResponse<PagedHistoryResponse>> GetOrderHistoryAsync(GetHistoryRequest request);
        Task<ApiResponse<GetHistoryDetailResponse>> GetOrderHistoryDetailAsync(GetHistoryDetailRequest request);
    }
}
