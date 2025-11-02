public interface IPaymentService {
    Task<ApiResponse<IEnumerable<Payments>>> GetAll(int? orderId);
    Task<ApiResponse<Payments>> GetById(int id);
    Task<ApiResponse<Payments>> Create(Payments payment);
    Task<ApiResponse<Payments>> Update(int id, Payments payment);
    Task<ApiResponse<string>> Delete(int id);
}
