public record GetProductRequest
{
    public string? ProductName { get; init; } = string.Empty;

    public int? SupplierId { get; init; }

    public int? CategoryId { get; init; }

    public string? Barcode { get; init; }

    public decimal? Price { get; init; }

    public int? Limit { get; init; } = 10;

    public int? Page { get; init; } = 1;

    public int? Status { get; init; }

    public string? SortBy { get; init; } = "CreatedAt";

    public string? SortOrder { get; init; } = "desc";


}