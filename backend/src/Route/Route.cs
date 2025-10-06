
public class Routes
{
    public static void Map(WebApplication app)
    {

        app.MapGroup("/api")
        .WithTags("Public endpoints")
        .MapBookEndPoint()
        .MapUserEndPoint();

    }
}
