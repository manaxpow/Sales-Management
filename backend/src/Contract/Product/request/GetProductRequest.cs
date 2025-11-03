using Microsoft.AspNetCore.Mvc;

public record GetProductRequest
{
    [FromQuery]
    public string? ProductName { get; init; } = string.Empty;
    [FromQuery]


    public int? SupplierId { get; init; }
    [FromQuery]

    public int? CategoryId { get; init; }
    [FromQuery]

    public string? Barcode { get; init; }
    [FromQuery]

    public decimal? Price { get; init; }
    [FromQuery]

    public int? Limit { get; init; } = 10;
    [FromQuery]

    public int? Page { get; init; } = 1;
    [FromQuery]

    public int? Status { get; init; }
    [FromQuery]


    public string? SortBy { get; init; } = "CreatedAt";
    [FromQuery]

    public string? SortOrder { get; init; } = "desc";


}