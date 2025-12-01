using blazor_web.Dtos.Auth;

namespace blazor_web.Services.Storage
{
    public interface ILocalStorageService
    {
        Task SetItemAsync(string key, string value);
        Task<string?> GetItemAsync(string key);
        Task RemoveItemAsync(string key);
        Task ClearAsync();
        
        // Specific methods for auth
        Task SetLoginInfoAsync(LoginResponse loginResponse);
        Task<LoginResponse?> GetLoginInfoAsync();
        Task RemoveLoginInfoAsync();
        Task<bool> IsLoggedInAsync();
    }
}
