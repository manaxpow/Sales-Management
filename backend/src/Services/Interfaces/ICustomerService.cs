public interface ICustomerService {
    Task<ApiResponse<GetCustomerResponse>> GetAllCustomer(GetCustomerRequest request);
    Task<ApiResponse<CustomerResponse>> GetCustomerById(int id);
    Task<ApiResponse<CustomerResponse>> UpdateCustomer(int id, UpdateCustomerRequest updatedCustomer);
    Task<ApiResponse<string>> DeleteCustomer(int id);
    Task<ApiResponse<CustomerResponse>> CreateCustomer(CreateCustomerRequest newCustomer);

    Task<bool> CheckExistCustomer(string email, string phone,int? id );
}
