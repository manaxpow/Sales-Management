using Microsoft.EntityFrameworkCore;

public class UserService : IUserService {
    private readonly AppDbContext _context;

    public UserService(AppDbContext context) {
        _context = context;
    }

    public async Task<ApiResponse<IEnumerable<UserResponse>>> GetAllUsers(string? username, string? fullname) {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(username))
            query = query.Where(u => u.UserName.Contains(username));

        if (!string.IsNullOrEmpty(fullname))
            query = query.Where(u => u.FullName.Contains(fullname));

        var users = await query
            .Select(u => new UserResponse {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<UserResponse>>().SuccessResponse(users, "Fetched users successfully");
    }

    public async Task<ApiResponse<UserResponse>> GetUserById(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return new ApiResponse<UserResponse>().ErrorResponse("User not found");

        var response = new UserResponse {
            Id = user.Id,
            UserName = user.UserName,
            FullName = user.FullName,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        return new ApiResponse<UserResponse>().SuccessResponse(response);
    }

    public async Task<ApiResponse<UserResponse>> UpdateUser(int id, Users updatedUser) {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return new ApiResponse<UserResponse>().ErrorResponse("User not found");

        user.FullName = updatedUser.FullName;
        user.Role = updatedUser.Role;
        user.UserName = updatedUser.UserName;
        user.UpdatedAt = DateTime.Now;

        if (!string.IsNullOrEmpty(updatedUser.Role))
            user.Role = updatedUser.Role;

        await _context.SaveChangesAsync();

        var response = new UserResponse {
            Id = user.Id,
            UserName = user.UserName,
            FullName = user.FullName,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        return new ApiResponse<UserResponse>().SuccessResponse(response, "Updated user successfully");
    }

    public async Task<ApiResponse<string>> DeleteUser(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return new ApiResponse<string>().ErrorResponse("User not found");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return new ApiResponse<string>().SuccessResponse("Deleted user successfully");
    }

    public async Task<ApiResponse<UserResponse>> CreateUser(Users newUser) {
        // Kiểm tra trùng username
        var exist = await _context.Users.AnyAsync(u => u.UserName == newUser.UserName);
        if (exist)
            return new ApiResponse<UserResponse>().ErrorResponse("Username already exists");

        newUser.CreatedAt = DateTime.Now;
        newUser.UpdatedAt = DateTime.Now;

        if (string.IsNullOrEmpty(newUser.Role))
            newUser.Role = "staff";

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        var response = new UserResponse {
            Id = newUser.Id,
            UserName = newUser.UserName,
            FullName = newUser.FullName,
            Role = newUser.Role,
            CreatedAt = newUser.CreatedAt,
            UpdatedAt = newUser.UpdatedAt
        };

        return new ApiResponse<UserResponse>().SuccessResponse(response, "Created user successfully");
    }

}
