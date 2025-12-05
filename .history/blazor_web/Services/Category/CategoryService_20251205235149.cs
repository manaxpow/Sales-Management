using blazor_web.Models;           // ApiResponse<T>
using System.Net.Http.Json;

namespace blazor_web.Services.Category;

public class CategoryService
{
    private readonly HttpClient _http;

    public CategoryService(HttpClient http) => _http = http;

    public async Task<ApiResponse<List<CategoryResponse>>> GetAll()
    {
        try
        {
            var result = await _http.GetFromJsonAsync<ApiResponse<List<CategoryResponse>>>("api/category");
            return result ?? new ApiResponseWrapper<List<CategoryResponse>> { Success = false, Message = "Không có dữ liệu" };
        }
        catch
        {
            return new ApiResponseWrapper<List<CategoryResponse>> { Success = false, Message = "Lỗi kết nối" };
        }
    }

    public async Task<ApiResponse<CategoryResponse>> Create(CategoryCreateRequest req)
    {
        var response = await _http.PostAsJsonAsync("api/category", req);
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<CategoryResponse>>();
        return result ?? new ApiResponseWrapper<CategoryResponse> { Success = false, Message = "Tạo thất bại" };
    }

    public async Task<ApiResponse<CategoryResponse>> Update(int id, CategoryCreateRequest req)
    {
        var response = await _http.PutAsJsonAsync($"api/category/{id}", req);
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<CategoryResponse>>();
        return result ?? new ApiResponseWrapper<CategoryResponse> { Success = false, Message = "Cập nhật thất bại" };
    }

    public async Task<ApiResponse> Delete(int id)
    {
        var response = await _http.DeleteAsync($"api/category/{id}");
        var result = await response.Content.ReadFromJsonAsync<ApiResponse>();
        return result ?? new ApiResponseWrapper { Success = false, Message = "Xóa thất bại" };
    }
}

public record CategoryCreateRequest(string Name);
public record CategoryResponse(int Id, string Name);