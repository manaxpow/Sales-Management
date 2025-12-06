namespace blazor_web.Dtos.Auth
{
    public class RegisterRequest
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Address {get; set;}
    }
}
