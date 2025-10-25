using backend.Contract.Supplier.Request;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

public static class SupplierRoute
{
    public static IEndpointRouteBuilder MapSupplierEndPoint(this IEndpointRouteBuilder group)
    {
        var suppliersGroup = group.MapGroup("/suppliers");
        //   .RequireAuthorization();

        // POST: CREATE 
        suppliersGroup.MapPost("/", async (
            [FromForm] CreateSupplierRequest request,
            ISupplierService service,
            IValidator<CreateSupplierRequest> createValidator) => 
        {
            // Validate CREATE
            var result = await createValidator.ValidateAsync(request);
            if (!result.IsValid)
            {
                return Results.BadRequest(result.Errors.Select(e => new
                {
                    field = e.PropertyName,
                    message = e.ErrorMessage
                }));
            }

            var supplier = await service.AddSupplierAsync(request);
            return Results.Created($"/suppliers/{supplier.Id}", supplier);
        });

        // GET: READ ALL
        suppliersGroup.MapGet("/", async (ISupplierService service) =>
        {
            var result = await service.GetSuppliersAsync();
            return Results.Ok(result);
        });

        // GET: READ BY ID
        suppliersGroup.MapGet("/{id:int}", async (int id, ISupplierService service) =>
        {
            var result = await service.GetSupplierByIdAsync(id);
            return result != null ? Results.Ok(result) : Results.NotFound();
        });

        suppliersGroup.MapPut("/{id:int}", async (
            int id,
            [FromForm] UpdateSupplierRequest request,
            ISupplierService service,
            IValidator<UpdateSupplierRequest> updateValidator) =>  
        {
            if (id != request.Id)
                return Results.BadRequest("ID in path must match ID in body.");

            // Validate UPDATE
            var result = await updateValidator.ValidateAsync(request);
            if (!result.IsValid)
            {
                return Results.BadRequest(result.Errors.Select(e => new
                {
                    field = e.PropertyName,
                    message = e.ErrorMessage
                }));
            }

            var updated = await service.UpdateSupplierAsync(id, request);
            return updated != null ? Results.Ok(updated) : Results.NotFound();
        });

        // DELETE
        suppliersGroup.MapDelete("/{id:int}", async (int id, ISupplierService service) =>
        {
            var result = await service.DeleteSupplierAsync(id);
            return result ? Results.NoContent() : Results.NotFound();
        });

        return group;
    }
}