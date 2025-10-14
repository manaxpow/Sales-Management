
public static class Configuration
{
    // This method will encompass the registration of all services in the dependency injection container.
    public static void RegisterServices(this WebApplicationBuilder builder)
    {
        builder.Services
               .AddEndpointsApiExplorer();

    }
    public static void RegisterMiddlewares(this WebApplication app)
    {
        // app.UseHttpsRedirection();
    }
}
