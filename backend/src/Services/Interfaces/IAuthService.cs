
public interface IAuthServices
{
    Task<ApiResponse<LoginResponse>> Login(LoginRequest loginRequest);
    Task<ApiResponse<int>> Register(RegisterRequest registerRequest);
    Task<ApiResponse<bool>> ChangePassword(ChangePasswordRequest changePasswordRequest);
}
