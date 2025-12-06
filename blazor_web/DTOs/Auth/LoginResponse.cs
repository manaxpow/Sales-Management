using blazor_web.DTOs.Customer;
using blazor_web.DTOs.User;

namespace blazor_web.DTOs.Auth
{

    public record LoginResponse
    {
        public required UserResponse User { get; set; }
        public CustomerResponse? Customer { get; set; }

        public required string AccessToken { get; set; }
    }

}
