using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

public class JwtService(AppDbContext context, ILogger<AuthService> logger)
{
    public string SignJWT(List<Claim> claims)
    {
        var issuer = Environment.GetEnvironmentVariable("ASPNETCORE_URLS"); // phat hanh
        var audience = Environment.GetEnvironmentVariable("FRONTEND_URL"); //nhan

        var key = Environment.GetEnvironmentVariable("SECRET_KEY");
        logger.LogInformation($"Issuer: {issuer}, Audience: {audience}, Key: {key}");
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

