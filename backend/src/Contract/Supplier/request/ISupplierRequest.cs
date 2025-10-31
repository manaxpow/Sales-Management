namespace backend.Contract.Supplier.Request;

public interface ISupplierRequest
{
    string Name { get; }
    string Phone { get; }
    string Email { get; }
    string Address { get; }
}