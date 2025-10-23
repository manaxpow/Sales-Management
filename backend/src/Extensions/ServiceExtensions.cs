using System.Reflection;
using System.Text;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text.Json.Serialization;
using SRC.Services;
using SRC.Services.Interfaces;

public static class ServiceExtensions
{
    public static void AddApplicationServices(this IHostApplicationBuilder builder)
    {

        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

        if (builder == null) throw new ArgumentNullException(nameof(builder));
        if (builder.Configuration == null) throw new ArgumentNullException(nameof(builder.Configuration));

        var secretKey = Environment.GetEnvironmentVariable("SECRET_KEY")
    ?? builder.Configuration["Jwt:SecretKey"];

        if (string.IsNullOrEmpty(secretKey))
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("⚠️  SECRET_KEY not found. Using temporary development key.");
            Console.ResetColor();

            secretKey = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }

        var connnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connnectionString))
            throw new InvalidOperationException("Connection string 'DefaultConnection' is not found in appsettings.json or configuration.");


        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            options.UseMySql(connnectionString, ServerVersion.AutoDetect(connnectionString));
        });

        builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // scoped services
        builder.Services.AddScoped<IAuthServices, AuthService>();
        builder.Services.AddScoped<IBookService, BookService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<JwtService>();
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddProblemDetails();
        builder.Services.AddScoped<ICategoryService, CategoryService>();

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