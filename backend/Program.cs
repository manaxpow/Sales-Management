
using DotNetEnv;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var applicationUrl = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "http://localhost:5050";
builder.WebHost.UseUrls(applicationUrl);
builder.AddApplicationServices();
builder.Services.AddCorsPolicy(builder.Configuration);


var app = builder.Build();

app.RegisterMiddlewares();


Routes.Map(app);

app.Run();
