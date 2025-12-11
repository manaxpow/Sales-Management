using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

public record UpdateProductRequest
{
    [FromForm]
    [Required]
    public int ProductId { get; set; }
    [FromForm]
    public int? SupplierId { get; set; }

    [FromForm]
    public int? CategoryId { get; set; }

    [FromForm]
    public string? ProductName { get; set; } = string.Empty;

    [FromForm]
    public decimal? Price { get; set; }
    [FromForm]
    public int? Status { get; set; }

    [FromForm]
    public string? Unit { get; set; } = "Cái";



}