using blazor_web.Models;
using blazor_web.DTOs.User;

namespace blazor_web.Services.User
{
    public interface IUserService
    {
        Task<ApiResponse<GetUserResponse>> GetAllUsersAsync(GetUserRequest request);

        Task<ApiResponse<UserResponse>> GetUserByIdAsync(int id);

        Task<ApiResponse<UserResponse>> CreateUserAsync(CreateUserRequest newUser);

        Task<ApiResponse<UserResponse>> UpdateUserAsync(int id, UpdateUserRequest updatedUser);

        Task<ApiResponse<string>> DeleteUserAsync(int id);
    }
}