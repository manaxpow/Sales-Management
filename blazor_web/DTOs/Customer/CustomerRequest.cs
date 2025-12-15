using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

public record CreateCustomerRequest
{
    [Required(ErrorMessage = "Phone number is required.")]
    [RegularExpression(@"^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[1-5]|9[0-9])([0-9]{7})$", ErrorMessage = "Invalid phone number format.")]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;
}
public record UpdateCustomerRequest : CreateCustomerRequest { }

public record GetCustomerRequest
{
    [FromQuery]
    public int? Id { get; init; }

    [FromQuery]
    public string? Search { get; init; }

    [FromQuery]
    public int? Limit { get; init; } = 10;

    [FromQuery]
    public int? Page { get; init; } = 1;
}