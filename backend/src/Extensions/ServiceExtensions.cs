
using System.Reflection;
using System.Text;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


public static class ServiceExtensions
{
    // configure the application's request processing pipeline.
    public static void AddApplicationServices(this IHostApplicationBuilder builder)
    {
        if (builder == null) throw new ArgumentNullException(nameof(builder));
        if (builder.Configuration == null) throw new ArgumentNullException(nameof(builder.Configuration));

        var connnectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

        // Adding the database context
        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            // fix cung sua lai
            options.UseMySql(connnectionString, ServerVersion.AutoDetect(connnectionString));
        });


        // Adding validators from the current assembly
        builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // scoped services
        builder.Services.AddScoped<IAuthServices, AuthService>();
        builder.Services.AddScoped<IBookService, BookService>();
        builder.Services.AddScoped<JwtService>();
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET_KEY")))
        };
    });
    }
}
