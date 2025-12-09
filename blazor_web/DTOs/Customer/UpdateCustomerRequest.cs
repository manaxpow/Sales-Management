using System.ComponentModel.DataAnnotations;

namespace blazor_web.DTOs.Customer
{
    public class UpdateCustomerRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập họ tên")]
        [MinLength(2, ErrorMessage = "Họ tên ít nhất 2 ký tự")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập email")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
    }
}