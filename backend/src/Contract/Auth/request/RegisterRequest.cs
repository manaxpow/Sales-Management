using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Mvc;


public record RegisterRequest
{

    [FromForm]
    [Required]
    public required string Email { get; init; }
    [FromForm]
    [Required]
    public required string FullName { get; init; }
    [FromForm]
    [Required]
    public required string Phone { get; init; }
    [FromForm]
    [Required]
    public required string UserName { get; init; }
    [FromForm]
    [Required]
    public required string Password { get; init; }
    [FromForm]
    [Required]
    public required string Address { get; init; }
}
