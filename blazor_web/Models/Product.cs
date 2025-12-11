using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace blazor_web.Models
{
    public class Product
    {
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn danh mục.")]
        [Range(1, int.MaxValue, ErrorMessage = "Danh mục không hợp lệ.")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn nhà cung cấp.")]
        [Range(1, int.MaxValue, ErrorMessage = "Nhà cung cấp không hợp lệ.")]
        public int SupplierId { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập tên sản phẩm.")]
        [StringLength(150, ErrorMessage = "Tên sản phẩm không được quá 150 ký tự.")]
        public string ProductName { get; set; } = string.Empty;

        public string Barcode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập giá bán.")]
        [Range(1, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập đơn vị tính.")]
        [StringLength(20, ErrorMessage = "Đơn vị tính không được quá 20 ký tự.")]
        public string Unit { get; set; } = "pcs";

        [Range(0, 1, ErrorMessage = "Trạng thái không hợp lệ.")]
        public int Status { get; set; } = 1; // 1 = Active, 0 = Inactive

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
