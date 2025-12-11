using System.ComponentModel.DataAnnotations;

namespace blazor_web.DTOs.Product
{
    public class CreateProductRequest
    {
        [Required]
        public int SupplierId { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        [Required(ErrorMessage = "Tên sản phẩm không được trống")]
        public string ProductName { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        public decimal Price { get; set; }
        
        [Required]
        public string Unit { get; set; } = "pcs";
        
        public int Status { get; set; } = 1; 
    }
}