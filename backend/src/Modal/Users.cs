using System.ComponentModel.DataAnnotations;

public class Users
{
    public Users() { }

    [Key]

    public int Id { get; set; }
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public string FullName { get; set; }
    public int Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }


}