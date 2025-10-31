public interface IOrderService {
    Task<ApiResponse<IEnumerable<Orders>>> GetAll(
        int? customerId,
        int? userId,
        int? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<ApiResponse<Orders>> GetById(int id);

    Task<ApiResponse<Orders>> Create(Orders newOrder);

    Task<ApiResponse<Orders>> Update(int id, Orders updated);

    Task<ApiResponse<string>> Delete(int id);
}
