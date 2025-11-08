using FluentValidation;
using FluentValidation.Results;

public static class OrderRoute
{
    public static IEndpointRouteBuilder MapOrderEndPoint(this IEndpointRouteBuilder group)
    {
        var route = group.MapGroup("/orders").WithTags("Orders");

        // CREATE
        route.MapPost("/", async (OrderRequest body, IValidator<OrderRequest> validator, IOrderService svc) =>
        {
            ValidationResult val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.Create(body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // LIST (filter optional)
        route.MapGet("/", async (IOrderService svc, int? customerId, int? userId, int? status, DateTime? dateFrom, DateTime? dateTo) =>
        {
            var rs = await svc.GetAll(customerId, userId, status, dateFrom, dateTo);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // GET BY ID
        route.MapGet("/{id:int}", async (int id, IOrderService svc) =>
        {
            var rs = await svc.GetById(id);
            return rs.Success ? Results.Ok(rs) : Results.NotFound(rs);
        });

        // UPDATE
        route.MapPut("/{id:int}", async (int id, OrderRequest body, IValidator<OrderRequest> validator, IOrderService svc) =>
        {
            ValidationResult val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.Update(id, body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // DELETE
        route.MapDelete("/{id:int}", async (int id, IOrderService svc) =>
        {
            var rs = await svc.Delete(id);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // CREATE WITH ITEMS 
        route.MapPost("/with-items", async (
            CreateOrderWithItemsRequest body,
            IValidator<CreateOrderWithItemsRequest> validator,
            IOrderService svc) =>
        {
            var val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.CreateWithItems(body);
            return rs.Success
                ? Results.Created($"/orders/{rs.Data?.Id}", rs)
                : Results.BadRequest(rs);
        })
        .WithName("CreateOrderWithItems")
        .Produces<ApiResponse<OrderResponse>>(201)
        .ProducesValidationProblem();

        return group;
    }
}
