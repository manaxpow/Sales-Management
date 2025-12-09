<<<<<<< HEAD
// using blazor_web.DTOs.Customer;
// using blazor_web.DTOs.Auth;
// using blazor_web.Models;
// using blazor_web.Services.Storage;
// using System.Net.Http.Json;

// namespace blazor_web.Services.Customer
// {
//     public class CustomerApiService : ICustomerApiService
//     {
//         private readonly HttpClient _http;
//         private readonly ILocalStorageService _localStorage;
//         private const string BaseUrl = "api/customers";

//         public CustomerApiService(HttpClient http, ILocalStorageService localStorage)
//         {
//             _http = http;
//             _localStorage = localStorage;
//         }

//         public async Task<ApiResponse<CustomerResponse>> GetByIdAsync(int id)
//         {
//             try
//             {
//                 // Gọi GET api/customers/{id}
//                 var response = await _http.GetAsync($"{BaseUrl}/{id}");

//                 if (!response.IsSuccessStatusCode)
//                 {
//                     return new ApiResponse<CustomerResponse>
//                     {
//                         Success = false,
//                         Message = "Không thể lấy thông tin khách hàng",
//                         Data = default
//                     };
//                 }

//                 var result = await response.Content.ReadFromJsonAsync<ApiResponse<CustomerResponse>>();
//                 return result!;
//             }
//             catch (Exception ex)
//             {
//                 return new ApiResponse<CustomerResponse>
//                 {
//                     Success = false,
//                     Message = ex.Message,
//                     Data = default
//                 };
//             }
//         }

//         public async Task<ApiResponse<CustomerResponse>> UpdateProfileAsync(blazor_web.DTOs.Customer.UpdateCustomerRequest request)
//         {
//             try
//             {
//                 var loginInfo = await _localStorage.GetLoginInfoAsync();
                
//                 if (loginInfo?.Customer?.Id == null)
//                 {
//                     return new ApiResponse<CustomerResponse>
//                     {
//                         Success = false,
//                         Message = "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.",
//                         Data = default
//                     };
//                 }

//                 var customerId = loginInfo.Customer.Id;
//                 var response = await _http.PutAsJsonAsync($"{BaseUrl}/{customerId}", request);

//                 if (!response.IsSuccessStatusCode)
//                 {
//                     var error = await response.Content.ReadAsStringAsync();
//                     return new ApiResponse<CustomerResponse>
//                     {
//                         Success = false,
//                         Message = string.IsNullOrEmpty(error) ? "Lỗi cập nhật" : error,
//                         Data = default
//                     };
//                 }

//                 var result = await response.Content.ReadFromJsonAsync<ApiResponse<CustomerResponse>>();

//                 if (result?.Success == true && result.Data != null)
//                 {
//                     // Map lại dữ liệu
//                     loginInfo.Customer = result.Data;
//                     // await _localStorage.SetLoginInfoAsync(loginInfo);
//                 }

//                 return result ?? new ApiResponse<CustomerResponse>
//                 {
//                     Success = false,
//                     Message = "Dữ liệu trả về không hợp lệ",
//                     Data = default
//                 };
//             }
//             catch (Exception ex)
//             {
//                 return new ApiResponse<CustomerResponse>
//                 {
//                     Success = false,
//                     Message = "Lỗi kết nối: " + ex.Message,
//                     Data = default
//                 };
//             }
//         }
//     }
// }
=======
using blazor_web.DTOs.Customer;
using blazor_web.DTOs.Auth;
using blazor_web.Models;
using blazor_web.Services.Storage;
using System.Net.Http.Json;

namespace blazor_web.Services.Customer
{
    public class CustomerApiService : ICustomerApiService
    {
        private readonly HttpClient _http;
        private readonly ILocalStorageService _localStorage;
        private const string BaseUrl = "api/customers";

        public CustomerApiService(HttpClient http, ILocalStorageService localStorage)
        {
            _http = http;
            _localStorage = localStorage;
        }

        public async Task<ApiResponse<CustomerResponse>> GetByIdAsync(int id)
        {
            try
            {
                // Gọi GET api/customers/{id}
                var response = await _http.GetAsync($"{BaseUrl}/{id}");

                if (!response.IsSuccessStatusCode)
                {
                    return new ApiResponse<CustomerResponse>
                    {
                        Success = false,
                        Message = "Không thể lấy thông tin khách hàng",
                        Data = default
                    };
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<CustomerResponse>>();
                return result!;
            }
            catch (Exception ex)
            {
                return new ApiResponse<CustomerResponse>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = default
                };
            }
        }

        public async Task<ApiResponse<CustomerResponse>> UpdateProfileAsync(blazor_web.DTOs.Customer.UpdateCustomerRequest request)
        {
            try
            {
                var loginInfo = await _localStorage.GetLoginInfoAsync();
                
                if (loginInfo?.Customer?.Id == null)
                {
                    return new ApiResponse<CustomerResponse>
                    {
                        Success = false,
                        Message = "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.",
                        Data = default
                    };
                }

                var customerId = loginInfo.Customer.Id;
                var response = await _http.PutAsJsonAsync($"{BaseUrl}/{customerId}", request);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return new ApiResponse<CustomerResponse>
                    {
                        Success = false,
                        Message = string.IsNullOrEmpty(error) ? "Lỗi cập nhật" : error,
                        Data = default
                    };
                }

                var result = await response.Content.ReadFromJsonAsync<ApiResponse<CustomerResponse>>();

                if (result?.Success == true && result.Data != null)
                {
                    // Map lại dữ liệu
                    loginInfo.Customer = result.Data;
                    // await _localStorage.SetLoginInfoAsync(loginInfo);
                }

                return result ?? new ApiResponse<CustomerResponse>
                {
                    Success = false,
                    Message = "Dữ liệu trả về không hợp lệ",
                    Data = default
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<CustomerResponse>
                {
                    Success = false,
                    Message = "Lỗi kết nối: " + ex.Message,
                    Data = default
                };
            }
        }
    }
}
>>>>>>> b39374e (109 save  handle profile)
