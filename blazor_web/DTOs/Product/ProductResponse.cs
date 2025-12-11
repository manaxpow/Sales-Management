using System.ComponentModel.DataAnnotations;

namespace blazor_web.DTOs.Product
{
    public class ProductResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Status { get; set; }
        public string Barcode { get; set; } = string.Empty;
        
        // Thông tin liên quan
        public string? SupplierName { get; set; }
        public int SupplierId { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public int? Quantity { get; set; } // Lấy từ Inventory
        
        // Thông tin giá và đơn vị
        public decimal Price { get; set; } // decimal cho giá tiền
        public string Unit { get; set; } = string.Empty;
    }
}