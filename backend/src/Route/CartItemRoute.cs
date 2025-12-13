using FluentValidation;
using FluentValidation.Results;

public static class CartItemRoute {
    public static IEndpointRouteBuilder MapCartItemEndPoint(this IEndpointRouteBuilder group) {
        var route = group.MapGroup("/cart-items").WithTags("CartItems");

        route.MapPost("/", async (CartItemRequest body, IValidator<CartItemRequest> validator, ICartItemService svc) => {
            var val = await validator.ValidateAsync(body);
            if (!val.IsValid) return Results.BadRequest(val.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            var rs = await svc.Create(body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        route.MapGet("/", async (ICartItemService svc, int? cartId) => {
            var rs = await svc.GetAll(cartId);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        route.MapGet("/{id:int}", async (int id, ICartItemService svc) => {
            var rs = await svc.GetById(id);
            return rs.Success ? Results.Ok(rs) : Results.NotFound(rs);
        });

        route.MapPut("/{id:int}", async (int id, CartItemRequest body, IValidator<CartItemRequest> validator, ICartItemService svc) => {
            var val = await validator.ValidateAsync(body);
            if (!val.IsValid) return Results.BadRequest(val.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            var rs = await svc.Update(id, body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        route.MapDelete("/{id:int}", async (int id, ICartItemService svc) => {
            var rs = await svc.Delete(id);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        return group;
    }
}
