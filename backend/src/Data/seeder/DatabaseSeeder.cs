public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await UserSeeder.SeedAsync(context);
        await CategorySeeder.SeedAsync(context);
        await SupplierSeeder.SeedAsync(context);
        await ProductSeeder.SeedAsync(context);
        await InventorySeeder.SeedAsync(context);
        await PromotionSeeder.SeedAsync(context);
        // Nếu có thêm seeder khác, thêm ở đây
    }
}