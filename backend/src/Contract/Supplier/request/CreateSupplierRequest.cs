namespace backend.Contract.Supplier.Request;

public record CreateSupplierRequest : ISupplierRequest
{
    public string Name { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
}