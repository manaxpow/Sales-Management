using FluentValidation;
using FluentValidation.Results;

public static class OrderItemRoute {
    public static IEndpointRouteBuilder MapOrderItemEndPoint(this IEndpointRouteBuilder group) {
        var route = group.MapGroup("/orderitems").WithTags("OrderItems");

        route.MapPost("/", async (OrderItem item, IValidator<OrderItem> validator, IOrderItemService service) => {
            ValidationResult result = await validator.ValidateAsync(item);
            if (!result.IsValid) {
                return Results.BadRequest(result.Errors.Select(e => new {
                    field = e.PropertyName,
                    message = e.ErrorMessage
                }));
            }

            var res = await service.Create(item);
            return res.Success ? Results.Ok(res) : Results.BadRequest(res);
        });

        route.MapGet("/", async (IOrderItemService service, int? orderId) => {
            var res = await service.GetAll(orderId);
            return res.Success ? Results.Ok(res) : Results.BadRequest(res);
        });

        route.MapGet("/{id:int}", async (int id, IOrderItemService service) => {
            var res = await service.GetById(id);
            return res.Success ? Results.Ok(res) : Results.NotFound(res);
        });

        route.MapPut("/{id:int}", async (int id, OrderItem item, IValidator<OrderItem> validator, IOrderItemService service) => {
            ValidationResult result = await validator.ValidateAsync(item);
            if (!result.IsValid) {
                return Results.BadRequest(result.Errors.Select(e => new {
                    field = e.PropertyName,
                    message = e.ErrorMessage
                }));
            }

            var res = await service.Update(id, item);
            return res.Success ? Results.Ok(res) : Results.BadRequest(res);
        });

        route.MapDelete("/{id:int}", async (int id, IOrderItemService service) => {
            var res = await service.Delete(id);
            return res.Success ? Results.Ok(res) : Results.BadRequest(res);
        });

        return group;
    }
}
