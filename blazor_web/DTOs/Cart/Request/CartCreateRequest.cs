namespace blazor_web.DTOs.Cart.Request {
    public class CartCreateRequest {
        public int UserId { get; set; }
        public int? CustomerId { get; set; }
        public string? Status { get; set; } = "active";
        public decimal? ShippingAmount { get; set; }
        public decimal? TaxAmount { get; set; }
    }
}
