
public class Routes
{
    public static void Map(WebApplication app)
    {

        app.MapGroup("/api").DisableAntiforgery()
        .WithTags("Public endpoints")
        .MapUserEndPoint()
        .MapCustomerEndPoint()
        .MapAuthEndPoint()
        .MapCategoryEndpoint()
        .MapPromotionEndPoint()
        .MapOrderEndPoint()
        .MapProductEndponit()
        .MapOrderItemEndPoint()
        .MapSupplierEndPoint()
        .MapPaymentEndPoint()
        .MapInventoryEndPoint();
    }
}
