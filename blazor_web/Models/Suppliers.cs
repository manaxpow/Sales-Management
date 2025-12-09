using System.ComponentModel.DataAnnotations;

namespace blazor_web.Models
{
    public class Supplier
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên nhà cung cấp không được trống")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại không được trống")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được trống")]
        public string Email { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}