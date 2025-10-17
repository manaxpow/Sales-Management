using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Mvc;


public record LoginRequest
{

    [FromForm]
    [Required]
    public required string UserName { get; init; }

    [Required]
    [FromForm]
    public required string Password { get; init; }

}
