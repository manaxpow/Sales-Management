
using System.Reflection;
using System.Text;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SRC.Services.Interfaces;


public static class ServiceExtensions
{
    // configure the application's request processing pipeline.
    public static void AddApplicationServices(this IHostApplicationBuilder builder)
    {
        if (builder == null) throw new ArgumentNullException(nameof(builder));
        if (builder.Configuration == null) throw new ArgumentNullException(nameof
        (builder.Configuration));
        var secretKey = Environment.GetEnvironmentVariable("SECRET_KEY");
        if (string.IsNullOrEmpty(secretKey))
            throw new InvalidOperationException("SECRET_KEY environment variable is not set.");
        var connnectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

        // Adding the database context
        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            options.UseMySql(connnectionString, ServerVersion.AutoDetect(connnectionString));
        });


        // Adding validators from the current assembly
        builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // scoped services
        builder.Services.AddScoped<IAuthServices, AuthService>();
        builder.Services.AddScoped<IBookService, BookService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IPromotionService, PromotionService>();
        builder.Services.AddScoped<JwtService>();
        builder.Services.AddScoped<ICategoryService, SRC.Services.CategoryService>();
        builder.Services.AddScoped<IOrderService, OrderService>();
        builder.Services.AddScoped<IOrderItemService, OrderItemService>();

        // global error handler
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddProblemDetails();
        
        // jwt
        builder.Services.AddAuthorization();
        builder.Services.AddAuthentication();
        builder.Services.AddAuthentication("Bearer")

    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Environment.GetEnvironmentVariable("ASPNETCORE_URLS"),
            ValidAudience = Environment.GetEnvironmentVariable("FRONTEND_URL"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });
    }
}