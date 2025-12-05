using blazor_web.Models;         
using System.Net.Http.Json;

namespace blazor_web.Services.Category;

public class CategoryService
{
    private readonly HttpClient _http;

    public CategoryService(HttpClient http) => _http = http;

    public async Task<ApiResponse<List<CategoryResponse>>> GetAll()
    {
        var result = await _http.GetFromJsonAsync<ApiResponse<List<CategoryResponse>>>("api/category");
        return result ?? new ApiResponse<List<CategoryResponse>>
        {
            Success = false,
            Message = "Không có dữ liệu",
            Data = null!
        };
    }

    public async Task<ApiResponse<CategoryResponse>> Create(CategoryCreateRequest req)
    {
        var response = await _http.PostAsJsonAsync("api/category", req);
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<CategoryResponse>>();
        return result ?? new ApiResponse<CategoryResponse>
        {
            Success = false,
            Message = "Tạo thất bại",
            Data = null!
        };
    }

    public async Task<ApiResponse<CategoryResponse>> Update(int id, CategoryCreateRequest req)
    {
        var response = await _http.PutAsJsonAsync($"api/category/{id}", req);
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<CategoryResponse>>();
        return result ?? new ApiResponse<CategoryResponse>
        {
            Success = false,
            Message = "Cập nhật thất bại",
            Data = null!
        };
    }

    public async Task<ApiResponse<object>> Delete(int id)
    {
        var response = await _http.DeleteAsync($"api/category/{id}");
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<object>>();
        return result ?? new ApiResponse<object>
        {
            Success = false,
            Message = "Xóa thất bại",
            Data = null!
        };
    }
}

public record CategoryCreateRequest(string Name);
public record CategoryResponse(int Id, string Name);