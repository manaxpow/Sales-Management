using blazor_web.DTOs.Auth;
using blazor_web.Services.Storage;
using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;

namespace blazor_web.Services.Auth
{
    public class CustomAuthenticationStateProvider : AuthenticationStateProvider
    {
        private readonly ILocalStorageService _localStorageService;
        private ClaimsPrincipal _anonymous = new ClaimsPrincipal(new ClaimsIdentity());

        public CustomAuthenticationStateProvider(ILocalStorageService localStorageService)
        {
            _localStorageService = localStorageService;
        }

        public override async Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            try
            {
                var loginInfo = await _localStorageService.GetLoginInfoAsync();
                
                if (loginInfo?.User == null || string.IsNullOrEmpty(loginInfo.AccessToken))
                {
                    return new AuthenticationState(_anonymous);
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, loginInfo.User.UserName),
                    new Claim(ClaimTypes.NameIdentifier, loginInfo.User.Id.ToString()),
                    new Claim(ClaimTypes.Role, loginInfo.User.Role.ToLowerInvariant()),
                    new Claim("FullName", loginInfo.User.FullName),
                    new Claim("AccessToken", loginInfo.AccessToken)
                };

                var identity = new ClaimsIdentity(claims, "custom");
                var user = new ClaimsPrincipal(identity);

                return new AuthenticationState(user);
            }
            catch
            {
                return new AuthenticationState(_anonymous);
            }
        }

        public async Task NotifyUserAuthentication(LoginResponse loginResponse)
        {
            await _localStorageService.SetLoginInfoAsync(loginResponse);
            var authState = await GetAuthenticationStateAsync();
            NotifyAuthenticationStateChanged(Task.FromResult(authState));
        }

        public async Task NotifyUserLogout()
        {
            await _localStorageService.RemoveLoginInfoAsync();
            var authState = new AuthenticationState(_anonymous);
            NotifyAuthenticationStateChanged(Task.FromResult(authState));
        }

        public async Task<bool> IsUserInRoleAsync(string role)
        {
            var authState = await GetAuthenticationStateAsync();
            return authState.User.IsInRole(role);
        }

        public async Task<string?> GetUserRoleAsync()
        {
            var authState = await GetAuthenticationStateAsync();
            return authState.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        }

        public async Task<bool> IsUserAuthenticatedAsync()
        {
            var authState = await GetAuthenticationStateAsync();
            return authState.User.Identity?.IsAuthenticated == true;
        }
    }
}
