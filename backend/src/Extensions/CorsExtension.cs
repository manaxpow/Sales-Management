public static class CorsExtension
{
    private const string PolicyName = "AllowFrontend";

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";
        var blazorUrl = Environment.GetEnvironmentVariable("BLAZOR_URL") ?? "http://localhost:8081";
        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy.WithOrigins(frontendUrl)
                      .AllowAnyHeader()
                       .AllowCredentials()
                      .AllowAnyMethod();
            });

            options.AddPolicy("AllowBlazor", policy =>
            {
                policy.WithOrigins(blazorUrl)
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
        app.UseCors("AllowBlazor");
        return app;
    }
}