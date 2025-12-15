namespace blazor_web.DTOs.Auth
{
    public class ChangePasswordRequest
    {
        public int UserId { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
}
