using blazor_web.Models;

public interface IStatisticService
{
    Task<ApiResponse<StatisticOrderResponse>> GetStatisticOrder(StatisticRequest request);

    Task<ApiResponse<StatisticRevenuelResponse>> GetStatisticRevenue(StatisticRequest request);
    Task<ApiResponse<GetStatisticProduct>> GetStatisticProduct(string type);
    Task<ApiResponse<StatisticCustomerResponse>> GetStatisticCustomer();
}