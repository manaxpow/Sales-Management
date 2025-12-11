using System.Text.Json;
using blazor_web.Models;
public class PromotionService : IPromotionService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PromotionService> _logger;

    public PromotionService(
        HttpClient httpClient,
        ILogger<PromotionService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }
    public async Task<ApiResponse<GetAllPromotionResponse>> GetAll(GetAllPromotionReq request)
    {
        try
        {
            Console.WriteLine($"[PromotionService] GetAll: Fetching promotions with request: {JsonSerializer.Serialize(request)}");
            string query = QueryBuilder.BuildQuery(request);
            string url = string.IsNullOrEmpty(query) ? "promotion" : $"promotion?{query}";
            var response = await _httpClient.GetFromJsonAsync<ApiResponse<GetAllPromotionResponse>>(url);
            if (response != null)
            {
                // map data
                return response;
            }
            else
            {
                return new ApiResponse<GetAllPromotionResponse>
                {
                    Success = false,
                    Message = "No data",
                    Data = new GetAllPromotionResponse()
                };
            }

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching promotions");
            throw;
        }


    }
    public async Task<ApiResponse<GetPromotionRes>> GetPromotionById(int id)
    {
        try
        {

            var response = await _httpClient.GetFromJsonAsync<ApiResponse<GetPromotionRes>>($"api/promotions/{id}");
            if (response?.Data.Success == true)
            {
                return response!;
            }
            else
            {
                return new ApiResponse<GetPromotionRes>
                {
                    Success = false,
                    Message = "Get promotion fail",
                    Data = new GetPromotionRes()
                };
            }

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching promotions");
            throw;
        }


    }

    public async Task<ApiResponse<PromotionRes>> CreatePromotion(CreatePromotionReq request)
    {
        try
        {
            var form = new MultipartFormDataContent
            {
                { new StringContent(request.PromotionCode), "PromotionCode" },
                { new StringContent(request.Description ?? ""), "Description" },
                { new StringContent(request.DiscountType.ToString()), "DiscountType" },
                { new StringContent(request.DiscountValue.ToString()), "DiscountValue" },
                { new StringContent(request.UsageLimit.ToString()), "UsageLimit" },
                { new StringContent(request.MinOrderAmount.ToString()), "MinOrderAmount" },
                { new StringContent(request.StartDate), "StartDate" },
                { new StringContent(request.EndDate), "EndDate" }
            };

            var response = await _httpClient.PostAsync("promotion", form);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.ValueKind == JsonValueKind.Array)
                {
                    // API trả về mảng lỗi
                    var errors = JsonSerializer.Deserialize<List<ValidationError>>(content, options)!;

                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = errors.FirstOrDefault()?.message ?? "Validation failed",

                    };
                }
                else if (doc.RootElement.ValueKind == JsonValueKind.Object)
                {
                    // API trả về object
                    var obj = JsonSerializer.Deserialize<ValidationError>(content, options);

                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = obj?.message ?? "Unknown error",

                    };
                }
                else
                {
                    // JSON không hợp lệ
                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = "Invalid JSON returned from server"
                    };
                }
            }
            else
            {
                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<PromotionRes>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return new ApiResponse<PromotionRes>
                {
                    Success = true,
                    Message = "Create promotion success",
                    Data = successfulApiResponse!.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating promotion");
            throw;
        }
    }

    public async Task<ApiResponse<PromotionRes>> UpdatePromotion(UpdatePromotionReq request)
    {
        try
        {
            var form = new MultipartFormDataContent
            {
                { new StringContent(request.PromotionCode), "promotionCode" },
                { new StringContent(request.Description ?? ""), "Description" },
                { new StringContent(request.DiscountType.ToString()), "DiscountType" },
                { new StringContent(request.DiscountValue.ToString()), "DiscountValue" },
                { new StringContent(request.UsageLimit.ToString()), "UsageLimit" },
                { new StringContent(request.MinOrderAmount.ToString()), "MinOrderAmount" },
                { new StringContent(request.StartDate), "StartDate" },
                { new StringContent(request.EndDate), "EndDate" },
                { new StringContent(request.Id.ToString()), "PromotionId" },
                { new StringContent(request.Status.ToString()), "Status" }
            };

            var response = await _httpClient.PatchAsync("promotion", form);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.ValueKind == JsonValueKind.Array)
                {
                    // API trả về mảng lỗi
                    var errors = JsonSerializer.Deserialize<List<ValidationError>>(content, options)!;

                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = errors.FirstOrDefault()?.message ?? "Validation failed",

                    };
                }
                else if (doc.RootElement.ValueKind == JsonValueKind.Object)
                {
                    // API trả về object
                    var obj = JsonSerializer.Deserialize<ValidationError>(content, options);

                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = obj?.message ?? "Unknown error",

                    };
                }
                else
                {
                    // JSON không hợp lệ
                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = "Invalid JSON returned from server"
                    };
                }
            }
            else
            {
                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<PromotionRes>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return new ApiResponse<PromotionRes>
                {
                    Success = true,
                    Message = "Update promotion success",
                    Data = successfulApiResponse!.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating promotion");
            throw;
        }
    }

    public async Task<ApiResponse<PromotionRes>> DeletePromotion(DeletePromotionReq request)
    {
        try
        {
            var form = new MultipartFormDataContent
            {

                { new StringContent(request.Id.ToString()), "PromotionId" },
                { new StringContent("3"), "Status" }
            };

            var response = await _httpClient.PatchAsync("promotion", form);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.ValueKind == JsonValueKind.Array)
                {
                    // API trả về mảng lỗi
                    var errors = JsonSerializer.Deserialize<List<ValidationError>>(content, options)!;

                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = errors.FirstOrDefault()?.message ?? "Validation failed",

                    };
                }
                else if (doc.RootElement.ValueKind == JsonValueKind.Object)
                {
                    // API trả về object
                    var obj = JsonSerializer.Deserialize<ValidationError>(content, options);

                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = obj?.message ?? "Unknown error",

                    };
                }
                else
                {
                    // JSON không hợp lệ
                    return new ApiResponse<PromotionRes>
                    {
                        Success = false,
                        Message = "Invalid JSON returned from server"
                    };
                }
            }
            else
            {
                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<PromotionRes>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return new ApiResponse<PromotionRes>
                {
                    Success = true,
                    Message = "Delete promotion success",
                    Data = successfulApiResponse!.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating promotion");
            throw;
        }
    }

}



public class ValidationError
{
    public string field { get; set; } = string.Empty;
    public string message { get; set; } = string.Empty;
}