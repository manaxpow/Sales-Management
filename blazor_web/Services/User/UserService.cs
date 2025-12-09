using System.Net.Http.Json;
using System.Text.Json;
using blazor_web.DTOs.User;
using blazor_web.Models;

namespace blazor_web.Services.User
{
    public class UserService : IUserService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UserService> _logger;

        public UserService(HttpClient httpClient, ILogger<UserService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        // 1. GET ALL
        public async Task<ApiResponse<GetUserResponse>> GetAllUsersAsync(GetUserRequest request)
        {
            try
            {
                var queryParams = new List<string>();

                if (request.Page.HasValue) queryParams.Add($"page={request.Page}");
                if (request.Limit.HasValue) queryParams.Add($"limit={request.Limit}");
                if (!string.IsNullOrEmpty(request.Search)) queryParams.Add($"search={Uri.EscapeDataString(request.Search)}");
                if (!string.IsNullOrEmpty(request.Role)) queryParams.Add($"role={Uri.EscapeDataString(request.Role)}");

                var queryString = queryParams.Any() ? $"?{string.Join("&", queryParams)}" : "";
                var url = $"users{queryString}";

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<GetUserResponse>(response, "Get user list");
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<GetUserResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<GetUserResponse> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in GetAllUsersAsync: {ex.Message}");
                return new ApiResponse<GetUserResponse> { Success = false, Message = ex.Message };
            }
        }

        // 2. GET BY ID
        public async Task<ApiResponse<UserResponse>> GetUserByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"users/{id}");

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<UserResponse>(response, "Get user by id");
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<UserResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<UserResponse> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in GetUserByIdAsync: {ex.Message}");
                return new ApiResponse<UserResponse> { Success = false, Message = ex.Message };
            }
        }

        // 3. CREATE (SỬA LẠI: Dùng JSON thay vì MultipartForm)
        public async Task<ApiResponse<UserResponse>> CreateUserAsync(CreateUserRequest newUser)
        {
            try
            {
                // SỬA Ở ĐÂY: Dùng PostAsJsonAsync để gửi application/json
                var response = await _httpClient.PostAsJsonAsync("users", newUser);

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<UserResponse>(response, "Create user");
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<UserResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<UserResponse> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in CreateUserAsync: {ex.Message}");
                return new ApiResponse<UserResponse> { Success = false, Message = ex.Message };
            }
        }

        // 4. UPDATE (SỬA LẠI: Dùng JSON thay vì MultipartForm)
        public async Task<ApiResponse<UserResponse>> UpdateUserAsync(int id, UpdateUserRequest updatedUser)
        {
            try
            {
                // SỬA Ở ĐÂY: Dùng PutAsJsonAsync để gửi application/json
                var response = await _httpClient.PutAsJsonAsync($"users/{id}", updatedUser);

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<UserResponse>(response, "Update user");
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<UserResponse>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<UserResponse> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in UpdateUserAsync: {ex.Message}");
                return new ApiResponse<UserResponse> { Success = false, Message = ex.Message };
            }
        }

        // 5. DELETE
        public async Task<ApiResponse<string>> DeleteUserAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"users/{id}");

                if (!response.IsSuccessStatusCode)
                {
                    return await HandleErrorResponse<string>(response, "Delete user");
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<string>>(new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? new ApiResponse<string> { Success = false, Message = "No data received" };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in DeleteUserAsync: {ex.Message}");
                return new ApiResponse<string> { Success = false, Message = ex.Message };
            }
        }

        // Helper Error Handler
        private async Task<ApiResponse<T>> HandleErrorResponse<T>(HttpResponseMessage response, string actionName)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError($"{actionName} API failed with status {response.StatusCode}: {errorContent}");

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var apiError = JsonSerializer.Deserialize<ApiResponse<T>>(errorContent, options);

                var errorMessage = apiError?.Message;
                if (string.IsNullOrEmpty(errorMessage))
                {
                    errorMessage = $"{actionName} failed (HTTP {response.StatusCode})";
                }

                return new ApiResponse<T>
                {
                    Success = false,
                    Message = errorMessage
                };
            }
            catch
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Message = $"{actionName} failed. Server returned: {response.StatusCode}"
                };
            }
        }
    }
}