using backend.Contract.Supplier.Request;
using backend.Contract.Supplier.Response;

public interface ISupplierService
{
    Task<IEnumerable<SupplierResponse>> GetSuppliersAsync();
    Task<SupplierResponse?> GetSupplierByIdAsync(int id);
    Task<SupplierResponse> AddSupplierAsync(CreateSupplierRequest createSupplierRequest);
    Task<SupplierResponse?> UpdateSupplierAsync(int id, UpdateSupplierRequest updateSupplierRequest);
    Task<bool> DeleteSupplierAsync(int id);
}
