
using DotNetEnv;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var applicationUrl = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "http://localhost:5050";
builder.WebHost.UseUrls(applicationUrl);
builder.AddApplicationServices();
builder.Services.AddCorsPolicy(builder.Configuration);


var app = builder.Build();
app.UseCorsPolicy();

app.RegisterMiddlewares();
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var ex = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        var response = new ErrorResponse
        {
            Title = "Binding Error",
            Message = ex?.Message ?? "Unexpected error",
            StatusCode = 400
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 400;
        await context.Response.WriteAsJsonAsync(response);
    });
});


Routes.Map(app);

app.Run();
