public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await UserSeeder.SeedAsync(context);
        // Nếu có thêm seeder khác, thêm ở đây
    }
}