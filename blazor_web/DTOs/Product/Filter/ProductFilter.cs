namespace blazor_web.DTOs.Product.Filter {
    public class ProductFilter {
        public string? Search { get; set; }
        public int? CategoryId { get; set; }
        public int? SupplierId { get; set; }
        public decimal? MaxPrice { get; set; }
    }

}
