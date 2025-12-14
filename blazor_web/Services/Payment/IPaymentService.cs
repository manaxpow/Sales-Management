using blazor_web.Models;

namespace blazor_web.Services.Payment;

public interface IPaymentService
{
    public Task<ApiResponse<PaymentResponse>> CreatePayment(PaymentRequest request);
}