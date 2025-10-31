
using backend.Contract.Supplier.Request;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

public static class SupplierRoute
{
    public static IEndpointRouteBuilder MapSupplierEndPoint(this IEndpointRouteBuilder group)
    {
        var suppliersGroup = group.MapGroup("/suppliers");
        suppliersGroup.MapPost("/", async (
            [FromBody] CreateSupplierRequest request,  
            ISupplierService service,
            IValidator<CreateSupplierRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            try
            {
                var supplier = await service.AddSupplierAsync(request);
                return Results.Created($"/suppliers/{supplier.Id}", supplier);
            }
            catch (InvalidOperationException ex)
            {
                return Results.Conflict(new { message = ex.Message });
            }
        });

        suppliersGroup.MapGet("/", async (ISupplierService service) =>
        {
            return Results.Ok(await service.GetSuppliersAsync());
        });

        suppliersGroup.MapGet("/{id:int}", async (int id, ISupplierService service) =>
        {
            var result = await service.GetSupplierByIdAsync(id);
            return result != null ? Results.Ok(result) : Results.NotFound();
        });

        suppliersGroup.MapPut("/{id:int}", async (
            int id,
            [FromBody] UpdateSupplierRequest request,  
            ISupplierService service,
            IValidator<UpdateSupplierRequest> validator) =>
        {
        
            if (id != request.Id)
                return Results.BadRequest(new { message = "ID in path must match ID in body." });

            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            try
            {
                var updated = await service.UpdateSupplierAsync(id, request);
                return updated != null ? Results.Ok(updated) : Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.Conflict(new { message = ex.Message });
            }
        });

        suppliersGroup.MapDelete("/{id:int}", async (int id, ISupplierService service) =>
        {
            return await service.DeleteSupplierAsync(id) ? Results.NoContent() : Results.NotFound();
        });

        return group;
    }
}