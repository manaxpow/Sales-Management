using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;

namespace blazor_web.Components.Base
{
    public abstract class AuthorizedComponentBase : ComponentBase
    {
        [Inject]
        protected AuthenticationStateProvider? AuthenticationStateProvider { get; set; }

        [Inject]
        protected NavigationManager? NavigationManager { get; set; }

        [Parameter]
        public string? RequiredRole { get; set; }

        [Parameter]
        public string[]? RequiredRoles { get; set; }

        protected override async Task OnInitializedAsync()
        {
            if (AuthenticationStateProvider != null && NavigationManager != null)
            {
                var authState = await AuthenticationStateProvider.GetAuthenticationStateAsync();
                var user = authState.User;

                if (!user.Identity?.IsAuthenticated ?? true)
                {
                    // Not authenticated - redirect to login
                    NavigationManager.NavigateTo("/login", true);
                    return;
                }

                // Check roles if specified
                if (!string.IsNullOrEmpty(RequiredRole))
                {
                    if (!user.IsInRole(RequiredRole))
                    {
                        // User doesn't have required role
                        NavigationManager.NavigateTo("/", true);
                        return;
                    }
                }
                else if (RequiredRoles != null && RequiredRoles.Length > 0)
                {
                    var hasRole = false;
                    foreach (var role in RequiredRoles)
                    {
                        if (user.IsInRole(role))
                        {
                            hasRole = true;
                            break;
                        }
                    }

                    if (!hasRole)
                    {
                        // User doesn't have any of the required roles
                        NavigationManager.NavigateTo("/", true);
                        return;
                    }
                }
            }

            await base.OnInitializedAsync();
        }
    }
}
