using blazor_web.DTOs.Customer;
using blazor_web.Models;

namespace blazor_web.Services.Customer
{
    public interface ICustomerService
    {
        Task<ApiResponse<GetCustomerResponse>> GetCustomerAsync(GetCustomerRequest request);

        Task<ApiResponse<CustomerResponse>> CreateCustomerAsync(CreateCustomerRequest request);

        Task<ApiResponse<CustomerResponse>> UpdateCustomerAsync(int id, UpdateCustomerRequest request);

        Task<ApiResponse<string>> DeleteCustomerAsync(int id);
    }
}
