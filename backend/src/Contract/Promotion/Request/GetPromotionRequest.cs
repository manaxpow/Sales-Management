using Microsoft.AspNetCore.Mvc;

public record GetPromotionRequest
{
    [FromQuery]
    public string? PromotionCode { get; init; } = string.Empty;
    [FromQuery]


    public int? DiscountType { get; init; }
    [FromQuery]

    public int? Status { get; init; }
    [FromQuery]

    public int? Limit { get; init; } = 10;
    [FromQuery]

    public int? Page { get; init; } = 1;
    [FromQuery]


    public string? SortBy { get; init; } = "CreatedAt";
    [FromQuery]

    public string? SortOrder { get; init; } = "desc";


}