namespace blazor_web.DTOs.CartItem.Request {
    public class CartItemUpdateRequest {
        public int? ProductId { get; set; }
        public decimal? PriceSnapshot { get; set; }
        public int? Quantity { get; set; }
        public string? Unit { get; set; }

    }
}
