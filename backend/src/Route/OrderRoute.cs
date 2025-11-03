public static class OrderRoute {
    public static IEndpointRouteBuilder MapOrderEndPoint(this IEndpointRouteBuilder group) {
        var orders = group.MapGroup("/orders").WithTags("Orders");

        // CREATE
        orders.MapPost("/", async (Orders body, IOrderService svc) => {
            var rs = await svc.Create(body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // READ - LIST with optional filters
        orders.MapGet("/", async (
            IOrderService svc,
            int? customerId,
            int? userId,
            int? status,
            DateTime? dateFrom,
            DateTime? dateTo) => {
                var rs = await svc.GetAll(customerId, userId, status, dateFrom, dateTo);
                return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
            });

        // READ - BY ID
        orders.MapGet("/{id:int}", async (int id, IOrderService svc) => {
            var rs = await svc.GetById(id);
            return rs.Success ? Results.Ok(rs) : Results.NotFound(rs);
        });

        // UPDATE
        orders.MapPut("/{id:int}", async (int id, Orders body, IOrderService svc) => {
            var rs = await svc.Update(id, body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // DELETE
        orders.MapDelete("/{id:int}", async (int id, IOrderService svc) => {
            var rs = await svc.Delete(id);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        return group;
    }
}
