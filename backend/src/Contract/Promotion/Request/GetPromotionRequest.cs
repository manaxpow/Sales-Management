using Microsoft.AspNetCore.Mvc;

public record GetPromotionRequest
{
    [FromQuery]
    public string? PromotionCode { get; init; } = string.Empty;
    [FromQuery]


    public int? DiscountType { get; init; }
    [FromQuery]

    public int? Status { get; init; }
    public int? Limit { get; init; } = 10;
    public int? Page { get; init; } = 1;

    public string? SortBy { get; init; } = "CreatedAt";
    public string? SortOrder { get; init; } = "desc";


}