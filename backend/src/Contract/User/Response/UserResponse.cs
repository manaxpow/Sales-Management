public class UserResponse
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "staff";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class GetUserResponse
{
    public int Limit { get; set; }
    public int Page { get; set; }
    public int Total { get; set; }
    public IEnumerable<UserResponse> Users { get; set; }
}