
using System.ComponentModel.DataAnnotations;

public record CreateBookRequest
{
    public int Id { get; init; }
    [Required]
    public string Name { get; init; }

    [Required]
    [Range(18, 99)]
    public int Category_id { get; init; }
    public int Actor_id { get; init; }
}
