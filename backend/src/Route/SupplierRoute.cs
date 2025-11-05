using backend.Contract.Supplier.Request;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc; // Thêm using

public static class SupplierRoute
{
    public static IEndpointRouteBuilder MapSupplierEndPoint(this IEndpointRouteBuilder group)
    {
        var suppliersGroup = group.MapGroup("/suppliers").WithTags("Suppliers");

        suppliersGroup.MapPost("/", async ([FromBody] CreateSupplierRequest req, ISupplierService service, IValidator<CreateSupplierRequest> validator) =>
        {
            try
            {
                ValidationResult result = await validator.ValidateAsync(req);
                if (!result.IsValid)
                {
                    return Results.Json(result.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }), statusCode: 400);
                }
                var supplier = await service.AddSupplierAsync(req);
                if (supplier.Data == null)
                {
                    return Results.Json(new
                    {
                        message = supplier.Message,
                        status = supplier.Success
                    }, statusCode: 400);
                }
                return Results.Created($"/suppliers/{supplier.Data.Id}", supplier);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse
                {
                    Message = e.Message.ToString() ?? "Lỗi không xác định",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });

        // READ - LIST 
        suppliersGroup.MapGet("/", async (ISupplierService service) =>
        {
            try
            {
                var suppliers = await service.GetSuppliersAsync();
                if (suppliers.Data == null)
                {
                    return Results.BadRequest(new
                    {
                        mess = "Get suppliers failed"
                    });
                }
                return Results.Ok(suppliers);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse
                {
                    Message = e.Message.ToString() ?? "Un expected error",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });

        // READ - BY ID
        suppliersGroup.MapGet("/{id:int}", async (int id, ISupplierService service) =>
        {
            try
            {
                var supplier = await service.GetSupplierByIdAsync(id);
                if (supplier.Data == null)
                {
                    return Results.BadRequest(new { mess = supplier.Message, status = supplier.Success });
                }
                return Results.Ok(supplier);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse
                {
                    Message = e.Message.ToString() ?? "Un expected error",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });

        // UPDATE
        suppliersGroup.MapPatch("/", async ([FromBody] UpdateSupplierRequest req, ISupplierService service, IValidator<UpdateSupplierRequest> validator) =>
        {
            try
            {
                ValidationResult result = await validator.ValidateAsync(req);
                if (!result.IsValid)
                {
                    return Results.BadRequest(result.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }));
                }

                var supplier = await service.UpdateSupplierAsync(req);

                if (supplier.Data == null)
                {
                    return Results.BadRequest(new { message = supplier.Message, status = supplier.Success });
                }
                return Results.Ok(supplier);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse
                {
                    Message = e.Message.ToString() ?? "Lỗi không xác định",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });

        // DELETE
        suppliersGroup.MapDelete("/{id:int}", async (int id, ISupplierService service) =>
        {
            try
            {
                var result = await service.DeleteSupplierAsync(id);
                if (!result.Success)
                {
                    return Results.BadRequest(new { message = result.Message, status = result.Success });
                }

                return Results.Ok(result);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse
                {
                    Message = e.Message.ToString() ?? "Un expected error",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });

        return group;
    }
}