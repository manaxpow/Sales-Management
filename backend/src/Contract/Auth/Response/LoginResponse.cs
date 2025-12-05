
    public record LoginResponse
    {
        public required UserResponse User { get; set; }
        public CustomerResponse? Customer { get; set; }
    
        public required string AccessToken { get; set; }
    }
