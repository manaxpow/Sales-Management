public interface IPaymentService {
    Task<ApiResponse<IEnumerable<PaymentResponse>>> GetAll(int? orderId);
    Task<ApiResponse<PaymentResponse>> GetById(int id);
    Task<ApiResponse<PaymentResponse>> Create(PaymentRequest request);
    Task<ApiResponse<PaymentResponse>> Update(int id, PaymentRequest request);
    Task<ApiResponse<string>> Delete(int id);
}
