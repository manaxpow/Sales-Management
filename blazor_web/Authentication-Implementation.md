# Blazor Authentication Implementation

This document describes the complete frontend authentication implementation for Blazor Server application.

## Overview

The authentication system provides:
- User login/logout functionality
- Role-based access control (Admin/Staff)
- Protected routes with automatic redirection
- Local storage-based session management
- Authentication state management
- Loading indicators during authentication process

## Key Components

### 1. Authentication State Provider
**File:** `Services/Auth/AuthenticationStateProvider.cs`

Custom authentication state provider that:
- Reads user data from local storage
- Creates ClaimsPrincipal with user information
- Provides authentication state notifications
- Handles role-based access checking with case-insensitive comparison

### 2. Route Protection
**File:** `Components/Auth/ProtectedRoute.razor`

Reusable component that:
- Wraps content requiring authentication
- Validates user roles with support for multiple roles
- Redirects unauthorized users to login with return URL
- Shows access denied for insufficient permissions
- Displays loading spinner during authentication verification

### 3. Loading Spinner Component
**File:** `Components/UI/LoadingSpinner.razor`

Reusable loading component that:
- Shows centered spinner with overlay
- Configurable loading message
- Professional styling with Tailwind CSS
- Used throughout authentication process

### 4. Authentication Services
- **IAuthService:** Interface for authentication operations
- **AuthService:** Implementation for API calls
- **ILocalStorageService:** Local storage management
- **LocalStorageService:** Browser localStorage interaction

### 5. Login/Logout Pages
- **Login:** `/auth/login` and `/login` routes with loading state
- **Logout:** `/logout` route
- **RedirectToLogin:** Automatic redirect component
- **AccessDenied:** `/access-denied` route
- **AuthTest:** `/auth-test` route for testing authentication

## Complete Route Protection

### Admin Routes (Admin Only)
- `/admin` - Admin dashboard with loading spinner during auth check
- All pages under `/admin/*` require admin role
- Automatic redirection to login for unauthorized access
- Access denied page for insufficient permissions

### Staff Routes (Staff & Admin)
- `/staff` - Staff dashboard with loading spinner during auth check
- All pages under `/staff/*` require staff or admin role
- Automatic redirection to login for unauthorized access
- Access denied page for insufficient permissions

### Public Routes
- `/` - Home page (no authentication required)
- `/auth/login` - Login page (public)
- `/register` - Registration page (public)
- `/access-denied` - Access denied page (public)
- `/auth-test` - Authentication test page (shows auth status)

## Enhanced Authentication Flow

### Login Process with Loading States
1. User submits credentials on `/auth/login`
2. **Loading State**: "Signing in..." spinner appears
3. AuthService calls API with form data
4. On success, login response stored in localStorage
5. AuthenticationStateProvider notified of user authentication
6. User redirected based on role with loading indicator:
   - Admin → `/admin`
   - Staff → `/staff`
   - Default → `/`

### Logout Process
1. User clicks logout (navigate to `/logout`)
2. Logout component clears localStorage
3. AuthenticationStateProvider notified of logout
4. User redirected to login page

### Comprehensive Route Protection
1. User accesses protected route (any `/admin/*` or `/staff/*`)
2. **Loading State**: "Checking authentication..." spinner appears
3. ProtectedRoute component validates authentication and roles
4. Route resolution:
   - Not authenticated → redirect to `/auth/login`
   - Authenticated but wrong role → redirect to `/access-denied`
   - Authenticated with correct role → render protected content

## Usage Examples

### Protecting a Page
```razor
@page "/admin/dashboard"
@using blazor_web.Components.Auth

<ProtectedRoute RequiredRoles="admin">
    <!-- Admin only content with automatic loading -->
</ProtectedRoute>
```

### Protecting Staff Pages (Multiple Roles)
```razor
@page "/staff/sale"
@using blazor_web.Components.Auth

<ProtectedRoute RequiredRoles="admin,staff">
    <!-- Staff or Admin content with automatic loading -->
</ProtectedRoute>
```

### Checking Authentication in Code
```csharp
@inject AuthenticationStateProvider AuthenticationStateProvider

@code {
    private async Task CheckAuth() {
        if (AuthenticationStateProvider is CustomAuthenticationStateProvider provider) {
            var isAuth = await provider.IsUserAuthenticatedAsync();
            var role = await provider.GetUserRoleAsync();
            // Use authentication state with loading indicators
        }
    }
}
```

### Using AuthorizeView with Loading
```razor
<AuthorizeView Roles="admin,staff">
    <Authorizing>
        <LoadingSpinner Message="Verifying permissions..." />
    </Authorizing>
    <Authorized>
        <!-- Content for authenticated users -->
    </Authorized>
    <NotAuthorized>
        <!-- Content for unauthenticated users -->
    </NotAuthorized>
</AuthorizeView>
```

## Configuration

### Program.cs Setup
```csharp
// Add authentication services
builder.Services.AddScoped<AuthenticationStateProvider, CustomAuthenticationStateProvider>();
builder.Services.AddAuthorizationCore();

// Register other services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ILocalStorageService, LocalStorageService>();
```

## Security Features

### Local Storage Security
- Login data stored securely in localStorage
- Access tokens included for API calls
- Automatic cleanup on logout
- Session persistence across browser sessions

### Role-Based Access
- Claims-based role checking
- Case-insensitive role comparison
- Multiple role support
- Automatic access denied for wrong roles

