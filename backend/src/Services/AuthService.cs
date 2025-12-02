



using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

public class AuthService(AppDbContext context, ILogger<AuthService> logger) : IAuthServices
{
    private readonly ApiResponse<LoginResponse> response = new();
    private readonly JwtService _jwtHelper = new(logger);
    public async Task<ApiResponse<LoginResponse>> Login(LoginRequest loginRequest)
    {
        var user = await context.Users
          .FirstOrDefaultAsync(u => u.UserName == loginRequest.UserName);
        if (user == null)
        {
            logger.LogError($"Error login");
            return response.ErrorResponse("Tên đăng nhập hoặc mật khẩu không đúng", 400);
        }

        if (!AuthHelpers.VerifyPassword(user, loginRequest.Password))
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

        var CustomerRes = new CustomerResponse();
        if (user.Role == "customer")
        {
            CustomerRes = new CustomerResponse
            {
                Id = user.Id,
                Name = user.FullName,
                Email = user.UserName,
                Phone = user.UserName,
                Address = user.UserName,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }

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
            Customer = CustomerRes,
            AccessToken = accessToken
        };
        // return user info or token
        return response.SuccessResponse(Data, "Login success");

    }

    public async Task<ApiResponse<int>> Register(RegisterRequest registerRequest)
    {
        ApiResponse<int> registerRes = new();

        // check email exist
        var isEmail = await context.Customers.FirstOrDefaultAsync(u => u.Email == registerRequest.Email);
        if (isEmail != null)
        {
            return registerRes.ErrorResponse("Email already exists", 400);
        }
        // check username exist
        var isUsername = await context.Users.FirstOrDefaultAsync(u => u.UserName == registerRequest.UserName);
        if (isUsername != null)
        {
            return registerRes.ErrorResponse("Username already exists", 400);
        }
        // check phone exist
        var isPhone = await context.Customers.FirstOrDefaultAsync(u => u.Phone == registerRequest.Phone);
        if (isPhone != null)
        {
            return registerRes.ErrorResponse("Phone already exists", 400);
        }
        
        var user = new Users
        {
            UserName = registerRequest.UserName,
            Password = AuthHelpers.HashPassword(null, registerRequest.Password),
            FullName = registerRequest.FullName,
            Role = "customer",
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        var customer = new Customers
        {
            UserId = user.Id,
            Name = registerRequest.FullName,
            Email = registerRequest.Email,
            Phone = registerRequest.Phone,
            Address = registerRequest.Address,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        context.Users.Add(user);
        context.Customers.Add(customer);
        await context.SaveChangesAsync();

        return registerRes.SuccessResponse(1, "Register success");
    }
}
