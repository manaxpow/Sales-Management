using System.ComponentModel.DataAnnotations;

namespace blazor_web.DTOs.Supplier
{
    // DTO để gửi yêu cầu Tạo mới nhà cung cấp (KHÔNG có ID)
    public class CreateSupplierRequest
    {
        [Required(ErrorMessage = "Tên nhà cung cấp không được trống")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại không được trống")]
        [RegularExpression(@"^0\d{9,10}$", ErrorMessage = "Số điện thoại không hợp lệ (10-11 số)")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được trống")]
        [EmailAddress(ErrorMessage = "Email sai định dạng")]
        public string Email { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
    }
}