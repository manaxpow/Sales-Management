public interface IUserService {
    Task<ApiResponse<IEnumerable<UserResponse>>> GetAllUsers(string? username, string? fullname);
    Task<ApiResponse<UserResponse>> GetUserById(int id);
    Task<ApiResponse<UserResponse>> UpdateUser(int id, Users updatedUser);
    Task<ApiResponse<string>> DeleteUser(int id);
    Task<ApiResponse<UserResponse>> CreateUser(Users newUser);
}
