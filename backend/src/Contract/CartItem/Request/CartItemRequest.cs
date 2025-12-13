public class CartItemRequest {
    public int? CartId { get; set; }
    public int? ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal? PriceSnapshot { get; set; }
    public int? Quantity { get; set; }
    public string? Unit { get; set; }
}
