namespace blazor_web.DTOs.Product.Response {
    public class ProductResponse {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public int Status { get; set; }
        public string? SupplierName { get; set; } = string.Empty;
        public int SupplierId { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Unit { get; set; } = string.Empty;
        public int? Quantity { get; set; }
    }
}
