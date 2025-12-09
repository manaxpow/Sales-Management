public static class UserRoute
{
    public static IEndpointRouteBuilder MapUserEndPoint(this IEndpointRouteBuilder group)
    {
        var userRoute = group.MapGroup("/users").WithTags("Users");

        userRoute.MapGet("/", async (IUserService service, [AsParameters] GetUserRequest request) =>
        {
            var result = await service.GetAllUsers(request);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapGet("/{id:int}", async (int id, IUserService service) =>
        {
            var result = await service.GetUserById(id);
            return result.Success ? Results.Ok(result) : Results.NotFound(result);
        });

        userRoute.MapPost("/", async (CreateUserRequest request, IUserService service) =>
        {
            var result = await service.CreateUser(request);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapPut("/{id:int}", async (int id, UpdateUserRequest request, IUserService service) =>
        {
            var result = await service.UpdateUser(id, request);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapDelete("/{id:int}", async (int id, IUserService service) =>
        {
            var result = await service.DeleteUser(id);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        return group;
    }
}