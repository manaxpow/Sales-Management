public static class CorsExtension
{
    private const string PolicyName = "AllowFrontend";

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";
        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy.WithOrigins(frontendUrl)
                      .AllowAnyHeader()
                       .AllowCredentials()
                      .AllowAnyMethod();
            });
        });

        return services;
    }

    public static IApplicationBuilder UseCorsPolicy(this IApplicationBuilder app)
    {
        app.UseCors(PolicyName);
        return app;
    }
}