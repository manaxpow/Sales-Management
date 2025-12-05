using Microsoft.AspNetCore.Mvc;
using SRC.Contract.Category.request;
using SRC.Services.Interfaces;

public static class CategoryRoute
{
    public static IEndpointRouteBuilder MapCategoryEndpoint(this IEndpointRouteBuilder app)
    {
        var route = app.MapGroup("/categories").WithTags("Categories");

        // GET: /api/categories
        route.MapGet("/", async (ICategoryService service) =>
        {
            var result = await service.GetAllAsync();
            return Results.Ok(result);
        });

        // GET: /api/categories/{id}
        route.MapGet("/{id:int}", async (int id, ICategoryService service) =>
        {
            var category = await service.GetByIdAsync(id);
            return category is not null
                ? Results.Ok(category)
                : Results.NotFound(new { message = $"Category with ID {id} not found." });
        });

        // POST: /api/categories
        route.MapPost("/", async ([FromBody] CreateCategoryRequest request, ICategoryService service) =>
        {
            var created = await service.CreateAsync(request);
            return Results.Created($"/categories/{created.CategoryId}", created);
        });

        // PUT: /api/categories/{id}
        route.MapPut("/{id:int}", async (int id, [FromBody] UpdateCategoryRequest request, ICategoryService service) =>
        {
            try
            {
                request.CategoryId = id;
                var updated = await service.UpdateAsync(request);
                return Results.Ok(updated);
            }
            catch (Exception ex)
            {
                return Results.NotFound(new { message = ex.Message });
            }
        });

        // DELETE: /api/categories/{id}
        route.MapDelete("/{id:int}", async (int id, ICategoryService service) =>
        {
            try
            {
                var deleted = await service.DeleteAsync(id);
                return Results.Ok(new { success = deleted });
            }
            catch (Exception ex)
            {
                return Results.NotFound(new { message = ex.Message });
            }
        });

        return app;
    }
}
