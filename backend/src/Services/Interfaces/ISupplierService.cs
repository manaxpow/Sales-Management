using backend.Contract.Supplier.Request;
using backend.Contract.Supplier.Response;

public interface ISupplierService
{
    Task<ServiceResponse<IEnumerable<SupplierResponse>>> GetSuppliersAsync();
    Task<ServiceResponse<SupplierResponse>> GetSupplierByIdAsync(int id);
    Task<ServiceResponse<SupplierResponse>> AddSupplierAsync(CreateSupplierRequest createSupplierRequest);
    Task<ServiceResponse<SupplierResponse>> UpdateSupplierAsync(UpdateSupplierRequest updateSupplierRequest);
    Task<ServiceResponse<bool>> DeleteSupplierAsync(int id);
}