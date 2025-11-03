using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

public static class ProductRoute {
    public static IEndpointRouteBuilder MapProductEndponit(this IEndpointRouteBuilder group) {
        var ProductRoute = group.MapGroup("/products").WithTags("Products");

        // CREATE
        ProductRoute.MapPost("/", async (
    [FromForm] CreateProductRequest req,
    [FromServices] IProductService IProduct,
    [FromServices] IValidator<CreateProductRequest> validator
) =>
        {
            try {
                var result = await validator.ValidateAsync(req);
                if (!result.IsValid) {
                    return Results.BadRequest(result.Errors.Select(e => new {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }));
                }

                var product = await IProduct.CreateProduct(req);
                if (product.Data == null) {
                    return Results.BadRequest(new { message = product.Message, status = product.Success });
                }

                return Results.Created($"/product/{product.Data.ProductId}", product);
            } catch (Exception e) {
                var err = new ErrorResponse {
                    Message = e.Message ?? "Lỗi không xác định",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });
        // READ - LIST with optional filters
        ProductRoute.MapGet("/", async ([AsParameters] GetProductRequest GetProductRequest, IProductService productService, IValidator<GetProductRequest> validator) =>
        {
            try {
                ValidationResult result = await validator.ValidateAsync(GetProductRequest);
                if (!result.IsValid) {
                    return Results.BadRequest(result.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }));
                }
                var products = await productService.GetProduct(GetProductRequest);
                if (products.Data == null) {
                    return Results.BadRequest(new {
                        mess = "Get products failed"
                    });
                }
                return Results.Ok(products);
            } catch (Exception e) {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse {
                    Message = e.Message.ToString() ?? "Un expected error",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });
        ProductRoute.MapGet("/{id:int}", async (int id, IProductService productService) => {
            try {
                var product = await productService.GetProductById(id);
                if (product.Data == null) {
                    return Results.BadRequest(new { mess = product.Message, status = product.Success });
                }
                return Results.Ok(product);
            } catch (Exception e) {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse {
                    Message = e.Message.ToString() ?? "Un expected error",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }

        });

        // update
        ProductRoute.MapPatch("/", async ([AsParameters] UpdateProductRequest req, IProductService IProduct, IValidator<UpdateProductRequest> validator) => {
            try {
                ValidationResult result = await validator.ValidateAsync(req);
                if (!result.IsValid) {
                    return Results.BadRequest(result.Errors.Select(e => new {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }));
                }
                var product = await IProduct.UpdateProduct(req);
                if (product.Data == null) {
                    return Results.BadRequest(new { message = product.Message, status = product.Success });
                }

                return Results.Ok(product);
            } catch (Exception e) {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse {
                    Message = e.Message.ToString() ?? "Lỗi không xác định",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });
        return group;
    }
}