using Microsoft.EntityFrameworkCore;

public static class SupplierSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Nếu chưa có dữ liệu thì mới thêm
        if (!await context.Suppliers.AnyAsync())
        {
            context.Suppliers.AddRange(
                new Suppliers
                {
                    Id = 1,
                    Name = "Công ty ABC",
                    Phone = "0909123456",
                    Email = "abc@gmail.com",
                    Address = "Hà Nội"
                },
                new Suppliers
                {
                    Id = 2,
                    Name = "Công ty XYZ",
                    Phone = "0912123456",
                    Email = "xyz@gmail.com",
                    Address = "TP HCM"
                },
                new Suppliers
                {
                    Id = 3,
                    Name = "Công ty 123",
                    Phone = "0933123456",
                    Email = "123@gmail.com",
                    Address = "Đà Nẵng"
                }
            );

            await context.SaveChangesAsync();
        }
    }
}
