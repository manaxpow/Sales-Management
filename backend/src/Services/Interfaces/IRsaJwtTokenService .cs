public sealed class JwtOptions
{
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string SecretKey { get; set; } = null!;
    public int ExpiryMinutes { get; set; } = 60;
}

public interface IJwtTokenService
{
    (string accessToken, DateTimeOffset expires) CreateAccessToken(string userId, string userName, IEnumerable<string> roles, IDictionary<string, string>? custom = null);
    (string refreshToken, DateTimeOffset expires, string id) CreateRefreshToken(string userId);
}