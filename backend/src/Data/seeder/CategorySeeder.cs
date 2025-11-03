
using Microsoft.EntityFrameworkCore;

public static class CategorySeeder
{

    public static async Task SeedAsync(AppDbContext context)
    {
        if (!await context.Categories.AnyAsync())
            context.Categories.AddRange(
                new Categories { CategoryName = "Đồ uống" },
                new Categories { CategoryName = "Bánh kẹo" },
                new Categories { CategoryName = "Gia vị" },
                new Categories { CategoryName = "Đồ gia dụng" },
                new Categories { CategoryName = "Mỹ phẩm" }

            );
        await context.SaveChangesAsync();
    }
}



