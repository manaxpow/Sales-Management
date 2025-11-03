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