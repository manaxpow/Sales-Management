namespace blazor_web.DTOs.CartItem.Request {
    public class CartItemCreateRequest {
        public int CartId { get; set; }           // nếu null, server có thể trả lỗi → ensure create cart trước
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public decimal PriceSnapshot { get; set; }
        public int Quantity { get; set; }
        public string? Unit { get; set; } = "pcs";
    }
}
