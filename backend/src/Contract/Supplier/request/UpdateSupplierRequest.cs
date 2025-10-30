namespace backend.Contract.Supplier.Request;

public record UpdateSupplierRequest : ISupplierRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
}