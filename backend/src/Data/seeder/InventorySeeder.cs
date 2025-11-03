
using Microsoft.EntityFrameworkCore;

public static class InventorySeeder
{

    public static async Task SeedAsync(AppDbContext context)
    {
        if (!await context.Inventory.AnyAsync())
            context.Inventory.AddRange(
        new Inventory { InventoryId = 1, ProductId = 1, Quantity = 25 },
        new Inventory { InventoryId = 2, ProductId = 2, Quantity = 169 },
        new Inventory { InventoryId = 3, ProductId = 3, Quantity = 77 },
        new Inventory { InventoryId = 4, ProductId = 4, Quantity = 169 },
        new Inventory { InventoryId = 5, ProductId = 5, Quantity = 90 },
        new Inventory { InventoryId = 6, ProductId = 6, Quantity = 105 },
        new Inventory { InventoryId = 7, ProductId = 7, Quantity = 125 },
        new Inventory { InventoryId = 8, ProductId = 8, Quantity = 37 },
        new Inventory { InventoryId = 9, ProductId = 9, Quantity = 74 },
        new Inventory { InventoryId = 10, ProductId = 10, Quantity = 149 },
        new Inventory { InventoryId = 11, ProductId = 11, Quantity = 69 },
        new Inventory { InventoryId = 12, ProductId = 12, Quantity = 23 },
        new Inventory { InventoryId = 13, ProductId = 13, Quantity = 46 },
        new Inventory { InventoryId = 14, ProductId = 14, Quantity = 144 },
        new Inventory { InventoryId = 15, ProductId = 15, Quantity = 134 },
        new Inventory { InventoryId = 16, ProductId = 16, Quantity = 182 },
        new Inventory { InventoryId = 17, ProductId = 17, Quantity = 99 },
        new Inventory { InventoryId = 18, ProductId = 18, Quantity = 72 },
        new Inventory { InventoryId = 19, ProductId = 19, Quantity = 128 },
        new Inventory { InventoryId = 20, ProductId = 20, Quantity = 123 },
        new Inventory { InventoryId = 21, ProductId = 21, Quantity = 155 },
        new Inventory { InventoryId = 22, ProductId = 22, Quantity = 78 },
        new Inventory { InventoryId = 23, ProductId = 23, Quantity = 166 },
        new Inventory { InventoryId = 24, ProductId = 24, Quantity = 117 },
        new Inventory { InventoryId = 25, ProductId = 25, Quantity = 168 },
        new Inventory { InventoryId = 26, ProductId = 26, Quantity = 197 },
        new Inventory { InventoryId = 27, ProductId = 27, Quantity = 36 },
        new Inventory { InventoryId = 28, ProductId = 28, Quantity = 145 },
        new Inventory { InventoryId = 29, ProductId = 29, Quantity = 61 },
        new Inventory { InventoryId = 30, ProductId = 30, Quantity = 139 },
        new Inventory { InventoryId = 31, ProductId = 31, Quantity = 47 },
        new Inventory { InventoryId = 32, ProductId = 32, Quantity = 154 },
        new Inventory { InventoryId = 33, ProductId = 33, Quantity = 194 },
        new Inventory { InventoryId = 34, ProductId = 34, Quantity = 41 },
        new Inventory { InventoryId = 35, ProductId = 35, Quantity = 154 },
        new Inventory { InventoryId = 36, ProductId = 36, Quantity = 71 },
        new Inventory { InventoryId = 37, ProductId = 37, Quantity = 49 },
        new Inventory { InventoryId = 38, ProductId = 38, Quantity = 165 },
        new Inventory { InventoryId = 39, ProductId = 39, Quantity = 73 },
        new Inventory { InventoryId = 40, ProductId = 40, Quantity = 176 },
        new Inventory { InventoryId = 41, ProductId = 41, Quantity = 41 },
        new Inventory { InventoryId = 42, ProductId = 42, Quantity = 34 },
        new Inventory { InventoryId = 43, ProductId = 43, Quantity = 175 },
        new Inventory { InventoryId = 44, ProductId = 44, Quantity = 59 }
            );
        await context.SaveChangesAsync();
    }
}



