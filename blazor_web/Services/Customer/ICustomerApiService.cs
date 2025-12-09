using blazor_web.DTOs.Customer;
using blazor_web.Models;

namespace blazor_web.Services.Customer
{
    public interface ICustomerApiService
    {
        Task<ApiResponse<CustomerResponse>> UpdateProfileAsync(blazor_web.DTOs.Customer.UpdateCustomerRequest request);
        Task<ApiResponse<CustomerResponse>> GetByIdAsync(int id);
    }
}