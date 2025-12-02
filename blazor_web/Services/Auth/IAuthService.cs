using blazor_web.Dtos.Auth;
using blazor_web.Models;
using DTOs.Auth;

namespace blazor_web.Services.Auth
{
    public interface IAuthService
    {
        Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
        Task<ApiResponse<int>> RegisterAsync(RegisterRequest request);
    }
}
