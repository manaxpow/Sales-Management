
using backend.src.Contract.Auth;
using backend.src.Contract.Auth.Response;

public interface IAuthServices
{
    Task<ApiResponse<LoginResponse>> Login(LoginRequest loginRequest);
}
