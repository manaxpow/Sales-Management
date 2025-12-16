using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;
using blazor_web.Services.Storage;
using Microsoft.JSInterop;

namespace blazor_web.Services.Auth
{
    public class CustomAuthenticationStateProvider : AuthenticationStateProvider
    {
        private readonly ILocalStorageService _localStorageService;
        private readonly IJSRuntime _jsRuntime;
        private ClaimsPrincipal _currentUser = new ClaimsPrincipal(new ClaimsIdentity());

        public CustomAuthenticationStateProvider(
            ILocalStorageService localStorageService,
            IJSRuntime jsRuntime)
        {
            _localStorageService = localStorageService;
            _jsRuntime = jsRuntime;
        }

        public override async Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            try
            {
                // Check if we're in a prerendering context where JSInterop is not available
                // In Blazor Server with InteractiveServer render mode, this should work
                var loginInfo = await _localStorageService.GetLoginInfoAsync();

                if (loginInfo != null && !string.IsNullOrEmpty(loginInfo.AccessToken))
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, loginInfo.User.UserName),
                        new Claim(ClaimTypes.NameIdentifier, loginInfo.User.Id.ToString()),
                        new Claim(ClaimTypes.Role, loginInfo.User.Role)
                    };

                    var identity = new ClaimsIdentity(claims, "jwt");
                    _currentUser = new ClaimsPrincipal(identity);

                    return new AuthenticationState(_currentUser);
                }
            }
            catch (InvalidOperationException)
            {
                // JSInterop not available during prerendering - return unauthenticated state
                // This will be updated when the component becomes interactive
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAuthenticationStateAsync: {ex.Message}");
            }

            // Return unauthenticated user
            _currentUser = new ClaimsPrincipal(new ClaimsIdentity());
            return new AuthenticationState(_currentUser);
        }

        public async Task MarkUserAsAuthenticated()
        {
            try
            {
                var loginInfo = await _localStorageService.GetLoginInfoAsync();
                if (loginInfo != null && !string.IsNullOrEmpty(loginInfo.AccessToken))
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, loginInfo.User.UserName),
                        new Claim(ClaimTypes.NameIdentifier, loginInfo.User.Id.ToString()),
                        new Claim(ClaimTypes.Role, loginInfo.User.Role)
                    };

                    var identity = new ClaimsIdentity(claims, "jwt");
                    _currentUser = new ClaimsPrincipal(identity);

                    NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in MarkUserAsAuthenticated: {ex.Message}");
            }
        }

        public void MarkUserAsLoggedOut()
        {
            _currentUser = new ClaimsPrincipal(new ClaimsIdentity());
            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
        }
    }
}
