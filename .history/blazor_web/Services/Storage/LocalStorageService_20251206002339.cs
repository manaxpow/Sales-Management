using System.Text.Json;
using blazor_web.DTOs.Auth;
using Microsoft.JSInterop;

namespace blazor_web.Services.Storage
{
    public class LocalStorageService : ILocalStorageService
    {
        private readonly IJSRuntime _jsRuntime;
        private const string LOGIN_INFO_KEY = "loginInfo";

        public LocalStorageService(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async Task SetItemAsync(string key, string value)
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", key, value);
        }

        public async Task<string?> GetItemAsync(string key)
        {
            return await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", key);
        }

        public async Task RemoveItemAsync(string key)
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", key);
        }

        public async Task ClearAsync()
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.clear");
        }

        public async Task SetLoginInfoAsync(LoginResponse loginResponse)
        {
            var json = JsonSerializer.Serialize(loginResponse);
            await SetItemAsync(LOGIN_INFO_KEY, json);
        }

        public async Task<LoginResponse?> GetLoginInfoAsync()
        {
            var json = await GetItemAsync(LOGIN_INFO_KEY);
            if (string.IsNullOrEmpty(json))
                return null;

            try
            {
                return JsonSerializer.Deserialize<LoginResponse>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch
            {
                return null;
            }
        }

        public async Task RemoveLoginInfoAsync()
        {
            await RemoveItemAsync(LOGIN_INFO_KEY);
        }

        public async Task<bool> IsLoggedInAsync()
        {
            var loginInfo = await GetLoginInfoAsync();
            return loginInfo != null && !string.IsNullOrEmpty(loginInfo.AccessToken);
        }
    }
}
