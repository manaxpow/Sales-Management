using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public static class AuthHelpers
{
    private static readonly PasswordHasher<Users> hasher = new();

    public static bool VerifyPassword(Users user, string providedPassword)
    {
        var result = hasher.VerifyHashedPassword(user, user.Password, providedPassword);
        return result == PasswordVerificationResult.Success
               || result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}
