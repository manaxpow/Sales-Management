using blazor_web.Models;
using blazor_web.Services.Storage;


public class StatisticService : IStatisticService
{
    private readonly ILogger<StatisticService> _logger;
    private readonly HttpClient _httpClient;
    private readonly ILocalStorageService _localStorage;


    public StatisticService(HttpClient http, ILocalStorageService localStorage, ILogger<StatisticService> logger)
    {
        _httpClient = http;
        _localStorage = localStorage;
        _logger = logger;
    }

    public async Task<ApiResponse<StatisticOrderResponse>> GetStatisticOrder(StatisticRequest request)
    {
        try
        {
            string query = QueryBuilder.BuildQuery(request);
            if (string.IsNullOrEmpty(query))
                return new ApiResponse<StatisticOrderResponse>
                {
                    Success = false,
                    Message = "Query is empty",
                    Data = new StatisticOrderResponse(),
                };
            string url = $"statistic/order?{query}";
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<StatisticOrderResponse>>(url);
            if (response != null)
            {
                // map data
                return response;
            }
            else
            {
                return new ApiResponse<StatisticOrderResponse>
                {
                    Success = false,
                    Message = "No data",
                    Data = new StatisticOrderResponse(),
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching statistic order");
            Console.WriteLine(ex.Message);
            throw;
        }
    }


    public async Task<ApiResponse<StatisticRevenuelResponse>> GetStatisticRevenue(StatisticRequest request)
    {
        try
        {
            string query = QueryBuilder.BuildQuery(request);
            if (string.IsNullOrEmpty(query))
                return new ApiResponse<StatisticRevenuelResponse>
                {
                    Success = false,
                    Message = "Query is empty",
                    Data = new StatisticRevenuelResponse(),
                };
            string url = $"statistic/revenue?{query}";
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<StatisticRevenuelResponse>>(url);
            if (response != null)
            {
                // map data
                return response;
            }
            else
            {
                return new ApiResponse<StatisticRevenuelResponse>
                {
                    Success = false,
                    Message = "No data",
                    Data = new StatisticRevenuelResponse(),
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching statistic revenue");
            throw;
        }
    }

    public async Task<ApiResponse<GetStatisticProduct>> GetStatisticProduct(string type)
    {
        try
        {
            string url = $"statistic/product/{type}";

            var response = await _httpClient.GetFromJsonAsync<ApiResponse<GetStatisticProduct>>(url);
            if (response != null)
            {
                // map data
                return response;
            }
            else
            {
                return new ApiResponse<GetStatisticProduct>
                {
                    Success = false,
                    Message = "No data",
                    Data = new GetStatisticProduct(),
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching statistic revenue");
            throw;
        }
    }


    public async Task<ApiResponse<StatisticCustomerResponse>> GetStatisticCustomer()
    {
        try
        {
            string url = $"statistic/customer";
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<StatisticCustomerResponse>>(url);
            if (response != null)
            {
                // map data
                return response;
            }
            else
            {
                return new ApiResponse<StatisticCustomerResponse>
                {
                    Success = false,
                    Message = "No data",
                    Data = new StatisticCustomerResponse(),
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching statistic customer");
            throw;
        }
    }
}

