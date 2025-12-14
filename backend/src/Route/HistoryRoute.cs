public static class HistoryRoute
{
    public static IEndpointRouteBuilder MapHistoryEndPoint(this IEndpointRouteBuilder group)
    {
        var route = group.MapGroup("/history").WithTags("History");

        // GET ORDER HISTORY (with pagination and filters)
        route.MapGet("/", async (int userId, IHistoryService svc, int page = 1, int pageSize = 10, int? status = null, DateTime? dateFrom = null, DateTime? dateTo = null) =>
        {
            var request = new GetHistoryRequest
            {
                UserId = userId,
                Page = page,
                PageSize = pageSize,
                Status = status,
                DateFrom = dateFrom,
                DateTo = dateTo
            };

            var rs = await svc.GetOrderHistory(request);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        })
        .WithName("GetOrderHistory")
        .Produces<ApiResponse<PagedHistoryResponse>>(200);

        // GET ORDER HISTORY DETAIL
        route.MapGet("/{orderId:int}", async (int userId, int orderId, IHistoryService svc) =>
        {
            var request = new GetHistoryDetailRequest
            {
                UserId = userId,
                OrderId = orderId
            };

            var rs = await svc.GetOrderHistoryDetail(request);
            return rs.Success ? Results.Ok(rs) : Results.NotFound(rs);
        })
        .WithName("GetOrderHistoryDetail")
        .Produces<ApiResponse<HistoryDetailResponse>>(200);

        return group;
    }
}
