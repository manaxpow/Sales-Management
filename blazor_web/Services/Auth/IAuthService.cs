using blazor_web.Dtos.Auth;
using blazor_web.Models;
using blazor_web.Dtos.Auth;

namespace blazor_web.Services.Auth
{
    public interface IAuthService
    {
        Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
        Task<ApiResponse<int>> RegisterAsync(RegisterRequest request);
    }
}
