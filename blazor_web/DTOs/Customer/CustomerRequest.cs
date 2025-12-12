using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

public record CreateCustomerRequest
{
    [Required]
    [Phone]
    [FromForm]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [FromForm]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [FromForm]
    public string Email { get; set; } = string.Empty;

    [Required]
    [FromForm]
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