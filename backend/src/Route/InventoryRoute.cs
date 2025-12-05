using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

public static class InventoryRoute
{
    public static IEndpointRouteBuilder MapInventoryEndPoint(this IEndpointRouteBuilder group)
    {
        var InventoryRoute = group.MapGroup("/inventory").WithTags("Inventory");

        InventoryRoute.MapGet("/", async ([AsParameters] GetInventoryRequest inventoryRequest, IInventoryService inventoryService) =>
        {
            var inventory = await inventoryService.GetInventory(inventoryRequest);
            return Results.Ok(inventory);

        });

        InventoryRoute.MapPut("/{Id}", async ([FromRoute] int Id, [FromBody] UpdateQuantityRequest updateQuantityRequest, IInventoryService inventoryService, IValidator<UpdateQuantityRequest> validator) =>
        {
            ValidationResult validationResult = validator.Validate(updateQuantityRequest);
            if (!validationResult.IsValid)
            {
                return Results.BadRequest(validationResult.Errors);
            }
            var response = await inventoryService.UpdateQuantity(Id, updateQuantityRequest);
            return Results.Ok(response);
        });
        return group;
    }
}

