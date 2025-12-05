using blazor_web.Models;         
using System.Net.Http.Json;
using System.Text.Json.Serialization; // Cần thiết để map tên trường

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
            // Backend trả về mảng [] -> Hứng bằng List<CategoryResponse>
            // URL chỉ gọi "categories" vì BaseAddress đã có "/api/"
            var data = await _http.GetFromJsonAsync<List<CategoryResponse>>("categories");

            // Tự gói lại thành ApiResponse để UI không bị lỗi
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
                // Backend trả về đối tượng vừa tạo -> Hứng raw object
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
                // Backend trả về { success = true/false } hoặc 200 OK
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

// ================= QUAN TRỌNG: CẬP NHẬT DTO =================

// Request tạo mới (thường Backend nhận JSON { "name": "..." })
public class CategoryCreateRequest
{
    // Nếu Backend yêu cầu "categoryName" thì map, nếu "name" thì giữ nguyên
    // Dựa vào code backend bạn gửi trước đó (CreateCategoryRequest), kiểm tra xem nó dùng property gì.
    // Thường là:
    public string Name { get; set; } = string.Empty; 
}

// Response trả về (Backend trả: categoryId, categoryName)
public class CategoryResponse
{
    [JsonPropertyName("categoryId")] // Map với JSON Backend
    public int Id { get; set; }

    [JsonPropertyName("categoryName")] // Map với JSON Backend
    public string Name { get; set; } = string.Empty;
}