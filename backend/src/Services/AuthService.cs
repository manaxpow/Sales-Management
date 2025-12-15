



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

        CustomerResponse CustomerRes = new CustomerResponse();
        if (user.Role != null && user.Role.Equals("customer", StringComparison.OrdinalIgnoreCase))
        {
            var customer = await context.Customers
                .FirstOrDefaultAsync(c => c.UserId == user.Id);
            Console.WriteLine($"Customer {user.Id}");

            if (customer != null)
            {
                CustomerRes = new CustomerResponse
                {
                    Id = customer.CustomerId,
                    Name = customer.Name ?? user.FullName,
                    Email = customer.Email ?? user.UserName,
                    Phone = customer.Phone,
                    Address = customer.Address,
                    CreatedAt = customer.CreatedAt,
                    UpdatedAt = customer.UpdatedAt
                };
            }
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
        Console.WriteLine($"CustomerRes {CustomerRes}");
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

        using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            var user = new Users
            {
                UserName = registerRequest.UserName,
                Password = AuthHelpers.HashPassword(null, registerRequest.Password),
                FullName = registerRequest.FullName,
                Role = "customer",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            context.Users.Add(user);

            await context.SaveChangesAsync();

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

            context.Customers.Add(customer);

            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            return registerRes.SuccessResponse(user.Id, "Register success");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return registerRes.ErrorResponse("Registration failed: " + ex.Message, 500);
        }
    }

    public async Task<ApiResponse<bool>> ChangePassword(ChangePasswordRequest changePasswordRequest)
    {
        ApiResponse<bool> response = new();

        try
        {
            // Find user by ID
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Id == changePasswordRequest.UserId);
            
            if (user == null)
            {
                logger.LogError($"User with ID {changePasswordRequest.UserId} not found");
                return response.ErrorResponse("User not found", 404);
            }

            // Verify current password
            if (!AuthHelpers.VerifyPassword(user, changePasswordRequest.Password))
            {
                logger.LogError($"Invalid current password for user ID {changePasswordRequest.UserId}");
                return response.ErrorResponse("Current password is incorrect", 400);
            }

            // Check if new password is the same as current password
            if (AuthHelpers.VerifyPassword(user, changePasswordRequest.NewPassword))
            {
                return response.ErrorResponse("New password must be different from current password", 400);
            }

            // Update password
            user.Password = AuthHelpers.HashPassword(null, changePasswordRequest.NewPassword);
            user.UpdatedAt = DateTime.Now;

            await context.SaveChangesAsync();

            logger.LogInformation($"Password changed successfully for user ID {changePasswordRequest.UserId}");
            return response.SuccessResponse(true, "Password changed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error changing password for user ID {changePasswordRequest.UserId}");
            return response.ErrorResponse("Failed to change password: " + ex.Message, 500);
        }
    }
}
