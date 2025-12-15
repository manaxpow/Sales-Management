using System.Text.Json;
using blazor_web.DTOs.Auth;
using blazor_web.Models;

namespace blazor_web.Services.Auth {
    public class AuthService : IAuthService {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            HttpClient httpClient,
            ILogger<AuthService> logger) {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request) {
            try {
                Console.WriteLine($"=== AuthService.LoginAsync called ===");
                Console.WriteLine($"HttpClient BaseAddress: {_httpClient.BaseAddress}");
                Console.WriteLine($"Calling login API for user: {request.Username}");

                using var formData = new MultipartFormDataContent();

                if (!string.IsNullOrEmpty(request.Username)) {
                    Console.WriteLine($"Adding username: {request.Username}");
                    formData.Add(new StringContent(request.Username), "Username");
                }

                if (!string.IsNullOrEmpty(request.Password)) {
                    Console.WriteLine($"Adding password: [length {request.Password.Length}]");
                    formData.Add(new StringContent(request.Password), "Password");
                }
                Console.WriteLine($"Making POST request to: auth/login (as form-data)");

                var response = await _httpClient.PostAsync("auth/login", formData);
                Console.WriteLine($"Response status code: {response.StatusCode}");

                // handle API response
                if (!response.IsSuccessStatusCode) {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Login API failed with status {response.StatusCode}: {errorContent}");

                    try {
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var apiErrorResponse = JsonSerializer.Deserialize<ApiResponse<LoginResponse>>(errorContent, options);

                        return new ApiResponse<LoginResponse> {
                            Success = false,
                            Message = apiErrorResponse?.Message ?? $"Login failed (HTTP {response.StatusCode})."
                        };
                    } catch (JsonException ex) {
                        Console.WriteLine($"JsonException: {ex.Message}");
                        return new ApiResponse<LoginResponse> {
                            Success = false,
                            Message = $"Login failed. Server returned an unexpected error (HTTP {response.StatusCode}). Details: {ex.Message}"
                        };
                    }
                }

                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>(new JsonSerializerOptions {
                    PropertyNameCaseInsensitive = true
                });

                if (successfulApiResponse == null || !successfulApiResponse.Success || successfulApiResponse.Data == null) {
                    return new ApiResponse<LoginResponse> {
                        Success = false,
                        Message = successfulApiResponse?.Message ?? "Login failed: API returned success status but missing data."
                    };
                }

                var loginResponse = successfulApiResponse.Data;

                Console.WriteLine($"Login successful for user: {loginResponse.User?.UserName}");
                Console.WriteLine($"Access token received: {!string.IsNullOrEmpty(loginResponse.AccessToken)}");

                return successfulApiResponse;
            } catch (HttpRequestException ex) {
                Console.WriteLine($"HttpRequestException: {ex.Message}");
                _logger.LogError($"Login API error: {ex.Message}");

                return new ApiResponse<LoginResponse> {
                    Success = false,
                    Message = $"Network error: {ex.Message}. Please check if API server is running at {_httpClient.BaseAddress}"
                };
            } catch (Exception ex) {
                Console.WriteLine($"Exception: {ex.Message}");
                _logger.LogError($"Unexpected error in LoginAsync: {ex.Message}");

                return new ApiResponse<LoginResponse> {
                    Success = false,
                    Message = $"An unexpected error occurred: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<int>> RegisterAsync(RegisterRequest request) {
            try {
                Console.WriteLine($"=== AuthService.RegisterAsync called ===");
                Console.WriteLine($"HttpClient BaseAddress: {_httpClient.BaseAddress}");
                Console.WriteLine($"Calling register API for user: {request.Username}");

                using var formData = new MultipartFormDataContent();

                if (!string.IsNullOrEmpty(request.Username)) {
                    Console.WriteLine($"Adding username: {request.Username}");
                    formData.Add(new StringContent(request.Username), "Username");
                }

                if (!string.IsNullOrEmpty(request.FullName)) {
                    Console.WriteLine($"Adding fullName: {request.FullName}");
                    formData.Add(new StringContent(request.FullName), "FullName");
                }

                if (!string.IsNullOrEmpty(request.Email)) {
                    Console.WriteLine($"Adding email: {request.Email}");
                    formData.Add(new StringContent(request.Email), "Email");
                }

                formData.Add(new StringContent(request.Phone ?? string.Empty), "Phone");
                formData.Add(new StringContent(request.Address ?? string.Empty), "Address");

                if (!string.IsNullOrEmpty(request.Password)) {
                    Console.WriteLine($"Adding password: [length {request.Password.Length}]");
                    formData.Add(new StringContent(request.Password), "Password");
                }

                Console.WriteLine($"Making POST request to: auth/register");

                var response = await _httpClient.PostAsync("auth/register", formData);
                Console.WriteLine($"Response status code: {response.StatusCode}");

                // handle API
                if (!response.IsSuccessStatusCode) {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Register API failed with status {response.StatusCode}: {errorContent}");

                    try {
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var apiErrorResponse = JsonSerializer.Deserialize<ApiResponse<int>>(errorContent, options);

                        return new ApiResponse<int> {
                            Success = false,
                            Message = apiErrorResponse?.Message ?? $"Registration failed (HTTP {response.StatusCode})."
                        };
                    } catch (JsonException) {
                        return new ApiResponse<int> {
                            Success = false,
                            Message = $"Registration failed. Server returned an unexpected error (HTTP {response.StatusCode})."
                        };
                    }
                }

                return new ApiResponse<int> {
                    Success = true,
                    Data = 1,
                    Message = "Registration successful."
                };
            } catch (HttpRequestException ex) {
                Console.WriteLine($"HttpRequestException: {ex.Message}");
                _logger.LogError($"Register API error: {ex.Message}");
                return new ApiResponse<int> {
                    Success = false,
                    Message = $"Network error: {ex.Message}. Please check if API server is running at {_httpClient.BaseAddress}"
                };
            } catch (Exception ex) {
                Console.WriteLine($"Exception: {ex.Message}");
                _logger.LogError($"Unexpected error in RegisterAsync: {ex.Message}");
                return new ApiResponse<int> {
                    Success = false,
                    Message = $"An unexpected error occurred: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<bool>> ChangePasswordAsync(ChangePasswordRequest request)
        {
            try
            {
                Console.WriteLine($"=== AuthService.ChangePasswordAsync called ===");
                Console.WriteLine($"HttpClient BaseAddress: {_httpClient.BaseAddress}");
                Console.WriteLine($"Calling change password API for user ID: {request.UserId}");

                using var formData = new MultipartFormDataContent();

                formData.Add(new StringContent(request.UserId.ToString()), "UserId");

                if (!string.IsNullOrEmpty(request.Password))
                {
                    Console.WriteLine($"Adding current password: [length {request.Password.Length}]");
                    formData.Add(new StringContent(request.Password), "Password");
                }

                if (!string.IsNullOrEmpty(request.NewPassword))
                {
                    Console.WriteLine($"Adding new password: [length {request.NewPassword.Length}]");
                    formData.Add(new StringContent(request.NewPassword), "NewPassword");
                }

                Console.WriteLine($"Making POST request to: auth/change-password");

                var response = await _httpClient.PostAsync("auth/change-password", formData);
                Console.WriteLine($"Response status code: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Change password API failed with status {response.StatusCode}: {errorContent}");

                    try
                    {
                        // Try to parse as validation error array first
                        using var doc = JsonDocument.Parse(errorContent);
                        
                        if (doc.RootElement.ValueKind == JsonValueKind.Array)
                        {
                            var errors = new List<string>();
                            foreach (var item in doc.RootElement.EnumerateArray())
                            {
                                if (item.TryGetProperty("message", out var messageProp))
                                {
                                    errors.Add(messageProp.GetString() ?? "");
                                }
                            }
                            
                            if (errors.Any())
                            {
                                return new ApiResponse<bool>
                                {
                                    Success = false,
                                    Message = string.Join("; ", errors)
                                };
                            }
                        }
                        else
                        {
                            // Try to parse as ApiResponse
                            var errorApiResponse = JsonSerializer.Deserialize<ApiResponse<bool>>(errorContent, new JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true
                            });

                            if (errorApiResponse != null && !string.IsNullOrEmpty(errorApiResponse.Message))
                            {
                                return new ApiResponse<bool>
                                {
                                    Success = false,
                                    Message = errorApiResponse.Message
                                };
                            }
                        }
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError($"Failed to parse error response: {ex.Message}");
                    }

                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Đổi mật khẩu thất bại. Vui lòng thử lại."
                    };
                }

                var successfulApiResponse = await response.Content.ReadFromJsonAsync<ApiResponse<bool>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (successfulApiResponse == null || !successfulApiResponse.Success)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = successfulApiResponse?.Message ?? "Change password failed: API returned success status but missing data."
                    };
                }

                Console.WriteLine($"Password changed successfully");
                return successfulApiResponse;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"HttpRequestException: {ex.Message}");
                _logger.LogError($"Change password API error: {ex.Message}");
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Network error: {ex.Message}. Please check if API server is running at {_httpClient.BaseAddress}"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                _logger.LogError($"Unexpected error in ChangePasswordAsync: {ex.Message}");
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"An unexpected error occurred: {ex.Message}"
                };
            }
        }
    }
}