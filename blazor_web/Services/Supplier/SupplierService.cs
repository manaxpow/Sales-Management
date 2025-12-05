using System.Net.Http.Json;
using blazor_web.DTOs.Supplier;
using blazor_web.Models;
using System.Collections.Generic;

namespace blazor_web.Services.Supplier
{
    // Lớp triển khai ISupplierService, chịu trách nhiệm gọi API liên quan đến Nhà cung cấp
    public class SupplierService : ISupplierService
    {
        private readonly HttpClient _httpClient;
        private const string URL_API = "suppliers"; // Endpoint chính của Supplier

        public SupplierService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // --- GET Suppliers (Lấy danh sách) ---
        public async Task<ApiResponse<List<SupplierResponse>>> GetSuppliersAsync()
        {
            try
            {
                // GET: /suppliers
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<SupplierResponse>>>(URL_API);

                if (response == null)
                {
                     return new ApiResponse<List<SupplierResponse>> { Success = false, Message = "Phản hồi API rỗng hoặc không hợp lệ." };
                }

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching suppliers: {ex.Message}");
                return new ApiResponse<List<SupplierResponse>> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- GET Supplier By ID (Lấy chi tiết) ---
        public async Task<ApiResponse<SupplierResponse>> GetSupplierByIdAsync(int id)
        {
            try
            {
                // GET: /suppliers/{id}
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<SupplierResponse>>($"{URL_API}/{id}");
                return response ?? new ApiResponse<SupplierResponse> { Success = false, Message = "Phản hồi API rỗng." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching supplier {id}: {ex.Message}");
                return new ApiResponse<SupplierResponse> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- POST Create Supplier (Tạo mới) ---
        public async Task<ApiResponse<SupplierResponse>> CreateSupplierAsync(CreateSupplierRequest request)
        {
            try
            {
                // POST: /suppliers, Body: CreateSupplierRequest (JSON)
                var httpResponse = await _httpClient.PostAsJsonAsync(URL_API, request);

                if (!httpResponse.IsSuccessStatusCode)
                {
                    var errorContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<SupplierResponse>>();
                    return errorContent ?? new ApiResponse<SupplierResponse> { Success = false, Message = $"Tạo nhà cung cấp thất bại. (HTTP {httpResponse.StatusCode})" };
                }

                // Đọc response thành công (Results.Created trả về 201 Created)
                var successContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<SupplierResponse>>();
                return successContent ?? new ApiResponse<SupplierResponse> { Success = false, Message = "Tạo thành công nhưng dữ liệu trả về rỗng." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating supplier: {ex.Message}");
                return new ApiResponse<SupplierResponse> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- PATCH Update Supplier (Cập nhật) ---
        public async Task<ApiResponse<SupplierResponse>> UpdateSupplierAsync(int id, UpdateSupplierRequest request)
        {
            try
            {
                // Backend API dùng PATCH /suppliers và mong đợi UpdateSupplierRequest có ID trong body
                request.Id = id; // Đảm bảo ID được đặt trong request body
                
                var httpResponse = await _httpClient.PatchAsJsonAsync(URL_API, request);

                if (!httpResponse.IsSuccessStatusCode)
                {
                    var errorContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<SupplierResponse>>();
                    return errorContent ?? new ApiResponse<SupplierResponse> { Success = false, Message = $"Cập nhật nhà cung cấp thất bại. (HTTP {httpResponse.StatusCode})" };
                }

                var successContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<SupplierResponse>>();
                return successContent ?? new ApiResponse<SupplierResponse> { Success = false, Message = "Cập nhật thành công nhưng dữ liệu trả về rỗng." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating supplier {id}: {ex.Message}");
                return new ApiResponse<SupplierResponse> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }

        // --- DELETE Supplier (Xóa) ---
        public async Task<ApiResponse<bool>> DeleteSupplierAsync(int id)
        {
            try
            {
                // API: DELETE /suppliers/{id}
                var httpResponse = await _httpClient.DeleteAsync($"{URL_API}/{id}");

                if (httpResponse.IsSuccessStatusCode)
                {
                    // Thường là 204 No Content hoặc 200 OK
                    return new ApiResponse<bool> { Success = true, Data = true, Message = "Xóa thành công." };
                }
                
                // Đọc phản hồi lỗi
                var errorContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<bool>>();
                return errorContent ?? new ApiResponse<bool> { Success = false, Message = $"Xóa nhà cung cấp thất bại. (HTTP {httpResponse.StatusCode})" };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting supplier {id}: {ex.Message}");
                return new ApiResponse<bool> { Success = false, Message = $"Lỗi mạng: {ex.Message}" };
            }
        }
    }
}