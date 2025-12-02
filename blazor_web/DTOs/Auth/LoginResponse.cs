using blazor_web.Dtos.Customer;
using blazor_web.Dtos.User;

namespace blazor_web.Dtos.Auth
{

    public record LoginResponse
    {
        public required UserResponse User { get; set; }
        public CustomerResponse? Customer { get; set; }

        public required string AccessToken { get; set; }
    }

}
