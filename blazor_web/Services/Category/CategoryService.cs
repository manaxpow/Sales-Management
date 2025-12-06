using blazor_web.Models;         
using System.Net.Http.Json;
using System.Text.Json; // Cần thêm namespace này
using System.Text.Json.Serialization; 

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

    // 2. CREATE (Đã nâng cấp bắt lỗi)
    public async Task<ApiResponse<CategoryResponse>> Create(CategoryCreateRequest req)
    {
        try
        {
            var response = await _http.PostAsJsonAsync("categories", req);
            
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadFromJsonAsync<CategoryResponse>();
                return new ApiResponse<CategoryResponse> { Success = true, Data = data! };
            }

            // SỬA: Đọc lỗi chi tiết từ Backend
            string errorMsg = await GetErrorMessageAsync(response, "Tạo thất bại");
            return new ApiResponse<CategoryResponse> { Success = false, Message = errorMsg };
        }
        catch (Exception ex)
        {
            return new ApiResponse<CategoryResponse> { Success = false, Message = $"Lỗi kết nối: {ex.Message}" };
        }
    }

    // 3. UPDATE (Đã nâng cấp bắt lỗi)
    public async Task<ApiResponse<CategoryResponse>> Update(int id, CategoryCreateRequest req)
    {
        try
        {
            var response = await _http.PutAsJsonAsync($"categories/{id}", req);
            
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadFromJsonAsync<CategoryResponse>();
                return new ApiResponse<CategoryResponse> { Success = true, Data = data! };
            }

            // SỬA: Đọc lỗi chi tiết từ Backend
            string errorMsg = await GetErrorMessageAsync(response, "Cập nhật thất bại");
            return new ApiResponse<CategoryResponse> { Success = false, Message = errorMsg };
        }
        catch (Exception ex)
        {
             return new ApiResponse<CategoryResponse> { Success = false, Message = $"Lỗi kết nối: {ex.Message}" };
        }
    }

    // 4. DELETE (Đã nâng cấp bắt lỗi)
    public async Task<ApiResponse<object>> Delete(int id)
    {
        try
        {
            var response = await _http.DeleteAsync($"categories/{id}");
            
            if (response.IsSuccessStatusCode)
            {
                return new ApiResponse<object> { Success = true, Message = "Xóa thành công" };
            }

            // SỬA: Đọc lỗi chi tiết từ Backend
            string errorMsg = await GetErrorMessageAsync(response, "Xóa thất bại");
            return new ApiResponse<object> { Success = false, Message = errorMsg };
        }
        catch (Exception ex)
        {
             return new ApiResponse<object> { Success = false, Message = $"Lỗi kết nối: {ex.Message}" };
        }
    }

    // ================= HÀM PHỤ ĐỂ ĐỌC LỖI TỪ BACKEND =================
    private async Task<string> GetErrorMessageAsync(HttpResponseMessage response, string defaultMessage)
    {
        try
        {
            // Đọc toàn bộ nội dung trả về
            var content = await response.Content.ReadAsStringAsync();

            // Nếu nội dung rỗng, trả về mặc định
            if (string.IsNullOrWhiteSpace(content)) return defaultMessage;

            // Thử parse xem có phải JSON format { "message": "..." } không (Format backend bạn đang dùng)
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var errorDto = JsonSerializer.Deserialize<BackendErrorDto>(content, options);

            if (!string.IsNullOrEmpty(errorDto?.Message))
            {
                return errorDto.Message; // Trả về thông báo cụ thể từ Backend
            }
            
            // Nếu không phải JSON hoặc không có field message, trả về raw content (nếu ngắn)
            if (content.Length < 200) return content;
        }
        catch
        {
            // Nếu lỗi parse JSON, bỏ qua
        }

        return $"{defaultMessage} (Mã lỗi: {response.StatusCode})";
    }
}

// Class phụ để hứng lỗi JSON từ Backend
public class BackendErrorDto
{
    public string Message { get; set; } = string.Empty;
}

// ================= DTO =================

public class CategoryCreateRequest
{
    [JsonPropertyName("CategoryName")] 
    public string Name { get; set; } = string.Empty;
}

public class CategoryResponse
{
    [JsonPropertyName("CategoryId")] 
    public int Id { get; set; }

    [JsonPropertyName("CategoryName")] 
    public string Name { get; set; } = string.Empty;
}