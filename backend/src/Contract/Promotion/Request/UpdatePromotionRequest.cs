
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

public record UpdatePromotionRequest
{
    [FromForm]
    public int PromotionId { get; init; }
    [FromForm]
    public string? PromotionCode { get; init; } = string.Empty;
    [FromForm]

    public string? Description { get; init; } = string.Empty;
    [FromForm]
    [Range(1, 2)]
    // 1 - Percentage, 2-Fixed
    public int? DiscountType { get; init; }

    [FromForm]
    public decimal? DiscountValue { get; set; }
    [FromForm]
    public decimal? MinOrderAmount { get; set; }

    [FromForm]
    public int? Usagelimit { get; set; }
    [FromForm]
    [Range(1, 3)]
    // 1 - Active , 2 - Inactive , 3-Deleted
    public int? Status { get; set; }


    [FromForm]
    public string? StartDate { get; set; } = string.Empty;
    [FromForm]
    public string? EndDate { get; set; } = string.Empty;

}
