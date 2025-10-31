
public class Routes
{
    public static void Map(WebApplication app)
    {

        app.MapGroup("/api").DisableAntiforgery()
        .WithTags("Public endpoints")
        .MapBookEndPoint()
        .MapUserEndPoint()
        .MapAuthEndPoint()
        .MapCategoryEndpoint()
        .MapPromotionEndPoint()
        .MapSupplierEndPoint()
        ;

    }
}
