namespace blazor_web.Dtos.Customer
{
    public class CustomerResponse
    {
        public int Id { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}