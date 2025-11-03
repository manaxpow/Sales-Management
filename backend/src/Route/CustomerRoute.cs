
public static class CustomerRoute
{
    public static IEndpointRouteBuilder MapCustomerEndPoint(this IEndpointRouteBuilder group)
    {
        var userRoute = group.MapGroup("/customers").WithTags("Customers");

        userRoute.MapGet("/", async (ICustomerService service,[AsParameters] GetCustomerRequest request) => {
            var result = await service.GetAllCustomer(request);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapGet("/{id:int}", async (int id, ICustomerService service) => {
            var result = await service.GetCustomerById(id);
            return result.Success ? Results.Ok(result) : Results.NotFound(result);
        });

        userRoute.MapPost("/", async ([AsParameters] CreateCustomerRequest newUser, ICustomerService service) => {
            var result = await service.CreateCustomer(newUser);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapPut("/{id:int}", async (int id,[AsParameters] UpdateCustomerRequest updatedUser, ICustomerService service) => {
            var result = await service.UpdateCustomer(id, updatedUser);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapDelete("/{id:int}", async (int id, ICustomerService service) => {
            var result = await service.DeleteCustomer(id);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        return group;
    }

}
