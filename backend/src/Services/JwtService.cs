using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

public class JwtService(ILogger<AuthService> logger)
{
    public string SignJWT(List<Claim> claims)
    {
        var issuer = Environment.GetEnvironmentVariable("ASPNETCORE_URLS")?.Trim().Trim('"');
        var audience = Environment.GetEnvironmentVariable("FRONTEND_URL")?.Trim().Trim('"');
        var key = Environment.GetEnvironmentVariable("SECRET_KEY")?.Trim().Trim('"');
        if (string.IsNullOrEmpty(key))
        {
            logger.LogError("Not found SECRET_KEY");
            throw new InvalidOperationException("SECRET_KEY environment variable is not set.");
        }
        var exp = Environment.GetEnvironmentVariable("EXP");
        var tokenDes = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(exp ?? "30")),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDes);
        var accessToken = tokenHandler.WriteToken(token);
        return accessToken;
    }
}