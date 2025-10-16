
public interface IAuthServices
{
    Task<ApiResponse<LoginResponse>> Login(LoginRequest loginRequest);
}
