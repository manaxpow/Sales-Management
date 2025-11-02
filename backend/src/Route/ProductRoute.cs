using FluentValidation;
using FluentValidation.Results;

public static class ProductRoute {
    public static IEndpointRouteBuilder MapProductEndPoint(this IEndpointRouteBuilder group) {
        var route = group.MapGroup("/products").WithTags("Products");

        // CREATE
        route.MapPost("/", async (Products body, IValidator<Products> validator, IProductService svc) => {
            ValidationResult val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.Create(body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // LIST + FILTER + PAGINATION
        route.MapGet("/", async (IProductService svc, string? keyword, int? categoryId, int? supplierId, decimal? minPrice, decimal? maxPrice, int page = 1, int pageSize = 10) => {
                var rs = await svc.GetAll(keyword, categoryId, supplierId, minPrice, maxPrice, page, pageSize);
                return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
            });

        // BY ID
        route.MapGet("/{id:int}", async (int id, IProductService svc) => {
            var rs = await svc.GetById(id);
            return rs.Success ? Results.Ok(rs) : Results.NotFound(rs);
        });

        // UPDATE
        route.MapPut("/{id:int}", async (int id, Products body, IValidator<Products> validator, IProductService svc) => {
            ValidationResult val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.Update(id, body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // DELETE
        route.MapDelete("/{id:int}", async (int id, IProductService svc) => {
            var rs = await svc.Delete(id);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // GET BY SUPPLIER (có phân trang)
        route.MapGet("/by-supplier/{supplierId:int}", async (int supplierId, IProductService svc, int page = 1, int pageSize = 10) => {
                var rs = await svc.GetBySupplier(supplierId, page, pageSize);
                return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
            });

        return group;
    }
}
