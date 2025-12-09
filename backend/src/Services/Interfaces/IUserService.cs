public interface IUserService
{
    Task<ApiResponse<GetUserResponse>> GetAllUsers(GetUserRequest request);
    Task<ApiResponse<UserResponse>> GetUserById(int id);
    Task<ApiResponse<UserResponse>> UpdateUser(int id, UpdateUserRequest updatedUser);
    Task<ApiResponse<string>> DeleteUser(int id);
    Task<ApiResponse<UserResponse>> CreateUser(CreateUserRequest newUser);
}
