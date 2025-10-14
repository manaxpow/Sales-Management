
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

public record CreateBookRequest
{
    [Required]
    [FromForm]
    public required string Name { get; init; }

    [Required]
    [FromForm]
    [Range(18, 99)]
    public int CategoryId { get; init; }
    [FromForm]
    public int ActorId { get; init; }
}
