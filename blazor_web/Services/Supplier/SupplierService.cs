using System.Net.Http.Json;
using blazor_web.DTOs.Supplier;
using blazor_web.Models;
using System.Collections.Generic;

namespace blazor_web.Services.Supplier
{
    public class SupplierService : ISupplierService
    {
        private readonly HttpClient _httpClient;
        private const string URL_API = "suppliers";

        public SupplierService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // --- GET Suppliers ---
        public async Task<ApiResponse<List<SupplierResponse>>> GetSuppliersAsync()
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<SupplierResponse>>>(URL_API);

                return response ?? new ApiResponse<List<SupplierResponse>> { Success = false, Message = "Phản hồi API rỗng hoặc không hợp lệ." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching suppliers: {ex.Message}");
                return new ApiResponse<List<SupplierResponse>> { Success = false, Message = $"Vui lòng điền đúng thông tin" };
            }
        }

        // --- GET Supplier By ID ---
        public async Task<ApiResponse<SupplierResponse>> GetSupplierByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<SupplierResponse>>($"{URL_API}/{id}");
                return response ?? new ApiResponse<SupplierResponse> { Success = false, Message = "Phản hồi API rỗng." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching supplier {id}: {ex.Message}");
                return new ApiResponse<SupplierResponse> { Success = false, Message = $"Vui lòng điền đúng thông tin" };
            }
        }

        // --- POST Create Supplier ---
        public async Task<ApiResponse<SupplierResponse>> CreateSupplierAsync(CreateSupplierRequest request)
        {
            try
            {
                var httpResponse = await _httpClient.PostAsJsonAsync(URL_API, request);

                if (!httpResponse.IsSuccessStatusCode)
                {
                    var errorContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<SupplierResponse>>();
                    return errorContent ?? new ApiResponse<SupplierResponse> { Success = false, Message = $"Tạo nhà cung cấp thất bại. (HTTP {httpResponse.StatusCode})" };
                }

                var successContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<SupplierResponse>>();
                return successContent ?? new ApiResponse<SupplierResponse> { Success = false, Message = "Tạo thành công nhưng dữ liệu trả về rỗng." };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating supplier: {ex.Message}");
                return new ApiResponse<SupplierResponse> { Success = false, Message = $"Vui lòng điền đúng thông tin" };
            }
        }

        // --- PATCH Update Supplier ---
        public async Task<ApiResponse<SupplierResponse>> UpdateSupplierAsync(int id, UpdateSupplierRequest request)
        {
            try
            {
                request.Id = id;

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
                return new ApiResponse<SupplierResponse> { Success = false, Message = $"Vui lòng điền đúng thông tin" };
            }
        }

        // --- DELETE Supplier ---
        public async Task<ApiResponse<bool>> DeleteSupplierAsync(int id)
        {
            try
            {
                var httpResponse = await _httpClient.DeleteAsync($"{URL_API}/{id}");

                if (httpResponse.IsSuccessStatusCode)
                {
                    return new ApiResponse<bool> { Success = true, Data = true, Message = "Xóa thành công." };
                }

                var errorContent = await httpResponse.Content.ReadFromJsonAsync<ApiResponse<bool>>();
                return errorContent ?? new ApiResponse<bool> { Success = false, Message = $"Xóa nhà cung cấp thất bại. (HTTP {httpResponse.StatusCode})" };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting supplier {id}: {ex.Message}");
                return new ApiResponse<bool> { Success = false, Message = $"Vui lòng điền đúng thông tin" };
            }
        }
    }
}