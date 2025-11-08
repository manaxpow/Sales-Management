using Microsoft.AspNetCore.Mvc;

public record GetInventoryRequest(
    [property: FromQuery(Name = "page")] int Page = 1,
    [property: FromQuery(Name = "pageSize")] int PageSize = 10,
    [property: FromQuery(Name = "search")] string? Search = null,
    [property: FromQuery(Name = "status")] string? Status = null
);
