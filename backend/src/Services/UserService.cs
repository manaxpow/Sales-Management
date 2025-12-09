using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<GetUserResponse>> GetAllUsers(GetUserRequest request)
    {
        var query = _context.Users.AsQueryable();

        query = query.Where(u => u.Role != "Admin");

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchTerm = request.Search.Trim();
            query = query.Where(u => u.UserName.Contains(searchTerm) ||
                                     u.FullName.Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            query = query.Where(u => u.Role == request.Role);
        }

        var totalRecords = await query.CountAsync();

        int page = request.Page ?? 1;
        int limit = request.Limit ?? 10;
        if (page < 1) page = 1;

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
            })
            .ToListAsync();

        var responseData = new GetUserResponse
        {
            Users = users,
            Total = totalRecords,
            Page = page,
            Limit = limit
        };

        return new ApiResponse<GetUserResponse>
        {
            Success = true,
            Data = responseData,
            Message = "Lấy danh sách thành công"
        };
    }

    public async Task<ApiResponse<UserResponse>> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return new ApiResponse<UserResponse>
            {
                Success = false,
                Message = "User not found"
            };
        }

        var response = new UserResponse
        {
            Id = user.Id,
            UserName = user.UserName,
            FullName = user.FullName,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
        };

        return new ApiResponse<UserResponse>
        {
            Success = true,
            Data = response
        };
    }

    public async Task<ApiResponse<UserResponse>> CreateUser(CreateUserRequest newUserRequest)
    {
        var isDuplicate = await _context.Users.AnyAsync(u => u.UserName == newUserRequest.UserName);
        if (isDuplicate)
        {
            return new ApiResponse<UserResponse>
            {
                Success = false,
                Message = "Tên đăng nhập đã tồn tại."
            };
        }

        var newUserEntity = new Users
        {
            UserName = newUserRequest.UserName,
            FullName = newUserRequest.FullName,
            Role = string.IsNullOrEmpty(newUserRequest.Role) ? "Staff" : newUserRequest.Role,
            CreatedAt = DateTime.UtcNow,
        };

        var hasher = new PasswordHasher<Users>();
        newUserEntity.Password = hasher.HashPassword(newUserEntity, newUserRequest.Password);

        _context.Users.Add(newUserEntity);
        await _context.SaveChangesAsync();

        var response = new UserResponse
        {
            Id = newUserEntity.Id,
            UserName = newUserEntity.UserName,
            FullName = newUserEntity.FullName,
            Role = newUserEntity.Role,
            CreatedAt = newUserEntity.CreatedAt,
        };

        return new ApiResponse<UserResponse>
        {
            Success = true,
            Data = response,
            Message = "Tạo nhân viên thành công"
        };
    }

    public async Task<ApiResponse<UserResponse>> UpdateUser(int id, UpdateUserRequest updatedUserRequest)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return new ApiResponse<UserResponse>
            {
                Success = false,
                Message = "User not found"
            };
        }

        var usernameExists = await _context.Users
            .AnyAsync(u => u.UserName == user.UserName && u.Id != id);

        if (usernameExists)
        {
            return new ApiResponse<UserResponse>
            {
                Success = false,
                Message = "Tên đăng nhập đã được sử dụng bởi người khác."
            };
        }

        user.FullName = updatedUserRequest.FullName;

        if (!string.IsNullOrEmpty(updatedUserRequest.Role))
        {
            user.Role = updatedUserRequest.Role;
        }

        if (!string.IsNullOrEmpty(updatedUserRequest.Password))
        {
            var hasher = new PasswordHasher<Users>();
            user.Password = hasher.HashPassword(user, updatedUserRequest.Password);
        }

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var response = new UserResponse
        {
            Id = user.Id,
            UserName = user.UserName,
            FullName = user.FullName,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
        };

        return new ApiResponse<UserResponse>
        {
            Success = true,
            Data = response,
            Message = "Cập nhật thành công"
        };
    }

    public async Task<ApiResponse<string>> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return new ApiResponse<string>
            {
                Success = false,
                Message = "User not found"
            };
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return new ApiResponse<string>
        {
            Success = true,
            Message = "Xóa nhân viên thành công"
        };
    }
}