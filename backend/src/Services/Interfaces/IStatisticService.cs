
public interface IStatisticService
{
Task<ApiResponse<StatisticOrderResponse>> GetStatisticOrder(StatisticRequest request);
    Task<ApiResponse<GetStatisticProduct>> GetStatisticProduct(string type);
    Task<ApiResponse<StatisticRevenuelResponse>> GetStatisticRevenue(StatisticRequest request);
    Task<ApiResponse<StatisticCustomerResponse>> GetStatisticCustomer();
}