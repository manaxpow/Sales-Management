public interface ISupplierService {
    Task<ApiResponse<IEnumerable<Suppliers>>> GetAll();
    Task<ApiResponse<Suppliers>> GetById(int id);
    Task<ApiResponse<Suppliers>> Create(Suppliers supplier);
    Task<ApiResponse<Suppliers>> Update(int id, Suppliers supplier);
    Task<ApiResponse<string>> Delete(int id);
}
