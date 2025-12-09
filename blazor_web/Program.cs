using blazor_web.Services.Auth;
using blazor_web.Services.Storage;
using blazor_web.Services.Category;
using blazor_web.Services.Cart;
using blazor_web.Services.Orders;
using blazor_web.Services.Customer;
using Blazored.Toast;
using blazor_web.Components;
using blazor_web.Services.Supplier;
using blazor_web.Services.Product;
using blazor_web.Services.User;
using blazor_web.Services.Inventory;
using blazor_web.Services.Customer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddScoped<CategoryService>();
var configuration = builder.Configuration;
var apiBaseUrl = configuration["Api:Url"]
                 ?? "http://localhost:8081/api/";

builder.Services.AddScoped(sp =>
{
    var handler = new HttpClientHandler();

    // Bypass SSL chỉ trong development
    if (builder.Environment.IsDevelopment())
    {
        handler.ServerCertificateCustomValidationCallback =
            HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
    }

    return new HttpClient(handler)
    {
        BaseAddress = new Uri(apiBaseUrl),
        Timeout = TimeSpan.FromSeconds(30)
    };
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddScoped<ILocalStorageService, LocalStorageService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<ISupplierService, SupplierService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddBlazoredToast();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore/hsts.
    app.UseHsts();
}

// Remove HTTPS redirection to avoid the warning
// app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
