public static class OrderItemRoute
{
    public static IEndpointRouteBuilder MapOrderItemEndPoint(this IEndpointRouteBuilder group)
    {
        var route = group.MapGroup("/orderitems").WithTags("OrderItems");

        route.MapPost("/", async (OrderItem item, IOrderItemService service) =>
        {
            var result = await service.Create(item);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });
        route.MapGet("/", async (IOrderItemService service, int? orderId) =>
        {
            var result = await service.GetAll(orderId);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        route.MapGet("/{id:int}", async (int id, IOrderItemService service) =>
        {
            var result = await service.GetById(id);
            return result.Success ? Results.Ok(result) : Results.NotFound(result);
        });

        route.MapPut("/{id:int}", async (int id, OrderItem updatedItem, IOrderItemService service) =>
        {
            var result = await service.Update(id, updatedItem);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        route.MapDelete("/{id:int}", async (int id, IOrderItemService service) =>
        {
            var result = await service.Delete(id);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        return group;
    }
}
