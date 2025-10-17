
public static class UserRoute
{
    public static IEndpointRouteBuilder MapUserEndPoint(this IEndpointRouteBuilder group)
    {
        var userRoute = group.MapGroup("/users").WithTags("Users");

        userRoute.MapGet("/", async (IUserService service, string? username, string? fullname) => {
            var result = await service.GetAllUsers(username, fullname);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapGet("/{id:int}", async (int id, IUserService service) => {
            var result = await service.GetUserById(id);
            return result.Success ? Results.Ok(result) : Results.NotFound(result);
        });

        userRoute.MapPost("/", async (Users newUser, IUserService service) => {
            var result = await service.CreateUser(newUser);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapPut("/{id:int}", async (int id, Users updatedUser, IUserService service) => {
            var result = await service.UpdateUser(id, updatedUser);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        userRoute.MapDelete("/{id:int}", async (int id, IUserService service) => {
            var result = await service.DeleteUser(id);
            return result.Success ? Results.Ok(result) : Results.BadRequest(result);
        });

        return group;
    }

}
