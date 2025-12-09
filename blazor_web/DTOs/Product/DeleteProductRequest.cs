using System.ComponentModel.DataAnnotations;

namespace blazor_web.DTOs.Product
{
    public class DeleteProductRequest
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        public int Status { get; set; }
    }
}