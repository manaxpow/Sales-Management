using FluentValidation;
using FluentValidation.Results;

public static class PaymentRoute {
    public static IEndpointRouteBuilder MapPaymentEndPoint(this IEndpointRouteBuilder group) {
        var route = group.MapGroup("/payments").WithTags("Payments");

        // CREATE
        route.MapPost("/", async (PaymentRequest body, IValidator<PaymentRequest> validator, IPaymentService svc) => {
            ValidationResult val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.Create(body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // LIST (filter by orderId optional)
        route.MapGet("/", async (IPaymentService svc, int? orderId) => {
            var rs = await svc.GetAll(orderId);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // GET BY ID
        route.MapGet("/{id:int}", async (int id, IPaymentService svc) => {
            var rs = await svc.GetById(id);
            return rs.Success ? Results.Ok(rs) : Results.NotFound(rs);
        });

        // UPDATE
        route.MapPut("/{id:int}", async (int id, PaymentRequest body, IValidator<PaymentRequest> validator, IPaymentService svc) => {
            ValidationResult val = await validator.ValidateAsync(body);
            if (!val.IsValid)
                return Results.BadRequest(val.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }));

            var rs = await svc.Update(id, body);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        // DELETE
        route.MapDelete("/{id:int}", async (int id, IPaymentService svc) => {
            var rs = await svc.Delete(id);
            return rs.Success ? Results.Ok(rs) : Results.BadRequest(rs);
        });

        return group;
    }
}
