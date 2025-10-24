using System.ComponentModel.DataAnnotations;

namespace backend.Contract.Supplier.Request;

public record CreateSupplierRequest
{
    [Required]
    public string Name { get; init; } = string.Empty;

    [Required]
    [Phone]
    public string Phone { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Address { get; init; } = string.Empty;
}