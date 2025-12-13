using FluentValidation;
using FluentValidation.Results;

public static class CartRoute {
    public static IEndpointRouteBuilder MapCartEndPoint(this IEndpointRouteBuilder group) {
        var route = group.MapGroup("/carts").WithTags("Carts");

        route.MapPost("/", async (CartRequest body, IValidator<CartRequest> validator, ICartService svc) => {
            var val = await validator.ValidateAsync(body);
            if (!val.IsValid) return Results.BadRequest(val.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            var rs = await svc.Create(body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        route.MapGet("/user/{userId:int}", async (int userId, ICartService svc, string? status) => {
            var rs = await svc.GetAllByUser(userId, status);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        route.MapGet("/{id:int}", async (int id, ICartService svc) => {
            var rs = await svc.GetById(id);
            return rs.Success ? Results.Ok(rs) : Results.NotFound(rs);
        });

        route.MapPut("/{id:int}", async (int id, CartRequest body, IValidator<CartRequest> validator, ICartService svc) => {
            var val = await validator.ValidateAsync(body);
            if (!val.IsValid) return Results.BadRequest(val.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            var rs = await svc.Update(id, body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        route.MapDelete("/{id:int}", async (int id, ICartService svc) => {
            var rs = await svc.Delete(id);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        route.MapPost("/{id:int}/checkout", async (int id, ICartService svc) => {
            var rs = await svc.Checkout(id);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        return group;
    }
}
