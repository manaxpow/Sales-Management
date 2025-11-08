using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Users
{
    public Users() { }

    [Key]
    public int Id { get; set; }

    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "ENUM('admin','staff')")]
    public string Role { get; set; } = "staff"; 

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
