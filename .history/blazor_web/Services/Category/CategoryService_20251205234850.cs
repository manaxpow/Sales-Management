using blazor_web.Models; 
using System.Net.Http.Json;

namespace blazor_web.Services.Category;

public class CategoryService
{
    private readonly HttpClient _http;

    public CategoryService(HttpClient http)
    {
        _http = http;
    }

    public async Task<ApiResponse<List<CategoryResponse>>> GetAll()
    {
        try
        {
            return await _http.GetFromJsonAsync<ApiResponse<List<CategoryResponse>>>("api/category")
                   ?? new ApiResponse<List<CategoryResponse>> { Success = false, Message = "No data" };
        }
        catch
        {
            return new ApiResponse<List<CategoryResponse>> { Success = false, Message = "Lỗi kết nối" };
        }
    }

    public async Task<ApiResponse<CategoryResponse>> Create(CategoryCreateRequest req)
    {
        var response = await _http.PostAsJsonAsync("api/category", req);
        return await response.Content.ReadFromJsonAsync<ApiResponse<CategoryResponse>>()
               ?? new ApiResponse<CategoryResponse> { Success = false };
    }

    public async Task<ApiResponse<CategoryResponse>> Update(int id, CategoryCreateRequest req)
    {
        var response = await _http.PutAsJsonAsync($"api/category/{id}", req);
        return await response.Content.ReadFromJsonAsync<ApiResponse<CategoryResponse>>()
               ?? new ApiResponse<CategoryResponse> { Success = false };
    }

    public async Task<ApiResponse> Delete(int id)
    {
        var response = await _http.DeleteAsync($"api/category/{id}");
        return await response.Content.ReadFromJsonAsync<ApiResponse>()
               ?? new ApiResponse { Success = false };
    }
}

public record CategoryCreateRequest(string Name);
public record CategoryResponse(int Id, string Name);