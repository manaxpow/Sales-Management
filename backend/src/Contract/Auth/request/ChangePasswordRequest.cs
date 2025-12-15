using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Mvc;


public record ChangePasswordRequest
{

    [FromForm]
    [Required]
    public required int UserId { get; init; }

    [Required]
    [FromForm]
    public required string Password { get; init; }

    [Required]
    [FromForm]
    public required string NewPassword { get; init; }

}
