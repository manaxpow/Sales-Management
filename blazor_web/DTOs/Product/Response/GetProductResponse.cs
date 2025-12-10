namespace blazor_web.DTOs.Product.Response {
    public class GetProductResponse {
        public List<ProductResponse> Products { get; set; } = new();
        public int TotalProduct { get; set; }
        public int TotalPage { get; set; }
        public int CurrentPage { get; set; }
    }
}