### Route Protection
- Server-side and client-side validation
- Automatic redirection for unauthorized access
- Safe handling of authentication state during prerendering
- Loading indicators prevent content flash

### Enhanced User Experience
- Loading spinners during all authentication operations
- Smooth transitions between authentication states
- Clear visual feedback for user actions
- Professional styling consistent across application

## Testing

### Authentication Test Page
Visit `/auth-test` to:
- View current authentication status with loading states
- Test user information display
- Verify role-based access
- Test protected routes with proper loading indicators

### Manual Testing Steps
1. Access `/admin` without authentication → loading spinner → redirect to login
2. Login as admin → loading spinner → redirect to `/admin`
3. Access `/staff` as admin → loading spinner → should work
4. Access `/admin` as staff → loading spinner → access denied
5. Logout → redirect to login
6. Access `/admin` after logout → loading spinner → redirect to login

## Error Handling

### Common Issues
- **LocalStorage not available**: Check browser compatibility
- **API connection failure**: Verify API server running
- **Role not recognized**: Check role casing in backend
- **Redirect loops**: Clear browser localStorage
- **Loading states**: Ensure smooth transitions without content flash

### Debug Information
Console logging enabled for:
- Authentication state changes with loading indicators
- Login/logout operations
- Route protection decisions
- API call results and loading states

## Browser Compatibility

The implementation uses:
- Local Storage API (modern browsers)
- JavaScript Interop (Blazor Server)
- Claims-based authentication (standard)
- Loading states with proper lifecycle management

Works with all modern browsers supporting localStorage.

## Route Protection Implementation Details

### Global Route Handling
The main `Routes.razor` component now properly handles route protection:

```razor
@inject NavigationManager NavigationManager

<CascadingAuthenticationState>
    <Router AppAssembly="@typeof(Program).Assembly">
        <Found Context="routeData">
            @{
                var currentPath = NavigationManager.ToBaseRelativePath(NavigationManager.Uri);
            }
            @if (currentPath.StartsWith("/admin", StringComparison.OrdinalIgnoreCase))
            {
                // Admin routes - require admin role
                <ProtectedRoute RequiredRoles="admin" RedirectUrl="/auth/login">
                    <RouteView RouteData="@routeData" DefaultLayout="@typeof(Layout.Admin.AdminLayout)" />
                </ProtectedRoute>
            }
            else if (currentPath.StartsWith("/staff", StringComparison.OrdinalIgnoreCase))
            {
                // Staff routes - require staff or admin role
                <ProtectedRoute RequiredRoles="admin,staff" RedirectUrl="/auth/login">
                    <RouteView RouteData="@routeData" DefaultLayout="@typeof(Layout.Staff.StaffLayout)" />
                </ProtectedRoute>
            }
            else
            {
                // Public routes - no authentication required
                <RouteView RouteData="@routeData" DefaultLayout="@typeof(Layout.Main.MainLayout)" />
            }
            <FocusOnNavigate RouteData="@routeData" Selector="h1" />
        </Found>
        <NotFound>
            <PageTitle>Not found</PageTitle>
            <LayoutView Layout="@typeof(Layout.Main.MainLayout)">
                <p role="alert">Sorry, there's nothing at this address.</p>
            </LayoutView>
        </NotFound>
    </Router>
</CascadingAuthenticationState>
```

This ensures:
- **ALL** Admin routes (`/admin/*`) are protected with admin role requirement
- **ALL** Staff routes (`/staff/*`) are protected with staff/admin role requirement
- **Consistent** loading states across all authentication operations
- **Automatic** redirection for unauthorized access
- **Proper** layout assignment based on route type

## Future Enhancements

Potential improvements:
- Token refresh mechanism with loading states
- Remember me functionality with loading indicators
- Multi-factor authentication
- Session timeout handling with loading states
- Audit logging

## No-Content-Flicker Authentication

### Enhanced ProtectedRoute Component
The ProtectedRoute component now prevents ANY content rendering until authentication is fully verified:

```razor
@if (isInitialized)
{
    if (isAuthenticated)
    {
        if (hasRequiredRole)
        {
            @ChildContent
        }
        else
        {
            <AccessDenied />
        }
    }
    else
    {
        // Redirect unauthorized users
    }
}
else
{
    // Show loading spinner until authentication is complete
    <LoadingSpinner Message="Checking authentication..." />
}
```

### No Content Flash Implementation
1. **Initialization State**: `isInitialized = false` → Only loading spinner visible
2. **Authentication Check**: Complete verification before setting `isInitialized = true`
3. **Conditional Rendering**: Content only renders after authentication AND role verification
4. **Error Handling**: Any authentication errors default to unauthenticated state

### Layout Cleanup
- **Removed redundant `[Authorize]` attributes** from AdminLayout and StaffLayout
- **Prevents layout-level authentication conflicts** with route-level protection
- **Ensures single point of authentication control** via ProtectedRoute

## Loading State Management

The implementation now includes comprehensive loading indicators with no content flash:
1. **Route-level loading**: "Checking authentication..." during verification
2. **Login process loading**: "Signing in..." during credential submission  
3. **Component-level loading**: During API calls and state changes
4. **Smooth transitions**: No content flash between states
5. **User feedback**: Clear indication of ongoing processes
6. **No flicker**: Protected content never renders before authentication complete
