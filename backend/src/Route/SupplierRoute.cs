using FluentValidation;
using FluentValidation.Results;

public static class SupplierRoute {
    public static IEndpointRouteBuilder MapSupplierEndPoint(this IEndpointRouteBuilder group) {
        var route = group.MapGroup("/suppliers").WithTags("Suppliers");

        // CREATE
        route.MapPost("/", async (Suppliers body, IValidator<Suppliers> validator, ISupplierService svc) => {
            ValidationResult val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.Create(body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // LIST
        route.MapGet("/", async (ISupplierService svc) => {
            var rs = await svc.GetAll();
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // BY ID
        route.MapGet("/{id:int}", async (int id, ISupplierService svc) => {
            var rs = await svc.GetById(id);
            return rs.Success ? Results.Ok(rs) : Results.NotFound(rs);
        });

        // UPDATE
        route.MapPut("/{id:int}", async (int id, Suppliers body, IValidator<Suppliers> validator, ISupplierService svc) => {
            ValidationResult val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.Update(id, body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // DELETE
        route.MapDelete("/{id:int}", async (int id, ISupplierService svc) => {
            var rs = await svc.Delete(id);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        return group;
    }
}
