using Microsoft.AspNetCore.Mvc;

public record GetCustomerRequest
{
    [FromQuery]
    public string? Search { get; init; }

    [FromQuery]
    public int? Limit { get; init; } = 10;

    [FromQuery]
    public int? Page { get; init; } = 1;
}