using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

public class GetUserRequest
{
    [FromQuery]
    public string? Search { get; init; }

    [FromQuery]
    public string? Role { get; init; }

    [FromQuery]
    [Range(1, 100, ErrorMessage = "Limit phải từ 1 đến 100.")]
    public int? Limit { get; init; } = 10;

    [FromQuery]
    [Range(1, int.MaxValue, ErrorMessage = "Page phải lớn hơn 0.")]
    public int? Page { get; init; } = 1;
}

public class CreateUserRequest
{
    [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên đăng nhập từ 3 - 50 ký tự.")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
    [StringLength(100, ErrorMessage = "Họ tên không được quá 100 ký tự.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng chọn vai trò.")]
    public string Role { get; set; } = "Staff";
}

public class UpdateUserRequest
{
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu mới phải từ 6 ký tự trở lên.")]
    public string? Password { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
    [StringLength(100, ErrorMessage = "Họ tên không được quá 100 ký tự.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng chọn vai trò.")]
    public string Role { get; set; } = "Staff";

}