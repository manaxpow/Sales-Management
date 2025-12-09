namespace blazor_web.DTOs.Product
{
    public class ProductFilter
    {
        public int? SupplierId { get; set; }
        public int? CategoryId { get; set; }
        public string? ProductName { get; set; }
        public decimal? Price { get; set; } 
        public int? Page { get; set; }
        public int? Limit { get; set; }
        public int? Status { get; set; }
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; } 
    }
}