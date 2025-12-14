public interface IHistoryService
{
    Task<ApiResponse<PagedHistoryResponse>> GetOrderHistory(GetHistoryRequest request);
    Task<ApiResponse<HistoryDetailResponse>> GetOrderHistoryDetail(GetHistoryDetailRequest request);
}
