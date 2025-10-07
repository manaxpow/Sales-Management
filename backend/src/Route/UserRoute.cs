
public static class UserRoute
{
    public static IEndpointRouteBuilder MapUserEndPoint(this IEndpointRouteBuilder group)
    {
        group.MapGet("/users", () => "hello users");
        // another route
        return group;


    }

}
