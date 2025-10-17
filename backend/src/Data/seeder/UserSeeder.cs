using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public static class UserSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var hasher = new PasswordHasher<Users>();
        var passhash = hasher.HashPassword(new Users(), "123456");
        if (!await context.Users.AnyAsync())
        {
            context.Users.AddRange(
                new Users { UserName = "admin", FullName = "Administrator", Role = 1, Password = passhash },
                new Users { UserName = "namnguyen", Password = passhash, FullName = "nam nguyen", Role = 1 }
            );
            await context.SaveChangesAsync();
        }
    }
}
