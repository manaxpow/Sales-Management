using System.ComponentModel.DataAnnotations;
namespace blazor_web.Models;

public class Customer
{
    public int CustomerId { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên khách hàng.")]
    [StringLength(100, ErrorMessage = "Tên không được quá 100 ký tự.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
    [RegularExpression(@"^0\d{9}$", ErrorMessage = "SĐT không hợp lệ (Phải bắt đầu bằng 0 và có 10 số).")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập Email.")]
    [EmailAddress(ErrorMessage = "Định dạng Email không đúng.")]
    public string Email { get; set; } = string.Empty;

    [StringLength(200, ErrorMessage = "Địa chỉ không được quá 200 ký tự.")]
    public string Address { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }
}