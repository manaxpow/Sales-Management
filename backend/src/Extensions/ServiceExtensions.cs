
using System.Reflection;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

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
            options.UseMySql(connnectionString, new MySqlServerVersion(new Version(8, 0, 11)));
        });


        // Adding validators from the current assembly
        // builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        builder.Services.AddScoped<IBookService, BookService>();

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

        builder.Services.AddProblemDetails();

        // builder.Services.AddValidatorsFromAssemblyContaining<CreateBookValidator>();
        

    }
}
