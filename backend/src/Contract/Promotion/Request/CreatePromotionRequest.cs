
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

public record CreatePromotionRequest
{
    [Required]
    [FromForm]
    public string PromotionCode { get; init; } = string.Empty;

    [FromForm]
    
    public string? Description { get; init; } = string.Empty;
    [FromForm]
    [Range(1, 2)]
    // 1 - Percentage, 2-Fixed
    public int DiscountType { get; init; }

    [FromForm]
    public decimal DiscountValue { get; set; }
    [FromForm]
    public decimal MinOrderAmount { get; set; }

    [FromForm]
    public int Usagelimit { get; set; }


    [FromForm]
    public string StartDate { get; set; } = string.Empty;
    [FromForm]
    public string EndDate { get; set; } = string.Empty;

}
