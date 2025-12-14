using System.Text.Json;
using blazor_web.Models;

namespace blazor_web.Services.Payment;

public class PaymentService(HttpClient http, ILogger<PromotionService> logger) : IPaymentService
{
    public async Task<ApiResponse<PaymentResponse>> CreatePayment(PaymentRequest request)
    {
        try

        {
            var response = await http.PostAsJsonAsync("payments", request, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions() { PropertyNameCaseInsensitive = true };
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.ValueKind == JsonValueKind.Array)
                {
                    // API trả về mảng lỗi
                    var errors = JsonSerializer.Deserialize<List<ValidationError>>(content, options)!;

                    return new ApiResponse<PaymentResponse>
                    {
                        Success = false,
                        Message = errors.FirstOrDefault()?.message ?? "Validation failed",
                    };
                }
                else if (doc.RootElement.ValueKind == JsonValueKind.Object)
                {
                    // API trả về object
                    var obj = JsonSerializer.Deserialize<ValidationError>(content, options);

                    return new ApiResponse<PaymentResponse>
                    {
                        Success = false,
                        Message = obj?.message ?? "Unknown error",
                    };
                }
                else
                {
                    // JSON không hợp lệ
                    return new ApiResponse<PaymentResponse>
                    {
                        Success = false,
                        Message = "Invalid JSON returned from server"
                    };
                }
            }
            else
            {
                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<PaymentResponse>>(
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                return new ApiResponse<PaymentResponse>
                {
                    Success = true,
                    Message = "Create payment success",
                    Data = successfulApiResponse!.Data
                };
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating product");
            throw;
        }
    }
}