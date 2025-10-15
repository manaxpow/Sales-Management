



using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

public class AuthService(AppDbContext context, ILogger<AuthService> logger) : IAuthServices
{
    private readonly ApiResponse<LoginResponse> response = new();
    private readonly JwtService _jwtHelper = new(context, logger);
    public async Task<ApiResponse<LoginResponse>> Login(LoginRequest loginRequest)
    {
        var user = await context.Users
          .FirstOrDefaultAsync(u => u.UserName == loginRequest.UserName);
        if (user == null)
        {
            logger.LogError($"Error login");
            return response.ErrorResponse("Tên đăng nhập hoặc mật khẩu không đúng", 400);
        }
        if (user.Password != loginRequest.Password)
        {
            logger.LogError($"Error login");
            return response.ErrorResponse("Tên đăng nhập hoặc mật khẩu không đúng", 400);
        }
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName),
            new(ClaimTypes.Role, user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        var accessToken = _jwtHelper.SignJWT(claims);
        var UserRes = new UserResponse
        {
            Id = user.Id,
            UserName = user.UserName,
            FullName = user.FullName,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
        var Data = new LoginResponse
        {
            User = UserRes,
            AccessToken = accessToken
        };
        // return user info or token
        return response.SuccessResponse(Data, "Login success");

    }
}