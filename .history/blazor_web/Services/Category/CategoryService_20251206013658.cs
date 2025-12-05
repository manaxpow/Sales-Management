using blazor_web.Models;         
using System.Net.Http.Json;
using System.Text.Json.Serialization; // Cần thiết để map tên trường JSON

namespace blazor_web.Services.Category;

public class CategoryService
{
    private readonly HttpClient _http;

    public CategoryService(HttpClient http) => _http = http;

    // 1. GET ALL
    public async Task<ApiResponse<List<CategoryResponse>>> GetAll()
    {
        try
        {
            // Backend trả về mảng [], hứng bằng List<CategoryResponse>
            var data = await _http.GetFromJsonAsync<List<CategoryResponse>>("categories");

            return new ApiResponse<List<CategoryResponse>>
            {
                Success = true,
                Message = "Lấy dữ liệu thành công",
                Data = data ?? new List<CategoryResponse>()
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return new ApiResponse<List<CategoryResponse>>
            {
                Success = false,
                Message = "Lỗi kết nối hoặc sai định dạng dữ liệu",
                Data = new List<CategoryResponse>()
            };
        }
    }

    // 2. CREATE
    public async Task<ApiResponse<CategoryResponse>> Create(CategoryCreateRequest req)
    {
        try
        {
            var response = await _http.PostAsJsonAsync("categories", req);
            
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadFromJsonAsync<CategoryResponse>();
                return new ApiResponse<CategoryResponse>
                {
                    Success = true,
                    Data = data!
                };
            }

            return new ApiResponse<CategoryResponse> { Success = false, Message = "Tạo thất bại (Backend trả lỗi)" };
        }
        catch
        {
            return new ApiResponse<CategoryResponse> { Success = false, Message = "Lỗi kết nối" };
        }
    }

    // 3. UPDATE
    public async Task<ApiResponse<CategoryResponse>> Update(int id, CategoryCreateRequest req)
    {
        try
        {
            var response = await _http.PutAsJsonAsync($"categories/{id}", req);
            
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadFromJsonAsync<CategoryResponse>();
                return new ApiResponse<CategoryResponse>
                {
                    Success = true,
                    Data = data!
                };
            }
            return new ApiResponse<CategoryResponse> { Success = false, Message = "Cập nhật thất bại" };
        }
        catch
        {
             return new ApiResponse<CategoryResponse> { Success = false, Message = "Lỗi kết nối" };
        }
    }

    // 4. DELETE
    public async Task<ApiResponse<object>> Delete(int id)
    {
        try
        {
            var response = await _http.DeleteAsync($"categories/{id}");
            
            if (response.IsSuccessStatusCode)
            {
                return new ApiResponse<object>
                {
                    Success = true,
                    Message = "Xóa thành công"
                };
            }
            return new ApiResponse<object> { Success = false, Message = "Xóa thất bại" };
        }
        catch
        {
             return new ApiResponse<object> { Success = false, Message = "Lỗi kết nối" };
        }
    }
}

// ================= DTO ĐÃ SỬA LỖI =================

public class CategoryCreateRequest
{
    // QUAN TRỌNG: Map tên biến "Name" (C#) thành "CategoryName" (JSON) khi gửi đi
    // Điều này giúp Backend nhận được dữ liệu, không bị null
    [JsonPropertyName("CategoryName")] 
    public string Name { get; set; } = string.Empty;
}

public class CategoryResponse
{
    // Map dữ liệu nhận về từ Backend (CategoryId -> Id)
    [JsonPropertyName("CategoryId")] 
    public int Id { get; set; }

    // Map dữ liệu nhận về từ Backend (CategoryName -> Name)
    [JsonPropertyName("CategoryName")] 
    public string Name { get; set; } = string.Empty;
}