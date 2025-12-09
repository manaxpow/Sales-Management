using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

public record CreateProductRequest
{
    [Required]
    [FromForm]
    public int SupplierId { get; set; }
    [Required]
    [FromForm]
    public int CategoryId { get; set; }
    [Required]
    [FromForm]
    public string ProductName { get; set; } = string.Empty;


    [Required]
    [FromForm]
    public decimal Price { get; set; }

    [FromForm]
    public string? Unit { get; set; } = "Cái";
    [FromForm]
    public int? Status { get; set; } = 1;

    [FromForm]
    public IFormFile? ImageProduct { get; set; } 



}